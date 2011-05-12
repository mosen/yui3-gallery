YUI.add('gallery-user-patch-datatable-rollup', function(Y) {

/**
 * This patch addresses YUI tickets #2529920, #2529921
 * 
 * #2529920 - Documentation refers to the cell formatter function having access to the TD element, but the TD reference is not passed.
 * #2529921 - {value} template is shown when the record data is null or undefined
 * TODO #2529894 setting value using innerHTML could potentially expose a XSS exploit.
 * 
 * The {value} token remains because Y.substitute does not delete invalid tokens, in case that they
 * are later used for recursive substitutions. One possible fix could be to have substitute delete tokens
 * if the recursive option is not set.
 *
 * @module gallery-user-patch-2529920-2529921
 * @requires DataTable.Base
 */

Y.DataTable.Base.prototype._createTbodyTdNode = function(o) {
    var column = o.column,
        formatvalue = null;
        
    //TODO: attributes? or methods?
    o.headers = column.headers;
    o.classnames = column.get("classnames");
    o.td = Y.Node.create(Y.substitute(this.tdTemplate, o));
    o.liner = o.td.one('div');

    formatvalue = this.formatDataCell(o);

    // If the formatter didn't use the td reference to populate the cell, it must have returned
    // a string value instead.
    if (Y.Lang.isString(formatvalue)) {
        o.value = formatvalue;
        o.liner.append(o.value);
    }

    return o.td;
};
/**
 * This patch addresses YUI ticket #2529943
 * 
 * http://yuilibrary.com/projects/yui3/ticket/2529943
 * 
 * The DataTableSort plugin creates a link for each column heading to allow the user to sort datatable rows.
 * The title attribute is hard coded to the value 'title', this patch allows the title to be configurable, or by default
 * uses the column key as the title.
 *
 * @module gallery-user-patch-2529943
 * @requires DataTable.Base, Y.Plugin.DataTableSort
 */

Y.Plugin.DataTableSort.prototype._beforeCreateTheadThNode = function(o) {
        if(o.column.get("sortable")) {
            o.value = Y.substitute(this.get("template"), {
                link_class: o.link_class || "",
                link_title: o.column.get("title") || o.column.get("key"),
                link_href: "#",
                value: o.value
            });
        }
};
/**
 * This patch addresses YUI ticket #2529968
 * 
 * Creating a table with no caption still creates the caption node.
 * The main problem is that the caption node is styled with 1em padding.
 * 
 * In this fix we prevent the node from being created. The CSS should be altered
 * to remove the padding and apply it to an inner element only.
 *
 * @module gallery-user-patch-2529968
 * @requires DataTable.Base
 */

Y.DataTable.Base.prototype._addCaptionNode = function(tableNode) {
    var caption = this.get('caption');
    
    if (caption) {
        this._captionNode = tableNode.createCaption();
        return this._captionNode;
    } else {
        return true; // DataTable.Base.renderUI relies on all render methods to evaluate true, otherwise it bails.
    }
};

// Caption can still be set or synced after the constructor, so we need to patch the uiSet method also.
Y.DataTable.Base.prototype._uiSetCaption = function(val) {
    val = Y.Lang.isValue(val) ? val : "";
    if (val == "") {
        if (Y.Lang.isValue(this._captionNode)) {
            this._captionNode.remove();
        }
    } else {
        if (!Y.Lang.isValue(this._captionNode)) {
            this._captionNode = this._tableNode.createCaption();
        }
        
        this._captionNode.setContent(val);
    }
};
/**
 * This patch addresses YUI ticket #2529975
 * 
 * The DataTableDataSource plugin creates a new RecordSet instance whenever a
 * response is returned from the server, causing all plugins to be lost (Including
 * the RecordSet.Sort plugin).
 * 
 * This patch clones the RecordSet object to preserve the plugin configuration of
 * the original RecordSet instance.
 *
 * @module gallery-user-patch-2529975
 * @requires DataTable.Base, Y.Plugin.DataTableDataSource
 */

Y.Plugin.DataTableDataSource.prototype.onDataReturnInitializeTable = function(e) {
        // Clone retains original plugin functionality. must be a separate instance
        // In order to trigger the host's recordsetChange event.
        var prevRecordSet = this.get('host').get('recordset'),
            newRecordSet = Y.Object(prevRecordSet); 
            
        newRecordSet.set('records', e.response.results);
        this.get("host").set("recordset", newRecordSet);    
};
/**
 * This patch addresses YUI ticket #2530026
 * 
 * The tr node inside the thead section of datatable has a bogus id. The id attribute is
 * not supplied to the template upon creation, and so the TR receives an id of
 * "{id}".
 *
 * @module gallery-user-patch-2530026
 * @requires DataTable.Base
 */

var YgetClassName = Y.ClassNameManager.getClassName,
    
    DATATABLE = "datatable",
    
    CLASS_FIRST = YgetClassName(DATATABLE, "first"),
    CLASS_LAST = YgetClassName(DATATABLE, "last");

Y.DataTable.Base.prototype._createTheadTrNode = function(o, isFirst, isLast) {
    //TODO: custom classnames

    // FIX: generate a guid for the TR element
    o.id = Y.guid();

    var tr = Y.Node.create(Y.substitute(this.get("trTemplate"), o)),
        i = 0,
        columns = o.columns,
        len = columns.length,
        column;

     // Set FIRST/LAST class
    if(isFirst) {
        tr.addClass(CLASS_FIRST);
    }
    if(isLast) {
        tr.addClass(CLASS_LAST);
    }

    for(; i<len; ++i) {
        column = columns[i];
        this._addTheadThNode({value:column.get("label"), column: column, tr:tr});
    }

    return tr;
};
/**
 * This patch addresses an issue with DataTableSort and DataTableScroll combined
 * @todo cannot replicate again? check original code
 * 
 * The DataTableSort plugin highlights the sorted column after the sort has been made.
 * The problem is that the selector for the rows does not work when DataTableScroll has been
 * applied to the table instance, because the headings and the body are now distinctly different
 * sections of the table.
 * 
 * Additionally, the source refers to a non-existent class for cells in a specific column, and adds a new
 * attribute 'header=' to each TD node.
 * 
 * The fix here is to query for the 'header' attribute, though a custom class should be considered.
 *
 * @module gallery-user-patch-dtsort-classes
 * @requires DataTable.Base, Y.Plugin.DataTableSort, Y.Plugin.DataTableScroll
 */

var YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column";


Y.Plugin.DataTableSort.prototype._uiSetLastSortedBy = function(prevVal, newVal, dt) {
        
    var prevKey = prevVal && prevVal.key,
        prevDir = prevVal && prevVal.dir,
        newKey = newVal && newVal.key,
        newDir = newVal && newVal.dir,
        cs = dt.get("columnset"),
        prevColumn = cs.keyHash[prevKey],
        newColumn = cs.keyHash[newKey],
        tbodyNode = dt._tbodyNode,
        prevRowList, newRowList;

    // Clear previous UI
    if(prevColumn) {
        prevColumn.thNode.removeClass(YgetClassName(DATATABLE, prevDir));

        // This NodeList would be empty in the current version 3.3.0
        //prevRowList = tbodyNode.all("."+YgetClassName(COLUMN, prevColumn.get("id")));
        prevRowList = tbodyNode.all('td[headers="' + prevColumn.get('id') + '"]');

        prevRowList.removeClass(YgetClassName(DATATABLE, prevDir));
    }

    // Add new sort UI
    if(newColumn) {
        newColumn.thNode.addClass(YgetClassName(DATATABLE, newDir));

        // This NodeList would be empty in the current version 3.3.0            
        //newRowList = tbodyNode.all("."+YgetClassName(COLUMN, newColumn.get("id")));
        newRowList = tbodyNode.all('td[headers="' + newColumn.get('id') + '"]');

        newRowList.addClass(YgetClassName(DATATABLE, newDir));
    }
};


}, '@VERSION@' );
