(function () {
    let shadowRoot;

    var Ar = [];
    var ArChartGauge = [];
    var regionCircle;

    let template = document.createElement("template");
    template.innerHTML = `
		<style type="text/css">	
		body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
		}
		</style>       
	`;

    //google jquery
    const jqueryjs = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
    //gmaps API
    const gmapsjs = "https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAuqtG8XhmKQPGoYpFi9dqZmhZTDWGCxE0";
    //gmap Clustering API
    const markerclustererjs = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => { console.log("Load: " + src); resolve(script); }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }

    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.position,
            map: mapObj,
            title: props.title,
            icon: props.icon,
        });
        if (props.iconImage) {
            marker.setIcon(props.iconImage);
        }
        //Check content
        if (props.content) {
            marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.setContent('<div class="name">' + marker.getTitle() + '</div>');
                infoWindow.open(marker.getMap(), marker);
            });
        }

        return marker;
    }

    function clearMapMarkers() {
        for (i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(null);
        }
        markerCluster.clearMarkers();
        markerCluster = null;
        gmarkers = [];
    }

    function check(loc, radius) {
        //clearMapMarkers();
        //mapObj.setZoom(8);
        //mapObj.panTo(markerData[0].position);
        if (radius > 0) {
            var meter = radius * 1000;
            if (regionCircle && regionCircle.setMap)
                regionCircle.setMap(null);
            regionCircle = new google.maps.Circle({
                strokeColor: "#666565",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#666565",
                fillOpacity: 0.19,
                map: mapObj,
                center: munich,
                radius: meter,
                clickable: false
            });


            var kx = Math.cos(Math.PI * loc.lat() / 180) * 111;
            console.log(kx);
            for (i = 0; i < gmarkers.length; i++) {
                var pos = gmarkers[i].getPosition();

                //console.log(gmarkers[i]);
                var dx = Math.abs(loc.lng() - pos.lng()) * kx;
                var dy = Math.abs(loc.lat() - pos.lat()) * 111;
                var c = Math.sqrt(dx * dx + dy * dy) <= radius;
                console.log(radius);
                if (c) {
                    gmarkers[i].setVisible(true);
                    //console.log(gmarkers[i].getTitle());
                } else {
                    gmarkers[i].setVisible(false);
                    //console.log(gmarkers[i].getTitle());
                }
            }
            mapObj.fitBounds(regionCircle.getBounds());

        }
    }

    class Box extends HTMLElement {
        constructor() {
            console.log("constructor");
            super();
            shadowRoot = this.attachShadow({
                mode: "open"
            });

            shadowRoot.appendChild(template.content.cloneNode(true));

            this._firstConnection = 0;

            this.addEventListener("click", event => {
                console.log('click');
                var event = new Event("onClick");
                this.dispatchEvent(event);

            });
            this._props = {};
        }

        //Fired when the widget is added to the html DOM of the page
        connectedCallback() {
            console.log("connectedCallback");
        }

        //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback() {
            console.log("disconnectedCallback");
        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log("onCustomWidgetBeforeUpdate");
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(changedProperties) {

            console.log("onCustomWidgetAfterUpdate");
            console.log(changedProperties);

  /*           if ("value" in changedProperties) {
                console.log("value:" + changedProperties["value"]);
                this.$value = changedProperties["value"];
            }

            if ("formula" in changedProperties) {
                console.log("formula:" + changedProperties["formula"]);
                this.$formula = changedProperties["formula"];

            } */

            console.log("firsttime: " + this._firstConnection);
            var that = this;

            if (this._firstConnection === 0) {
                const div = document.createElement('div');
                let divid = changedProperties.widgetName;
                this._tagContainer = divid;
                div.innerHTML = '<div id="container_' + divid + '"></div>';
                shadowRoot.appendChild(div);

                const css = document.createElement('div');
                css.innerHTML = '<style>#container_' + divid + ' {width: 100%; height: 500px;}</style>'
                shadowRoot.appendChild(css);

                var mapcanvas_divstr = shadowRoot.getElementById('container_' + divid);
                console.log(mapcanvas_divstr);

                var mapOptions = {
                    zoom: 6,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scrollwheel: false
                };

                async function LoadLibs() {
                    try {
                        await loadScript(jqueryjs);
                        await loadScript(gmapsjs);
                        await loadScript(markerclustererjs);
                    } catch (e) {
                        alert(e);
                    } finally {
                        Draw(Ar, that._firstConnection);
                        that._firstConnection = 1;
                    }
                }
                LoadLibs();

                var mapObj = new google.maps.Map(mapcanvas_divstr, mapOptions);
                var marker = [];
                var infoWindow = new google.maps.InfoWindow();

                var icon = {
                    url: 'https://commerce.baywa.com/binaries/content/gallery/standorte/config/google-maps/baywamarker_64.png',
                    scaledSize: new google.maps.Size(50, 50)
                };

                var markerData = [
                    {
                        position: new google.maps.LatLng(48.137154, 11.576124),
                        title: 'Munich',
                        content: '添付コンテンツX',
                        icon: icon
                    },
                    {
                        position: new google.maps.LatLng(48.366512, 10.894446),
                        title: 'Augsburg',
                        content: '添付コンテンツA',
                        icon: icon
                    },
                    {
                        position: new google.maps.LatLng(48.452841, 10.277513),
                        title: 'Günzburg',
                        content: '添付コンテンツB',
                        icon: icon
                    },
                    {
                        position: new google.maps.LatLng(48.766666, 11.433333),
                        title: 'Ingolstadt',
                        content: '添付コンテンツY',
                        icon: icon
                    }
                ];

                var myMarkers = [];
                var gmarkers = [];
                for (var i = 0; i < markerData.length; i++) {
                    gmarkers.push(addMarker(markerData[i]));
                }

                var markerCluster = new MarkerClusterer(mapObj, gmarkers,
                    {
                        maxZoom: 15,
                        styles: [{
                            url: 'https://commerce.baywa.com/binaries/content/gallery/standorte/config/google-maps/baywa_cluster_pin.svg',
                            textColor: "white",
                            textSize: "14",
                            height: 42,
                            width: 42,
                            anchorIcon: [32, 21]
                        }]
                    }

                );


            } else {
            }
        }

        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
            console.log("onCustomWidgetDestroy");
        }
    }
    customElements.define("com-hasba-sac-gmaps", Box);
})();