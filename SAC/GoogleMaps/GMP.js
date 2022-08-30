var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    const template = document.createElement('template')
    template.innerHTML = `
    <style type="text/css"> 
    .map-wrapper {
        width: 100%;
        height: 100%;

      }
      .map-canvas {
          width: 100%;
          height: 100%;
          margin: 0 auto;
      }
    </style> 
      `
    class SampleLifeExpectancy2 extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root')

            this._props = {}
            this.render()
        }

        onCustomWidgetResize(width, height) {
            //this.render()

        }
        // ------------------
        // Scripting methods
        // ------------------
        async render(resultSet) {
            await getScriptPromisify('https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAuqtG8XhmKQPGoYpFi9dqZmhZTDWGCxE0')
            await getScriptPromisify('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js')

            /*      this._placeholder = this._root.getElementById('#chart_div_map1')
                if (this._placeholder) {
                    this._root.removeChild(this._placeholder)
                    this._placeholder = null
                }*/

            const div = document.createElement('div');
            div.classList.add('map-canvas');
            //let divid = changedProperties.widgetName;
            //this._tagContainer = divid;

            div.innerHTML = '<div id="chart_div_map1" class="map-wrapper"></div>';
            this._shadowRoot.appendChild(div);


            var mapcanvas_divstr = this._shadowRoot.getElementById('chart_div_map1');

            var latlng = new google.maps.LatLng(51.1642292, 10.4541194);
            var munich = new google.maps.LatLng(48.137154, 11.576124);

            var mapOptions = {
                zoom: 6,
                center: latlng,
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                //  scrollwheel: false
            };
            var mapObj = new google.maps.Map(mapcanvas_divstr, mapOptions);
            var marker = [];
            var infoWindow = new google.maps.InfoWindow();

            var icon = {
                url: 'https://commerce.baywa.com/binaries/content/gallery/standorte/config/google-maps/baywamarker_64.png',
                scaledSize: new google.maps.Size(50, 50)
            };

            // マーカーデータ
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

            // マーカーの表示
            var myMarkers = [];
            var gmarkers = [];
            for (var i = 0; i < markerData.length; i++) {
                gmarkers.push(addMarker(markerData[i]));
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

            function clearMapMarkers() {
                for (i = 0; i < gmarkers.length; i++) {
                    gmarkers[i].setMap(null);
                }
                markerCluster.clearMarkers();
                markerCluster = null;
                gmarkers = [];
            }
        }

    }

    customElements.define('com-hasba-sac-gmaps', SampleLifeExpectancy2)
})()