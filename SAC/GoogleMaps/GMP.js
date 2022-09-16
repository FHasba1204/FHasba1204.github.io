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

        addMarker(props) {
            var marker = new google.maps.Marker({
                position: props.position,
                map: this._mapObj,
                title: props.title,
                icon: props.icon,
            });
            if (props.iconImage) {
                marker.setIcon(props.iconImage);
            }
            //Check content
            if (props.content) {
                marker.addListener("click", () => {
                    this._infoWindow.close();
                    this._infoWindow.setContent('<div class="name">' + marker.getTitle() + '</div>');
                    this._infoWindow.open(marker.getMap(), marker);
                });
            }

            return marker;
        }

        clearMapMarkers() {
            for (i = 0; i < this._gmarkers.length; i++) {
                this._gmarkers[i].setMap(null);
            }
            markerCluster.clearMarkers();
            markerCluster = null;
            this._gmarkers = [];
        }

        // ------------------
        // Scripting methods
        // ------------------
        async render(resultSet) {

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

            var latlng = new google.maps.LatLng(51.1642292, 10.4541194);

            var mapOptions = {
                zoom: 6,
                center: latlng,
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                //  scrollwheel: false
            };
            
                this._mapObj = new google.maps.Map(mapcanvas_divstr, mapOptions);
            
            var marker = [];
            var resultSetFinal = [];
            var infoWindow = new google.maps.InfoWindow();

            var icon_std = {
                url: 'https://commerce.baywa.com/binaries/content/gallery/standorte/config/google-maps/baywamarker_64.png',
                scaledSize: new google.maps.Size(50, 50)
            };
        }   
            var resultSet_sample = [
                {
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
                }];


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

            this.clearMapMarkers();

            // Markers
            resultSetFinal.forEach(dp => {
                var { rawValue, description } = dp[MEASURE_DIMENSION]

                this._marker = {
                    position: new google.maps.LatLng(Number(dp[longitude].id), Number(dp[latitude].id)),
                    title: dp[geoChar].description,
                    content: dp[content].description,
                    icon: icon_std
                }
                //markerData.push(marker)
                this._gmarkers.push(this.addMarker(this._marker))

            })


            var markerCluster = new MarkerClusterer(this._mapObj, this._gmarkers,
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



    }

    customElements.define('com-hasba-sac-gmaps', SampleLifeExpectancy2)
})()
