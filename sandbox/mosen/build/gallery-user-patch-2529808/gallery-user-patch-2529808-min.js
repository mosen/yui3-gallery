YUI.add("gallery-user-patch-2529808",function(a){a.Plugin.DataTableScroll.prototype.injected_bindUI=a.Plugin.DataTableScroll.prototype.bindUI;a.Plugin.DataTableScroll.prototype.bindUI=function(){this.get("host").after("recordsetChange",a.bind(this.syncUI,this));this.injected_bindUI();};a.Plugin.DataTableScroll.prototype.injected_syncWidths=a.Plugin.DataTableScroll.prototype._syncWidths;a.Plugin.DataTableScroll.prototype._syncWidths=function(){var d=this.get("host"),c=d.get("recordset"),b=c.getLength();if(b===0){return false;}else{this.injected_syncWidths();}};},"@VERSION@",{skinnable:false,requires:["datatable"]});