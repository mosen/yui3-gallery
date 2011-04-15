YUI.add("gallery-ebisu-dualslider",function(g){var d=g.Lang,a="node",b="min",f="max",e="value",c=Math.round;g.namespace("Ebisu").DualSlider=g.Base.create("ebisu-dualslider",g.Slider,[],{renderUI:function(){var h=this.get("contentBox");this.rail=this.renderRail();this._uiSetRailLength(this.get("length"));this.thumbs=this.renderThumbs();this.rail.appendChild(this.thumbs[0]);this.rail.appendChild(this.thumbs[1]);h.appendChild(this.rail);h.addClass(this.getClassName(this.axis));},renderThumbs:function(){this._initThumbUrl();var h=this.get("thumbUrl"),i=g.Node.create(g.substitute(this.THUMB_TEMPLATE,{thumbClass:this.getClassName("thumb","l"),thumbShadowClass:this.getClassName("thumb","shadow"),thumbImageClass:this.getClassName("thumb","image"),thumbShadowUrl:h,thumbImageUrl:h})),j=g.Node.create(g.substitute(this.THUMB_TEMPLATE,{thumbClass:this.getClassName("thumb","r"),thumbShadowClass:this.getClassName("thumb","shadow"),thumbImageClass:this.getClassName("thumb","image"),thumbShadowUrl:h,thumbImageUrl:h}));return[i,j];},_bindThumbDD:function(){var h={constrain:this.rail};h["stick"+this.axis.toUpperCase()]=true;this._dd=new g.DD.Drag({node:this.thumbs[0],bubble:false,on:{"drag:start":g.bind(this._onDragStart,this)},after:{"drag:drag":g.bind(this._afterDrag,this),"drag:end":g.bind(this._afterDragEnd,this)}});this._ddr=new g.DD.Drag({node:this.thumbs[1],bubble:false,on:{"drag:start":g.bind(this._onDragStart,this)},after:{"drag:drag":g.bind(this._afterDrag,this),"drag:end":g.bind(this._afterDragEnd,this)}});this._dd.plug(g.Plugin.DDConstrained,h);this._ddr.plug(g.Plugin.DDConstrained,h);},_calculateFactor:function(){this._calculateFactorDual(this.thumbs[0]);this._calculateFactorDual(this.thumbs[1]);},_calculateFactorDual:function(j){var l=this.get("length"),i=j.getStyle(this._key.dim),k=this.get(b),h=this.get(f);l=parseFloat(l,10)||150;i=parseFloat(i,10)||15;this._factor=(h-k)/(l-i);}},{NAME:"dualSlider",ATTRS:{}});},"@VERSION@",{requires:["base","dd","slider"]});