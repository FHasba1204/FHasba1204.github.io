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
        height: 650px;
      }
      .map-canvas {
          width: 100%;
          height: 100%;
          margin: 0 auto;
      }
    </style> 
      `
    class SampleLifeExpectancy2 extends HTMLElement {
      constructor () {
        super()
  
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.appendChild(template.content.cloneNode(true))
  
        this._root = this._shadowRoot.getElementById('root')
  
        this._props = {}
        this.render()
      }
      
      onCustomWidgetResize (width, height) {
        this.render()
      }
      // ------------------
      // Scripting methods
      // ------------------
      async render (resultSet) {
        await getScriptPromisify('https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAuqtG8XhmKQPGoYpFi9dqZmhZTDWGCxE0')
        await getScriptPromisify('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js')
        
        const div = document.createElement('div');
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
      }

      onCustomWidgetResize(width, height){
        var check = 0;
    }
    }
  
    customElements.define('com-hasba-sac-gmaps', SampleLifeExpectancy2)
  })()