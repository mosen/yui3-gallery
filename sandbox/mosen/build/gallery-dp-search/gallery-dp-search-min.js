YUI.add("gallery-dp-search",function(c){var b=c.Lang,a=c.Node;c.namespace("DP").Search=c.Base.create("dp-search",c.Widget,[],{initializer:function(d){this.publish("queryUpdate",{defaultFn:this._defQueryUpdateFn});},destructor:function(){},renderUI:function(){var d=this.get("contentBox");this._renderInput(d);this._renderFieldSelector(d);this._renderButtons(d);},_renderInput:function(d){if(!this.get("inputNode")){var e=a.create(c.substitute(this.TEMPLATE_INPUT,{className:this.getClassName("input")}));this.set("inputNode",e);d.append(e);}},_renderFieldSelector:function(){},_renderButtons:function(e){if(!this.get("searchButtonNode")){var d=a.create(c.substitute(this.TEMPLATE_BUTTON,{className:this.getClassName("submit"),value:this.get("strings.submitLabel")}));e.append(d);this.set("searchButtonNode",d);}if(!this.get("resetButtonNode")){var f=a.create(c.substitute(this.TEMPLATE_BUTTON,{className:this.getClassName("reset"),value:this.get("strings.resetLabel")}));e.append(f);this.set("resetButtonNode",f);}},bindUI:function(){this.get("inputNode").on("focus",this._handleInputFocus,this);this.get("inputNode").on("blur",this._handleInputBlur,this);var d=(!c.UA.opera)?"down:":"press:";d+="13";this.get("inputNode").on("key",this._handleInputEnterKey,d,this);if(this.get("timeout")>0){this.get("inputNode").on("keypress",this._handleInputKeyPress,this);}c.one(".yui3-dp-search-reset").on("click",this._handleResetClick,this);c.one(".yui3-dp-search-submit").on("click",this._uiSetValue(),this);this.after("valueChange",this._afterValueChange);this.after("fieldChange",this._afterFieldChange);},syncUI:function(){this._uiSetValue();},_tipShown:false,showTip:function(){this.get("inputNode").addClass(this.getClassName("input","tip"));this.get("inputNode").set("value",this.get("strings.tip"));this._tipShown=true;},hideTip:function(){this.get("inputNode").removeClass(this.getClassName("input","tip"));this.get("inputNode").set("value","");this._tipShown=false;},_handleInputFocus:function(){if(this._tipShown){this.hideTip();}},_handleInputBlur:function(){if(this._tipShown===false){if(this.get("searchOnBlur")===true){this.set("value",this.get("inputNode").get("value"));}this._uiSetValue();}},_handleInputEnterKey:function(d){this.set("value",this.get("inputNode").get("value"));this.get("inputNode").blur();},_handleInputKeyPress:function(d){if(this._currentTimeoutID!==null||this._currentTimeoutID!==undefined){clearTimeout(this._currentTimeoutID);}this._currentTimeoutID=setTimeout(c.bind(this._handleTimeoutElapsed,this),this.get("timeout"));},_handleTimeoutElapsed:function(d){this.set("value",this.get("inputNode").get("value"));},_handleResetClick:function(){this.set("value","");},_afterValueChange:function(){this._uiSetValue();this.fire("queryUpdate",{parameters:{q:this.get("value")}});},_afterFieldChange:function(){this._uiSetField();},_uiSetValue:function(){var d=this.get("value");if(""===d){this.showTip();}else{this.get("inputNode").set("value",d);}},_uiSetField:function(){},_defQueryUpdateFn:function(d){},TEMPLATE_INPUT:'<input type="text" class="{className}" value="">',TEMPLATE_BUTTON:'<input type="button" class="{className}" value="{value}">'},{_currentTimeoutID:null,HTML_PARSER:{contentBox:".yui3-dp-search",inputNode:".yui3-dp-search-input",inputWrapper:".yui3-dp-search-input-wrapper",resetButtonNode:".yui3-dp-search-reset",searchButtonNode:".yui3-dp-search-submit",value:function(e){var d=e.one(".yui3-dp-search-input");if(d){return d.get("value");}else{return"";}}},ATTRS:{inputNode:{},inputWrapper:{},resetButtonNode:{},searchButtonNode:{},timeout:{value:150,validator:b.isNumber},searchOnBlur:{value:true,validator:b.isBoolean},field:{value:null},value:{value:"",validator:b.isString},strings:{value:{tip:"Enter text to search",submitLabel:"search",resetLabel:"reset"}}}});},"@VERSION@",{requires:["base","widget","substitute"]});