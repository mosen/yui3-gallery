YUI.add("gallery-user-patch-dt-rollup",function(e){e.DataTable.Base.prototype._createTbodyTdNode=function(i){var h=i.column,g=null;i.headers=h.headers;i.classnames=h.get("classnames");i.td=e.Node.create(e.substitute(this.tdTemplate,i));i.liner=i.td.one("div");g=this.formatDataCell(i);if(e.Lang.isString(g)){i.value=g;i.liner.append(i.value);}return i.td;};e.Plugin.DataTableSort.prototype._beforeCreateTheadThNode=function(g){if(g.column.get("sortable")){g.value=e.substitute(this.get("template"),{link_class:g.link_class||"",link_title:g.column.get("title")||g.column.get("key"),link_href:"#",value:g.value});}};e.DataTable.Base.prototype._addCaptionNode=function(h){var g=this.get("caption");if(g){this._captionNode=h.createCaption();return this._captionNode;}else{return true;}};e.DataTable.Base.prototype._uiSetCaption=function(g){g=e.Lang.isValue(g)?g:"";if(g==""){if(e.Lang.isValue(this._captionNode)){this._captionNode.remove();}}else{if(!e.Lang.isValue(this._captionNode)){this._captionNode=this._tableNode.createCaption();}this._captionNode.setContent(g);}};e.Plugin.DataTableDataSource.prototype.onDataReturnInitializeTable=function(h){var i=this.get("host").get("recordset"),g=e.Object(i);g.set("records",h.response.results);this.get("host").set("recordset",g);};var b=e.ClassNameManager.getClassName,f="datatable",c=b(f,"first"),d=b(f,"last");e.DataTable.Base.prototype._createTheadTrNode=function(p,h,n){p.id=e.guid();var m=e.Node.create(e.substitute(this.get("trTemplate"),p)),k=0,j=p.columns,g=j.length,l;if(h){m.addClass(c);}if(n){m.addClass(d);}for(;k<g;++k){l=j[k];this._addTheadThNode({value:l.get("label"),column:l,tr:m});}return m;};var b=e.ClassNameManager.getClassName,f="datatable",a="column";e.Plugin.DataTableSort.prototype._uiSetLastSortedBy=function(k,h,g){var s=k&&k.key,l=k&&k.dir,r=h&&h.key,i=h&&h.dir,o=g.get("columnset"),q=o.keyHash[s],m=o.keyHash[r],p=g._tbodyNode,j,n;if(q){q.thNode.removeClass(b(f,l));j=p.all('td[headers="'+q.get("id")+'"]');j.removeClass(b(f,l));}if(m){m.thNode.addClass(b(f,i));n=p.all('td[headers="'+m.get("id")+'"]');n.addClass(b(f,i));}};},"@VERSION@");