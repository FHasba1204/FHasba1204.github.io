(function () {
    let shadowRoot;

    let ArMbit = [], Ar = [], ArData = [], ArOptions = [], ArChart = [], ArPubNub = [];

    let template = document.createElement("template");
    template.innerHTML = `
        <style type="text/css"> 
        </style>       
    `;

    const pubnubjs = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
    const gaugejs = "https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAuqtG8XhmKQPGoYpFi9dqZmhZTDWGCxE0";
    const cluster = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.addEventListener("load", callback);
        shadowRoot.appendChild(script);
    };

    // Google Chart
    function GoogleChart(divstr, text, value, firsttime) {
        //google.setOnLoadCallback(function () {
            drawChart(divstr, text, value, firsttime);
       // });
    };

    function drawChart(divstr, text, value, firsttime) {
        if (firsttime === 0) {
            var latlng = new google.maps.LatLng(51.1642292, 10.4541194);
            var munich = new google.maps.LatLng(48.137154, 11.576124);

            var mapOptions = {
                zoom: 6,
                center: latlng,
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                //  scrollwheel: false
            };
            var mapObj = new google.maps.Map(mapcanvas_divstr, mapOptions);


        } else {

        }
    };

    function Draw(Ar, firsttime) {
        for (var i = 0; i < Ar.length; i++) {
            GoogleChart(Ar[i].div, Ar[i].id, 0, firsttime);
        }
    };

    class Box extends HTMLElement {
        constructor() {
            console.log("constructor");
            super();
            shadowRoot = this.attachShadow({
                mode: "open"
            });

            //shadowRoot.appendChild(googleloaderjs);
            shadowRoot.appendChild(template.content.cloneNode(true));

            this._firstConnection = 0;

            this.addEventListener("click", event => {
                console.log('click');
                var event = new Event("onClick");
                this.dispatchEvent(event);
            });
            this._props = {};
        }

        connectedCallback() {
            console.log("connectedCallback");
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log("onCustomWidgetBeforeUpdate");
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            console.log("onCustomWidgetAfterUpdate");
            console.log(changedProperties);

            /*    if ("value" in changedProperties) {
                   console.log("value:" + changedProperties["value"]);
                   this.$value = changedProperties["value"];
               }
   
               if ("title" in changedProperties) {
                   console.log("title:" + changedProperties["title"]);
                   this.$title = changedProperties["title"];
               }
   
               if ("subtitle" in changedProperties) {
                   console.log("subtitle:" + changedProperties["subtitle"]);
                   this.$subtitle = changedProperties["subtitle"];
               }
   
               if ("min" in changedProperties) {
                   console.log("min:" + changedProperties["min"]);
                   this.$min = changedProperties["min"];
               }
   
               if ("max" in changedProperties) {
                   console.log("max:" + changedProperties["max"]);
                   this.$max = changedProperties["max"];
               }*/

            var that = this;

            if (this._firstConnection === 0) {
                const div = document.createElement('div');
                let divid = changedProperties.widgetName;
                this._tagContainer = divid;
                div.innerHTML = '<div id="chart_div' + divid + '"></div>';
                shadowRoot.appendChild(div);


                var mapcanvas_divstr = shadowRoot.getElementById('chart_div' + divid);
                console.log(mapcanvas_divstr);
                this._divid = mapcanvas_divstr;

                Ar.push({
                    'id': divid,
                    'div': mapcanvas_divstr,
                });


                loadScript(pubnubjs, function () {
                    console.log("Load:" + pubnubjs);

                    loadScript(gaugejs, function () {
                        console.log("Load:" + gaugejs);
                        Draw(Ar, that._firstConnection);
                        that._firstConnection = 1;
                    });
                });

            } else {
                /*       var id = this.$value.split("|")[0];
                      console.log("id: " + id);
      
                      var value = this.$value.split("|")[1];
                      console.log("value:" + value);
      
                      var title = this.$title;
                      console.log("title: " + title);
      
                      var subtitle = this.$subtitle;
                      console.log("subtitle: " + subtitle);
      
                      var min = this.$min;
                      console.log("min: " + min);
      
                      var max = this.$max;
                      console.log("max: " + max);
      
      
                      if (value !== "") {
                          var foundIndex = Ar.findIndex(x => x.id == id);
                          console.log("foundIndex: " + foundIndex);
      
                          if (foundIndex !== -1) {
                              drawChart(Ar[foundIndex].div, id, parseInt(value), this._firstConnection);
                          }
                      } */
            }
        }
    }

    customElements.define("com-hasba-sac-gmaps", Box);
})();