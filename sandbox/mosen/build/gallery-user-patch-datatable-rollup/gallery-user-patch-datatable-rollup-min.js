YUI.add("gallery-user-patch-datatable-rollup",function(g){g.Plugin.DataTableScroll.prototype.injected_bindUI=g.Plugin.DataTableScroll.prototype.bindUI;g.Plugin.DataTableScroll.prototype.bindUI=function(){this.get("host").after("recordsetChange",g.bind(this.syncUI,this));this.injected_bindUI();};g.Plugin.DataTableScroll.prototype.injected_syncWidths=g.Plugin.DataTableScroll.prototype._syncWidths;g.Plugin.DataTableScroll.prototype._syncWidths=function(){var k=this.get("host"),j=k.get("recordset"),i=j.getLength();if(i===0){return false;}else{this.injected_syncWidths();}};var c=g.ClassNameManager.getClassName,h="datatable",a=c(h,"liner"),e='<td headers="{headers}"><div class="'+a+'" style="text-align:{align};"></div></td>';g.DataTable.Base.prototype._createTbodyTdNode=function(k){var j=k.column,i=null;k.headers=j.headers;k.classnames=j.get("classnames");k.td=g.Node.create(g.substitute(e,k));k.liner=k.td.one("div");i=this.formatDataCell(k);if(g.Lang.isString(i)){k.value=i;k.liner.append(i);}return k.td;};g.Plugin.DataTableSort.prototype._beforeCreateTheadThNode=function(i){if(i.column.get("sortable")){i.value=g.substitute(this.get("template"),{link_class:i.link_class||"",link_title:i.column.get("title")||i.column.get("key"),link_href:"#",value:i.value});}};g.DataTable.Base.prototype._addCaptionNode=function(j){var i=this.get("caption");if(i){this._captionNode=j.createCaption();return this._captionNode;}else{return true;}};g.DataTable.Base.prototype._uiSetCaption=function(i){i=g.Lang.isValue(i)?i:"";if(i==""){if(g.Lang.isValue(this._captionNode)){this._captionNode.remove();}}else{if(!g.Lang.isValue(this._captionNode)){this._captionNode=this._tableNode.createCaption();}this._captionNode.setContent(i);}};g.Plugin.DataTableDataSource.prototype.onDataReturnInitializeTable=function(j){var k=this.get("host").get("recordset"),i=g.Object(k);i.set("records",j.response.results);this.get("host").set("recordset",i);};var c=g.ClassNameManager.getClassName,h="datatable",d=c(h,"first"),f=c(h,"last");g.DataTable.Base.prototype._createTheadTrNode=function(r,k,q){r.id=g.guid();var p=g.Node.create(g.substitute(this.get("trTemplate"),r)),m=0,l=r.columns,j=l.length,n;if(k){p.addClass(d);}if(q){p.addClass(f);}for(;m<j;++m){n=l[m];this._addTheadThNode({value:n.get("label"),column:n,tr:p});}return p;};var c=g.ClassNameManager.getClassName,h="datatable",b="column";g.Plugin.DataTableSort.prototype._uiSetLastSortedBy=function(m,j,i){var u=m&&m.key,n=m&&m.dir,t=j&&j.key,k=j&&j.dir,q=i.get("columnset"),s=q.keyHash[u],o=q.keyHash[t],r=i._tbodyNode,l,p;if(s){s.thNode.removeClass(c(h,n));l=r.all('td[headers="'+s.get("id")+'"]');l.removeClass(c(h,n));}if(o){o.thNode.addClass(c(h,k));p=r.all('td[headers="'+o.get("id")+'"]');p.addClass(c(h,k));}};},"@VERSION@");