YUI.add("gallery-bt-container",function(e,t){var n="heightChange",r="widthChange",i=e.Bottle.Device.getPositionFixedSupport(),s=function(e,t,n){var r,s=t&&i,o=n!==undefined?n:this.get("nativeScroll");this.get("scrollView")&&(r=this.get(e?"headerNode":"footerNode"),r&&(o&&s&&r.addClass("btFixed"),r.setStyles({top:e&&o&&s?0:"",bottom:!e&&o&&s?0:""}),i&&this.get("scrollView").get("boundingBox").setStyle(e?"marginTop":"marginBottom",t&&o?r.get("offsetHeight")+"px":0)),this.get(t?"srcNode":"scrollNode").insert(r,e?0:undefined),this._syncScrollHeight())};e.namespace("Bottle").Container=e.Base.create("btcontainer",e.Widget,[e.WidgetChild,e.zui.Attribute],{initializer:function(){this._btcEventHandlers=new e.EventHandle([this.after(n,this._syncScrollHeight),this.on(r,this._syncScrollWidth)])},destructor:function(){this._btcEventHandlers.detach(),this.get("rendered")&&this.get("scrollView").destroy(!0),delete this._eventHandlers},renderUI:function(){var t=e.Node.create('<div class="bt-container-scroll"></div>'),n=this.get("srcNode"),r=this.get("headerNode"),i=this.get("bodyNode"),s=this.get("footerNode"),o=new e.ScrollView(e.merge(this.get("cfgScroll"),{axis:"y",srcNode:t}));this.set("scrollNode",t),this.set("scrollView",o),n.append(t),t.append(r),e.UA.ie&&e.UA.ie<8&&t.append('<div class="btDummy"></div>'),t.append(i),t.append(s),o.render(),this.set_again("headerFixed"),this.set_again("footerFixed"),this.set_again("translate3D"),this.set_again("nativeScroll")},_syncScrollWidth:function(e){var t=this.get("scrollView");t&&t.set("width",e.newVal)},_syncScrollHeight:function(){var t=this.get("nativeScroll"),n=t?e.Bottle.Device.getBrowserHeight():this.get("height"),r,i,s=this.get("scrollView");if(!s||!n)return;e.later(1,this,function(){r=this.get("footerNode"),this.get("footerFixed")?n-=r.get("clientHeight"):r&&this.get("fullHeight")&&(i=r.previous(),i.setStyle("minHeight",n-i.getY()-r.get("clientHeight")+"px")),t||(n-=s.get("boundingBox").get("offsetTop"),s.set("height",n))})}},{ATTRS:{nativeScroll:{value:!1,validator:e.Lang.isBoolean,setter:function(t){var n=this.get("scrollView");return n&&(n.set("disabled",t),n.get("boundingBox").addClass("btFixedScroll"),t?n.unplug(e.zui.RAScroll):(n.plug(e.zui.RAScroll,{horizontal:!1,cooperation:!0}),e.Bottle.Device.getTouchSupport()||n.plug(e.zui.ScrollHelper))),s.apply(this,[!0,this.get("headerFixed"),t]),s.apply(this,[!1,this.get("footerFixed"),t]),t}},headerNode:{value:undefined,writeOnce:!0,setter:function(t){var n=e.one(t);if(n)return n.addClass("btHeader"),this.set("headerFixed",n.getData("position")==="fixed"),n}},footerNode:{value:undefined,writeOnce:!0,setter:function(t){var n=e.one(t);if(n)return n.addClass("btFooter"),this.set("footerFixed",n.getData("position")==="fixed"),n}},bodyNode:{writeOnce:!0},scrollNode:{writeOnce:!0},scrollView:{writeOnce:!0},cfgScroll:{value:{flick:{minDistance:10,minVelocity:.3}},writeOnce:!0,lazyAdd:!1},fullHeight:{value:!0,validator:e.Lang.isBoolean},translate3D:{value:!0,validator:e.Lang.isBoolean,setter:function(e){return this.get("scrollNode").toggleClass("bt-translate3d",e),e}},headerFixed:{value:!1,validator:e.Lang.isBoolean,setter:function(e){return s.apply(this,[!0,e]),e}},footerFixed:{value:!1,validator:e.Lang.isBoolean,setter:function(e){return s.apply(this,[!1,e]),e}}},HTML_PARSER:{headerNode:"> [data-role=header]",bodyNode:"> [data-role=body]",footerNode:"> [data-role=footer]",cfgScroll:function(t){try{return e.JSON.parse(t.getData("cfg-scroll"))}catch(n){}},fullHeight:function(e){return e.getData("full-height")==="false"?!1:!0},translate3D:function(e){return e.getData("translate3d")==="false"?!1:!0}}})},"gallery-2013.02.27-21-03",{requires:["scrollview","widget-child","json-parse","gallery-zui-attribute","gallery-zui-rascroll","gallery-zui-scrollhelper","gallery-bt-device"]});