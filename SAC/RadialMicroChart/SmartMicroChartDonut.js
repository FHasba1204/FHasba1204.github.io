(function() {
    let _shadowRoot;
    let _id;

    let div;
    let widgetName;
    var Ar = [];

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>        
    `;

    class SmartMicroChart extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();            

            //_shadowRoot.querySelector("#oView").id = _id + "_oView";


            this._export_settings = {};
            this._export_settings.percentage = 0.0;
            this._export_settings.valuecolor = "";
            this._export_settings.width = 0;
            this._export_settings.height = 0;

            this._valuecolor = {};
            this._valuecolor.Critical = sap.m.ValueColor.Critical;
            this._valuecolor.Error = sap.m.ValueColor.Error;
            this._valuecolor.Good = sap.m.ValueColor.Good;
            this._valuecolor.None = sap.m.ValueColor.None;
            this._valuecolor.Neutral = sap.m.ValueColor.Neutral;

            this.addEventListener("press", event => {
                console.log('press');
                var event = new Event("onPress");
				this.dispatchEvent(event);

            });

            this._firstConnection = 0;            
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            loadthis(that, changedProperties);
        }

        _renderExportButton() {
            let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
            console.log("_renderExportButton-components");
            console.log(components);
            console.log("end");
        }

        _firePropertiesChanged() {
            this.percentage = 0.0;
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        percentage: this.percentage
                    }
                }
            }));
        }

        // SETTINGS
        get percentage() {
            return this._export_settings.percentage;
        }
        set percentage(value) {
        	console.log("setPercentage:" + value);
            this._export_settings.percentage = value;
        }

        get height() {
            return this._export_settings.height;
        }
        set height(value) {
        	console.log("setHeight:" + value);
            this._export_settings.height = value;
        }

        get width() {
            return this._export_settings.width;
        }
        set width(value) {
        	console.log("setWidth:" + value);
            this._export_settings.width = value;
        }

        get valuecolor() {
            return this._export_settings.valuecolor;
        }
        set valuecolor(value) {
            this._export_settings.valuecolor = value;
        }

        static get observedAttributes() {
            return [
                "percentage",
                "charttype",
                "height",
                "width",
                "valuecolor"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("com-voith-sac-smartmicrochart", SmartMicroChart);

    // UTILS
    function loadthis(that, changedProperties) {
        var that_ = that;

         widgetName = changedProperties.widgetName;
         if(typeof widgetName === "undefined") {
         	widgetName = that_.widgetName;
         }
     //   widgetName = "content_smartmicrochart";
         div = document.createElement('div');
         div.slot = "content_" + widgetName;
         if (that_.clientWidth = 0)
        //  {
        //     width = 90; 
        //  }
        //  width = that.clientWidth;
        //  height = that.clientHeight;
        percentage = that_.percentage;
        valuecolor = that_._valuecolor[that_._export_settings.valuecolor];
        if(that._firstConnection === 0) {
        	console.log("--First Time --");

        	let div0 = document.createElement('div');   
        	div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.suite.ui.microchart"><m:FlexBox renderType="Bare" direction="Column" class=""><m:items><m:FlexBox id="chartContainer" width="{= ${'+ widgetName +'>/width}+\'px\'}" height="{= ${'+ widgetName +'>/height}+\'px\'}" renderType="Bare" class=""><m:items><RadialMicroChart size="Responsive" valueColor="{' + widgetName + '>/valuecolor}" percentage="{' + widgetName + '>/percentage}" press="onPress" class=""/></m:items></m:FlexBox></m:items></m:FlexBox></mvc:View></script>';
        	_shadowRoot.appendChild(div0);  

            let div1 = document.createElement('div');            
            div1.innerHTML = '<div id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"></slot></div>';
            _shadowRoot.appendChild(div1);   

            that_.appendChild(div);   	
            var mapcanvas_divstr = _shadowRoot.getElementById('oView_' + widgetName);
            Ar.push({
                'id': widgetName,
                'div': mapcanvas_divstr
            });
            console.log(Ar);
    	}

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                "sap/ui/model/json/JSONModel",
                "sap/m/MessageToast",
                "sap/ui/core/library",
                "sap/ui/core/Core",
                'sap/ui/model/Filter',
                'sap/m/library',
                'sap/m/MessageBox',
                'sap/ui/unified/DateRange',
                'sap/ui/core/format/DateFormat'
            ], function(jQuery, Controller, JSONModel, MessageToast, coreLibrary, Core, Filter, mobileLibrary, MessageBox, DateRange, DateFormat) {
                "use strict";

                return Controller.extend("myView.Template", {
                    onInit: function() {
                    	console.log("-------oninit--------");
                    	console.log(that._export_settings.percentage);
                    	console.log("widgetName:" + that.widgetName);

                    	if(that._firstConnection === 0) {
                            that._firstConnection = 1;

                            this._oModel = new JSONModel({
                                percentage: that._export_settings.percentage,
                                width: that._export_settings.width,
                                height: that._export_settings.height,
                                valuecolor: that._valuecolor[that_._export_settings.valuecolor]
                            });
                            sap.ui.getCore().setModel(this._oModel, that.widgetName);
                        } else {
                           var oModel = sap.ui.getCore().getModel(that.widgetName);
                            oModel.setProperty("/percentage", that._export_settings.percentage);
                            oModel.setProperty("/width", that._export_settings.width);
                            oModel.setProperty("/height", that._export_settings.height);
                            oModel.setProperty("/valuecolor", that._valuecolor[that_._export_settings.valuecolor]);
                        }
                    },

                    onPress : function(evt) {
						//MessageToast.show("The GenericTile is pressed.");
						that._firePropertiesChanged();
						this.settings = {};
                        this.settings.percentage = "";
                        that.dispatchEvent(new CustomEvent("onStart", {
                            detail: {
                                settings: this.settings
                            }
                        }));
					}

                });
            });

            //### THE APP: place the XMLView somewhere into DOM ###
            console.log("widgetName Final:" + that.widgetName);
            var foundIndex = Ar.findIndex(x => x.id == that.widgetName);
            var divfinal = Ar[foundIndex].div;
            console.log(divfinal);
            
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadScript(src, shadowRoot) {
        return new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                console.log("Load: " + src);
                resolve(script);
            }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }
})();