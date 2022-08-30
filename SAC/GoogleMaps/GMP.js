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
  
      // ------------------
      // Scripting methods
      // ------------------
      async render (resultSet) {
        await getScriptPromisify('https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyAuqtG8XhmKQPGoYpFi9dqZmhZTDWGCxE0')
        await getScriptPromisify('https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js')
        
        this._placeholder = this._root.querySelector('#map-wrapper')
        if (this._placeholder) {
          this._root.removeChild(this._placeholder)
          this._placeholder = null
        }
  
        var latlng = new google.maps.LatLng(51.1642292, 10.4541194);
            var munich = new google.maps.LatLng(48.137154, 11.576124);

            var mapOptions = {
                zoom: 6,
                center: latlng,
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                //  scrollwheel: false
            };
            var mapObj = new google.maps.Map(divstr, mapOptions);
      }
    }
  
    customElements.define('com-hasba-sac-gmaps', SampleLifeExpectancy2)
  })()