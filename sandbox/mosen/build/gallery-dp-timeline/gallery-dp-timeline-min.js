YUI.add("gallery-dp-timeline",function(g){var e=g.Lang;var c={rangeToDuration:function(m,h){if(!e.isDate(m)||!e.isDate(h)){return 0;}else{var l=1000*60*60*24,i=(h.getTimezoneOffset()-m.getTimezoneOffset())*60*1000,k=h.getTime()-m.getTime()-i,j=Math.ceil(k/l)+1;return j;}},rangeToDifference:function(m,h){if(!e.isDate(m)||!e.isDate(h)){return 0;}else{var l=1000*60*60*24,i=(h.getTimezoneOffset()-m.getTimezoneOffset())*60*1000,k=h.getTime()-m.getTime()-i,j=k/l;return Math.floor(j);}},zeroTime:function(h){h.setHours(0);h.setMinutes(0);h.setSeconds(0);h.setMilliseconds(0);return h;},addDays:function(i,j){var h=new Date();h.setTime(i.getTime());h.setDate(h.getDate()+j);return h;},subDays:function(i,j){var h=new Date();h.setTime(i.getTime());h.setDate(h.getDate()-j);return h;}};g.namespace("DP").TimelineUtil=c;var e=g.Lang,b=g.Node,f=g.ClassNameManager.getClassName("gallery-dp-timeline-event","content"),d=g.ClassNameManager.getClassName("gallery-dp-timeline-event","bounding");g.namespace("DP").TimelineEvent=g.Base.create("gallery-dp-timeline-event",g.Widget,[g.WidgetChild],{CONTENT_TEMPLATE:'<div class="'+f+'"></div>',BOUNDING_TEMPLATE:"<div></div>",initializer:function(h){this._afterDateChange();},renderUI:function(){var o=this.get("parent"),i=o.getEventWidth(this),j=this.get("start"),h=o.dateToLocalOffset(j),n=o._getChildFreeSlot(this,h),k=o.slotToOffset(n),l=h+i,m=o.get("slots");var p=b.create(g.substitute('<span class="{titleClassName}">{title}</span>',{titleClassName:o.getClassName("event","title"),title:this.get("summary")}));this.get("contentBox").append(p);this.set("slot",n);this.get("boundingBox").set("style.left",h+"px");this.get("boundingBox").set("style.top",k+"px");this.set("width",i+"px");m[n]=l;this.get("parent").set("slots",m);},bindUI:function(){this._parentEventHandles=[this.after("startChange",this._afterDateChange),this.after("finishChange",this._afterDateChange),this.after("slotChange",this._afterSlotChange),this.get("parent").after("offsetChange",this._afterParentDateChange,this)];this.after("parentChange",this._afterParentChange);},syncUI:function(){this.get("contentBox").addClass(this.getClassName(this.get("category")));},destructor:function(){},_afterDateChange:function(){this.set("duration",g.DP.TimelineUtil.rangeToDuration(this.get("start"),this.get("finish")));},_afterParentDateChange:function(j){var h=this.get("parent"),i=h.dateToLocalOffset(this.get("start"));this.get("boundingBox").set("style.left",i+"px");},_afterSlotChange:function(i){var h=this.get("parent").slotToOffset(this.get("slot"));this.get("boundingBox").set("style.top",h+"px");},_afterParentChange:function(){g.Array.each(this._parentEventHandles,function(i){i.detach();});},_parentEventHandles:[]},{NAME:"timelineEvent",HTML_PARSER:{},ATTRS:{start:{value:new Date(),setter:function(h){return e.isDate(h)?h:new Date(Date.parse(h));}},finish:{value:new Date(),setter:function(h){return e.isDate(h)?h:new Date(Date.parse(h));}},duration:{value:0,validator:e.isNumber},summary:{value:"",validator:e.isString},category:{value:"",validator:e.isString},slot:{value:undefined}}});var e=g.Lang,b=g.Node,a=g.DataType;g.namespace("DP").Timeline=g.Base.create("gallery-dp-timeline",g.Widget,[g.WidgetParent],{initializer:function(){this.calculateDateOffsets();this.publish("offsetChange",{});},destructor:function(){},renderUI:function(){this._nodeBackgroundContainer=this._renderBackgroundContainer();this._nodeHighlightsContainer=this._renderHighlightsContainer();this._renderBackgroundHighlights(this._nodeHighlightsContainer);this._nodeBackgroundContainer.append(this._nodeHighlightsContainer);this._nodeEventContainer=this._renderEventContainer();this._childrenContainer=this._nodeEventContainer;this.get("contentBox").append(this._nodeBackgroundContainer);this._nodeBackgroundContainer.append(this._nodeEventContainer);},bindUI:function(){this.get("contentBox").delegate("mouseenter",g.bind(this.onEventMouseEnter,this),"div.yui3-gallery-dp-timeline-event-content");this.get("contentBox").delegate("mouseleave",g.bind(this.onEventMouseLeave,this),"div.yui3-gallery-dp-timeline-event-content");this.on("gallery-dp-timeline-event:mousedown",this.onEventMouseClick);this.after("dateChange",this._afterDateChange);this.after("selectionChange",this._afterSelectionChange);this.after("addChild",this._afterChildrenChange);this.after("removeChild",this._afterChildrenChange);this._ddNodeBackgroundContainer=new g.DD.Drag({node:this.get("contentBox"),haltDown:false}).plug(g.Plugin.DDConstrained,{constrain:"view",stickX:true}).plug(g.DP.LoopingDrag,{offset:100});this._ddNodeBackgroundContainer.loopingDrag.after("viewLoop",this._onViewLoop());this.on("offsetChange",this.reflowEvents());this.on("offsetChange",function(){this._resetBackgroundHighlights();this._renderBackgroundHighlights(this._nodeHighlightsContainer);});},syncUI:function(){this.get("boundingBox").set("style.width",this.get("viewLength")*this.get("dayWidth")+"px");this.get("contentBox").set("style.left","400px");},_renderEventContainer:function(){var h=b.create(g.substitute(this.get("tplEventContainer"),{className:this.getClassName("event","container")}));return h;},_renderBackgroundContainer:function(){var h=b.create(g.substitute(this.get("tplBackgroundContainer"),{className:this.getClassName("background")}));h.set("style.width",this.get("length")*this.get("dayWidth")+"px");h.set("style.left",this.dateToGlobalOffset(this.get("startDate"))+"px");return h;},_renderHighlightsContainer:function(){var h=b.create(g.substitute(this.get("tplHighlightContainer"),{className:this.getClassName("highlights")}));h.set("style.width",this.get("length")*this.get("dayWidth")+"px");h.set("style.left",this.dateToGlobalOffset(this.get("startDate"))+"px");return h;},_renderBackgroundHighlights:function(h){g.Array.each(this._dates,function(j){if(this.isDatePublicHoliday(j.date)){var i=b.create(g.substitute(this.get("tplBackgroundHighlight"),{className:this.getClassName("background","highlight")}));i.set("style.left",this.dateToLocalOffset(j.date)+"px");
i.set("style.width",this.get("dayWidth")+"px");h.append(i);}},this);},_resetBackgroundHighlights:function(){this._nodeHighlightsContainer.set("innerHTML","");},_getChildFreeSlot:function(k,l){var j=this.get("slots"),h;if(e.isNumber(k.get("slot"))){return k.get("slot");}for(h=0;h<j.length;h++){if(j[h]<=l){break;}else{}}return h;},reflowEvents:function(){var i,j,h;this.set("slots",[]);this.each(function(k){k.set("slot",undefined);i=this.dateToLocalOffset(k.get("start"));j=this._getChildFreeSlot(k,i);k.set("slot",j);h=this.get("slots");h[j]=i+this.getEventWidth(k);this.set("slots",h);},this);},getEventWidth:function(h){return this.get("dayWidth")*h.get("duration");},removeSelected:function(){if(this.get("selection")!==undefined){this.get("selection").remove();}},_afterChildrenChange:function(){this.reflowEvents();},_afterDateChange:function(h){this.calculateDateOffsets();},afterSelectionChange:function(h){},_onViewLoop:function(){},_onBackgroundDrag:function(m){var j=Math.ceil((this.get("dayWidth")*this.get("length"))/2),l=j,i=0,h=this.get("contentBox").getXY();if(h[0]>l){m.preventDefault();this._ddNodeBackgroundContainer.actXY=[400,77];this.get("contentBox").setXY([400,1]);var k=g.DP.TimelineUtil.subDays(this.get("date"),4);this.set("date",k);}else{if(h[1]<(i+20)){m.preventDefault();this.get("contentBox").set("style.left","400px");this._ddNodeBackgroundContainer.stopDrag();this.set("date",g.DP.TimelineUtil.addDays(this.get("date"),4));this._ddNodeBackgroundContainer.start();}}},onEventMouseClick:function(j){var i=j.target,h=j.domEvent;if(this.get("multiple")){if(h.metaKey){i.set("selected",1);}else{this.deselectAll();i.set("selected",1);}}else{i.set("selected",1);}},onEventMouseEnter:function(h){h.currentTarget.addClass(this.getClassName("event","over"));},onEventMouseLeave:function(h){h.currentTarget.removeClass(this.getClassName("event","over"));},onEventKeyDelete:function(h){this.get("selection").remove();},onEventMouseDblClick:function(){this.add(this.get("childPrototype"));},calculateDateOffsets:function(){var h=this.get("startDate"),l=this.get("length"),n,k,m,j;this._dates=Array();for(j=0;j<l;j++){n=new Date(h.getTime());n.setDate(n.getDate()+j);k=this.dateToGlobalOffset(n);m=this.dateToLocalOffset(n);this._dates.push({date:n,left:k,leftLocal:m,mid:k+Math.ceil(this.get("dayWidth")/2),midLocal:m+Math.ceil(this.get("dayWidth")/2)});}this.fire("offsetChange");},getEndDate:function(){return g.DP.TimelineUtil.addDays(this.get("date"),(this.get("length")-1));},dateToOffset:function(k){var i=this.get("date"),h=g.DP.TimelineUtil.rangeToDifference(i,k),j=h*this.get("dayWidth");return j;},dateToGlobalOffset:function(k){var i=this.get("date"),h=g.DP.TimelineUtil.rangeToDifference(i,k),j=h*this.get("dayWidth");return j;},dateToLocalOffset:function(k){var i=this.get("startDate"),h=g.DP.TimelineUtil.rangeToDifference(i,k),j=h*this.get("dayWidth");return j;},slotToOffset:function(h){return h*(this.get("eventHeight"))+h*this.get("gutter");},isDatePublicHoliday:function(h){if(h.getDay()===0||h.getDay()===6){return true;}else{return false;}},_dates:Array()},{NAME:"timeline",ATTRS:{defaultChildType:{value:g.DP.TimelineEvent},tplEventContainer:{value:'<div class="{className}"></div>'},tplBackgroundContainer:{value:'<div class="{className}"></div>'},tplHighlightContainer:{value:'<div class="{className}"></div>'},tplBackgroundHighlight:{value:'<div class="{className}">&nbsp;</div>'},dayWidth:{value:100,validator:e.isNumber},eventHeight:{value:20,validator:e.isNumber},startDate:{getter:function(){var h=g.DP.TimelineUtil.subDays(this.get("date"),Math.ceil(this.get("length")/2));return h;}},date:{value:Date(),setter:function(h){var i=e.isDate(h)?h:new Date(Date.parse(h));return g.DP.TimelineUtil.zeroTime(i);}},endDate:{getter:function(){return g.DP.TimelineUtil.addDays(this.get("date"),Math.ceil(this.get("length")/2));}},length:{value:16,validator:e.isNumber},viewLength:{value:8,validator:e.isNumber},triggerLength:{value:4,validator:e.isNumber},slots:{value:Array(),validator:e.isArray},gutter:{value:3,validator:e.isNumber}},HTML_PARSER:{}});},"@VERSION@",{requires:["base","widget","widget-parent","widget-child","widget-position","substitute","node","datatype","dd-drag","dd-constrain"]});