YUI.add("gallery-dp-dd-plugin-loopingdrag",function(a){a.namespace("DP").LoopingDrag=a.Base.create("gallery-dp-dd-plugin-loopingdrag",a.Plugin.Base,[],{initializer:function(b){this.afterHostEvent("drag:align",a.bind(this.align,this));this.afterHostEvent("drag:drag",a.bind(this.drag,this));this.publish("viewLoop",{defaultFn:this._defViewLoop});},destructor:function(){},align:function(j){var c=this.get("host").get("dragNode"),h=c.getXY(),f=this.get("host").actXY,b=this.get("host").deltaXY,d=125,g=500,i=450,n=10,l,k=undefined;if(f[0]<n){l=[(j.pageX-b[0])%g+g,f[1]];this.get("host").actXY=l;}if(f[0]>i){l=[(j.pageX-b[0])%g,f[1]];this.get("host").actXY=l;}if(l){var m=l[0]-this.get("loopedXY")[0];if(m>400){this.fire("viewLoop",{edge:this.LOOP_LEFTEDGE});}if(m<-200){this.fire("viewLoop",{edge:this.LOOP_RIGHTEDGE});}this.set("loopedXY",l);}},drag:function(){},_defViewLoop:function(b){},_dragNodeWidth:0,LOOP_LEFTEDGE:"leftedge",LOOP_RIGHTEDGE:"rightedge"},{NS:"loopingDrag",ATTRS:{offset:{value:null},loopedXY:{value:1}}});},"@VERSION@",{requires:["plugin","dd-drag","dd-constrain"]});