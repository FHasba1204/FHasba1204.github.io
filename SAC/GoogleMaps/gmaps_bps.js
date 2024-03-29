(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Map Properties</legend>
				<table>
					<tr>
						<td>Characteristic Geo</td>
						<td><input id="bps_geochar" type="text" size="30" maxlength="30"></td>
					</tr>
                    <tr>
						<td>Characteristic Longitude</td>
						<td><input id="bps_Longitude" type="text" size="30" maxlength="30"></td>
					</tr>
                    <tr>
                        <td>Characteristic Latitude</td>
                        <td><input id="bps_Latitude" type="text" size="30" maxlength="30"></td>
                    </tr>
                    <tr>
                        <td>Characteristic Content</td>
                        <td><input id="bps_Content" type="text" size="30" maxlength="30"></td>
                    </tr>
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

	class GMapsBps extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
			//this._shadowRoot.getElementById("form").addEventListener("change", this._change.bind(this));
		}

 		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							geochar: this.geochar,
                            latitude: this.latitude,
                            longitude: this.longitude,
                            content: this.content
						}
					}
			}));
		} 


        _change(e) {
            this._changeProperty(e.target.name);
        }
        _changeProperty(name) {
            let properties = {};
            properties[name] = this[name];
            this._firePropertiesChanged(properties);
        }

        _firePropertiesChanged(properties) {
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

		set geochar(newGeoChar) {
			this._shadowRoot.getElementById("bps_geochar").value = newGeoChar;
		}

		get geochar() {
			return this._shadowRoot.getElementById("bps_geochar").value;
		}

        set latitude(newLongitudeChar) {
			this._shadowRoot.getElementById("bps_Longitude").value = newLongitudeChar;
		}

		get latitude() {
			return this._shadowRoot.getElementById("bps_Longitude").value;
		}

        set longitude(newLatitudeChar) {
			this._shadowRoot.getElementById("bps_Latitude").value = newLatitudeChar;
		}

		get longitude() {
			return this._shadowRoot.getElementById("bps_Latitude").value;
		}

        set content(newContentChar) {
			this._shadowRoot.getElementById("bps_Content").value = newContentChar;
		}

		get content() {
			return this._shadowRoot.getElementById("bps_Content").value;
		}
	}

	customElements.define("com-hasba-sac-gmaps-bps", GMapsBps);
})();