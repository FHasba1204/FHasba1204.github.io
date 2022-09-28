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
            this.init()
        }

        onCustomWidgetResize(width, height) {
            //this.render()

        }


        addMarker(props) {
            var marker = new google.maps.Marker({
                position: props.position,
                map: props.map,
                title: props.title,
                icon: props.icon,
            });
            if (props.iconImage) {
                marker.setIcon(props.iconImage);
            }
            //Check content
            if (props.content) {
                marker.addListener("click", () => {
                   // this._infoWindow.close();
                    //this._infoWindow.setContent('<div class="name">' + marker.getTitle() + '</div>');
                    //this._infoWindow.open(marker.getMap(), marker);
                    this._selection = marker.getTitle();
                    this.dispatchEvent(new CustomEvent("propertiesChanged", {
                        detail: {
                            properties: {
                                selection: this._selection
                            }
                        }
                    }));

                });
            }

            return marker;
        }



        clearMapMarkers() {
            if (this._gmarkers) {
                for (var i = 0; i < this._gmarkers.length; i++) {
                    this._gmarkers[i].setMap(null);
                }
                this._gmarkers = [];
            }
            if (this._markerCluster) {
                this._markerCluster.clearMarkers();
            }
        }

        drawCircle(latitude, longitude, radius) {
            //clearMapMarkers();
            //mapObj.setZoom(8);
            var loc = new google.maps.LatLng(latitude, longitude);
            if (radius > 0) {
                var meter = radius * 1000;

                if (this._regionCircle && this._regionCircle.setMap)
                    this._regionCircle.setMap(null);
                this._regionCircle = new google.maps.Circle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: "#FF0000",
                    fillOpacity: 0.6,
                    map: this._mapObj,
                    center: loc,
                    radius: meter,
                    clickable: false
                });


                var kx = Math.cos(Math.PI * loc.lat() / 180) * 111;
                console.log(kx);
                for (let i = 0; i < this._gmarkers.length; i++) {
                    var pos = this._gmarkers[i].getPosition();

                    //console.log(gmarkers[i]);
                    var dx = Math.abs(loc.lng() - pos.lng()) * kx;
                    var dy = Math.abs(loc.lat() - pos.lat()) * 111;
                    var c = Math.sqrt(dx * dx + dy * dy) <= radius;
                    console.log(radius);
                    /*    if (c) {
                           this._gmarkers[i].setVisible(true);
                           //console.log(gmarkers[i].getTitle());
                       } else {
                           this._gmarkers[i].setVisible(false);
                           //console.log(gmarkers[i].getTitle());
                       } */
                }
                this._mapObj.fitBounds(this._regionCircle.getBounds());

            }
        }

        clearCircle() {
            i(this._regionCircle)
            {
                this._regionCircle.setMap(null);
                this._mapObj.setCenter(this._latlng);
                this._mapObj.setZoom(6);
            }
        }

        resetAll() {
            if (this._regionCircle) {
                this._regionCircle.setMap(null);
            }

            this.clearMapMarkers();
            //this.render();
        }
        // ------------------
        // Scripting methods
        // ------------------
        async init() {

            await getScriptPromisify('https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAVtvix8ZhA1BRZLHS_DRSJtFsmQ8FQdf0')
            await getScriptPromisify('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js')

            /*      this._placeholder = this._root.getElementById('#chart_div_map1')
                if (this._placeholder) {
                    this._root.removeChild(this._placeholder)
                    this._placeholder = null
                }*/
            if (!this._mapObj) {
                const div = document.createElement('div');
                div.classList.add('map-canvas');
                //let divid = changedProperties.widgetName;
                //this._tagContainer = divid;

                div.innerHTML = '<div id="chart_div_map1" class="map-wrapper"></div>';
                this._shadowRoot.appendChild(div);


                var mapcanvas_divstr = this._shadowRoot.getElementById('chart_div_map1');

                this._latlng = new google.maps.LatLng(51.1642292, 10.4541194);

                var mapOptions = {
                    zoom: 6,
                    center: this._latlng,
                    // mapTypeId: google.maps.MapTypeId.ROADMAP,
                    //  scrollwheel: false
                };

                this._mapObj = new google.maps.Map(mapcanvas_divstr, mapOptions);
                this._infoWindow = new google.maps.InfoWindow();

            }
        }

        render(resultSet) {

            if (this._mapObj) {
                this.resetAll();

                var marker = [];
                var resultSetFinal = [];

                var icon_std = {
                    url: 'https://commerce.baywa.com/binaries/content/gallery/standorte/config/google-maps/baywamarker_64.png',
                    scaledSize: new google.maps.Size(50, 50)
                };
                var resultSet_sample = [];
                /*           {
                               "@MeasureDimension": {
                                   "id": "[Account].[parentId].&[Kennzahlcount]",
                                   "description": "Kennzahlcount",
                                   "rawValue": "1",
                                   "formattedValue": "1.00"
                               },
                               "Lieferant": {
                                   "id": "A & B Senatore Logistics GmbH",
                                   "description": "A & B Senatore Logistics GmbH",
                                   "properties": {}
                               },
                               "Postleitzahl": {
                                   "id": "90455",
                                   "description": "90455",
                                   "properties": {}
                               },
                               "LaengengradPunkt": {
                                   "id": "11.07845",
                                   "description": "11.07845",
                                   "properties": {}
                               },
                               "BreitengradPunkt": {
                                   "id": "49.37222",
                                   "description": "49.37222",
                                   "properties": {}
                               },
                               "GEO_DIM_Ort.Ort_GEOID": {
                                   "id": "90455-Nürnberg-Barlachstr. 9",
                                   "description": "90455-Nürnberg-Barlachstr. 9",
                                   "properties": {}
                               }
                           },
                           {
                               "@MeasureDimension": {
                                   "id": "[Account].[parentId].&[Kennzahlcount]",
                                   "description": "Kennzahlcount",
                                   "rawValue": "1",
                                   "formattedValue": "1.00"
                               },
                               "Lieferant": {
                                   "id": "Abschleppdienst Kelpin",
                                   "description": "Abschleppdienst Kelpin",
                                   "properties": {}
                               },
                               "Postleitzahl": {
                                   "id": "8538",
                                   "description": "8538",
                                   "properties": {}
                               },
                               "LaengengradPunkt": {
                                   "id": "12.03572",
                                   "description": "12.03572",
                                   "properties": {}
                               },
                               "BreitengradPunkt": {
                                   "id": "50.42541",
                                   "description": "50.42541",
                                   "properties": {}
                               },
                               "GEO_DIM_Ort.Ort_GEOID": {
                                   "id": "08538-Weischlitz-Am Gewerbering 1",
                                   "description": "08538-Weischlitz-Am Gewerbering 1",
                                   "properties": {}
                               }
                           },
                           {
                               "@MeasureDimension": {
                                   "id": "[Account].[parentId].&[Kennzahlcount]",
                                   "description": "Kennzahlcount",
                                   "rawValue": "1",
                                   "formattedValue": "1.00"
                               },
                               "Lieferant": {
                                   "id": "Andreas Schmid Int. Spedition",
                                   "description": "Andreas Schmid Int. Spedition",
                                   "properties": {}
                               },
                               "Postleitzahl": {
                                   "id": "86368",
                                   "description": "86368",
                                   "properties": {}
                               },
                               "LaengengradPunkt": {
                                   "id": "10.87901",
                                   "description": "10.87901",
                                   "properties": {}
                               },
                               "BreitengradPunkt": {
                                   "id": "48.42122",
                                   "description": "48.42122",
                                   "properties": {}
                               },
                               "GEO_DIM_Ort.Ort_GEOID": {
                                   "id": "86368-Gersthofen-Andreas-Schmid-Str.",
                                   "description": "86368-Gersthofen-Andreas-Schmid-Str.",
                                   "properties": {}
                               }
                           }]; */


                this._gmarkers = [];

                var MEASURE_DIMENSION = '@MeasureDimension'
                var geoChar = this.$geochar
                var content = this.$content
                var latitude = this.$latitude
                var longitude = this.$longitude

                var keys = [];
                if (resultSet) {

                    resultSetFinal = resultSet;

                } else {
                    resultSetFinal = resultSet_sample;
                    geoChar = "Postleitzahl"
                    content = "GEO_DIM_Ort.Ort_GEOID"
                    latitude = "LaengengradPunkt"
                    longitude = "BreitengradPunkt"
                }
                for (var i = 0; i < resultSetFinal.length; i++) {
                    Object.keys(resultSetFinal[i]).forEach(function (key) {
                        if (keys.indexOf(key) == -1) {
                            keys.push(key);
                        }
                    });
                }
                console.log(keys);

                // this.clearMapMarkers();

                // Markers
                resultSetFinal.forEach(dp => {
                    var { rawValue, description } = dp[MEASURE_DIMENSION]

                    this._marker = {
                        position: new google.maps.LatLng(Number(dp[latitude].id), Number(dp[longitude].id)),
                        title: dp[geoChar].description,
                        content: dp[content].description,
                        icon: icon_std,
                        map: this._mapObj
                    }
                    //markerData.push(marker)
                    this._gmarkers.push(this.addMarker(this._marker))

                })


                this._markerCluster = new MarkerClusterer(this._mapObj, this._gmarkers,
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
            }

        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if ("geochar" in changedProperties) {
                this.$geochar = changedProperties["geochar"];
            }

            if ("latitude" in changedProperties) {
                this.$latitude = changedProperties["latitude"];
            }

            if ("longitude" in changedProperties) {
                this.$longitude = changedProperties["longitude"];
            }

            if ("content" in changedProperties) {
                this.$content = changedProperties["content"];
            }

            this.render();
        }

        get selectedMarker() {
            return this._selection;
        }



    }

    customElements.define('com-hasba-sac-gmaps', SampleLifeExpectancy2)
})()
