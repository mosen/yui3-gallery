YUI.add('gallery-dp-datatable', function(Y) {

/**
 * 
 *
 * @namespace DP
 * @module DataTable
 * @requires datatable
 */

var YLang = Y.Lang,
    YisValue = YLang.isValue,
    Ysubstitute = Y.Lang.substitute,
    YNode = Y.Node,
    Ycreate = YNode.create,
    YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column",
    
    FOCUS = "focus",
    KEYDOWN = "keydown",
    MOUSEENTER = "mouseenter",
    MOUSELEAVE = "mouseleave",
    MOUSEUP = "mouseup",
    MOUSEDOWN = "mousedown",
    CLICK = "click",
    DBLCLICK = "dblclick",

    CLASS_COLUMNS = YgetClassName(DATATABLE, "columns"),
    CLASS_DATA = YgetClassName(DATATABLE, "data"),
    CLASS_MSG = YgetClassName(DATATABLE, "msg"),
    CLASS_LINER = YgetClassName(DATATABLE, "liner"),
    CLASS_FIRST = YgetClassName(DATATABLE, "first"),
    CLASS_LAST = YgetClassName(DATATABLE, "last"),
    CLASS_EVEN = YgetClassName(DATATABLE, "even"),
    CLASS_ODD = YgetClassName(DATATABLE, "odd"),

    TEMPLATE_TABLE = '<table></table>',
    TEMPLATE_COL = '<col></col>',
    TEMPLATE_THEAD = '<thead class="'+CLASS_COLUMNS+'"></thead>',
    TEMPLATE_TBODY = '<tbody class="'+CLASS_DATA+'"></tbody>',
    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}" abbr="{abbr}"><div class="'+CLASS_LINER+'">{value}</div></th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></td>',
    TEMPLATE_VALUE = '{value}',
    TEMPLATE_MSG = '<tbody class="'+CLASS_MSG+'"></tbody>';

/**
 * DP.DataTable extends Y.DataTable.Base to fix many of the bugs reported on DT, in the interim.
 *
 * @class DataTable
 * @extends DataTable.Base
 */
Y.namespace('DP').DataTable = Y.Base.create( 'dp-datatable', Y.DataTable.Base, [], {

    /**
    * Creates data cell element. 
    * Supports td reference to correct node YUI 
    * Ticket #2529920 http://yuilibrary.com/projects/yui3/ticket/2529920 td reference
    * Ticket #2529921 http://yuilibrary.com/projects/yui3/ticket/2529921 {value} shown when data is "undefined" type
    *
    * @method _createTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTbodyTdNode: function(o) {
        var column = o.column,
            formatvalue = null;
        //TODO: attributes? or methods?
        o.headers = column.headers;
        o.classnames = column.get("classnames");
        o.td = Y.Node.create(Y.substitute(this.tdTemplate, o));
        o.liner = o.td.one('div');
        
        formatvalue = this.formatDataCell(o);
        
        if (Y.Lang.isString(formatvalue)) {
            o.value = formatvalue;
            o.liner.append(o.value);
        }
        
        return o.td;
    },
    
   /**
    * @property tdTemplate
    * @description Tokenized markup template for TD node creation. removed {value} so that we can append to TD when there is no return value from the formatter
    * @type String
    * @default '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>'
    */
    tdTemplate: '<td headers="{headers}"><div class="'+CLASS_LINER+'"></div></td>'

}, {

});
/**
 *
 *
 * @module DP.DataTableDataSource
 * @requires Y.Plugin.DataTableDataSource
 */

/**
 * Extension to DataTableDataSource plugin which clones the recordset to preserve combinations of plugins
 * such as DataSource/DataSort and Scroll
 * 
 * bugs addressed:
 * DataSource / DataSort : Ticket #2529975 http://yuilibrary.com/projects/yui3/ticket/2529975
 * 
 *
 * @class DataTableDataSource
 * @extends Y.Plugin.DataTableDataSource
 */
function DPDataTableDataSource() {
    DPDataTableDataSource.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DPDataTableDataSource, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "datasource"
     */
    NS: "datasource",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTableDataSource"
     */
    NAME: "dataTableDataSource",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute datasource
        * @description Pointer to DataSource instance.
        * @type Y.DataSource
        */
        datasource: {
            setter: "_setDataSource"
        },
        
        /**
        * @attribute initialRequest
        * @description Request sent to DataSource immediately upon initialization.
        * @type Object
        */
        initialRequest: {
            setter: "_setInitialRequest"
        }
    }
});


Y.extend( DPDataTableDataSource, Y.Plugin.DataTableDataSource, {
    
    /**
     * Callback function passed to DataSource's sendRequest() method populates
     * an entire DataTable with new data, clearing previous data, if any.
     *
     * @method onDataReturnInitializeTable
     * @param e {Event.Facade} DataSource Event Facade object.
     */
    onDataReturnInitializeTable : function(e) {
        var prevrecords = this.get('host').get('recordset'),
            newrecords = Y.Object(prevrecords); // Clone retains original plugin functionality.
            
        newrecords.set('records', e.response.results);
        this.get("host").set("recordset", newrecords);
    }
});

Y.namespace('DP').DataTableDataSource = DPDataTableDataSource;
/**
 * Extension to DataTableScroll plugin to fix issues specific to combining with a datasource.
 *
 * Addresses Ticket #2529808 http://yuilibrary.com/projects/yui3/ticket/2529808
 *
 * @module DP.DataTableScroll
 * @requires Y.Plugin.DataTableDataSource
 */

/**
 * Extension to DataTableScroll
 * 
 * @class DataTableDataSource
 * @extends Y.Plugin.DataTableDataSource
 */
function DPDataTableScroll() {
    DPDataTableDataSource.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DPDataTableScroll, {
    
    NS: "scroll",

    NAME: "dataTableScroll",

    ATTRS: {
    
        /**
        * @description The width for the table. Set to a string (ex: "200px", "20em") if you want the table to scroll in the x direction.
        *
        * @attribute width
        * @public
        * @type string
        */
        width: {
            value: undefined,
            writeOnce: "initOnly"
        },
        
        /**
        * @description The height for the table. Set to a string (ex: "200px", "20em") if you want the table to scroll in the y-direction.
        *
        * @attribute height
        * @public
        * @type string
        */
        height: {
            value: undefined,
            writeOnce: "initOnly"
        },
        
        
        /**
        * @description The scrolling direction for the table.
        *
        * @attribute scroll
        * @private
        * @type string
        */
        _scroll: {
            //value: 'y',
            valueFn: function() {
                var w = this.get('width'),
                h = this.get('height');
                
                if (w && h) {
                    return 'xy';
                }
                else if (w) {
                    return 'x';
                }
                else if (h) {
                    return 'y';
                }
                else {
                    return null;
                }
            }
        },
        
        
        /**
        * @description The hexadecimal colour value to set on the top-right of the table if a scrollbar exists. 
        *
        * @attribute COLOR_COLUMNFILLER
        * @public
        * @type string
        */
        COLOR_COLUMNFILLER: {
            value: '#f2f2f2',
            validator: YLang.isString,
            setter: function(param) {
                if (this._headerContainerNode) {
                    this._headerContainerNode.setStyle('backgroundColor', param);
                }
            }
        }
    }  
});


Y.extend( DPDataTableScroll, Y.Plugin.DataTableScroll, {
    /**
    * @description Post rendering method that is responsible for creating a column
    * filler, and performing width and scroll synchronization between the &lt;th&gt; 
    * elements and the &lt;td&gt; elements.
    * This method fires after syncUI is called on datatable-base
    * 
    * @method syncUI
    * @public
    */
    syncUI: function() {
        //Y.Profiler.start('sync');
        this._removeCaptionNode();
        //this._syncWidths();
        this._syncScroll();
        //Y.Profiler.stop('sync');
        //console.log(Y.Profiler.getReport("sync"));
        this.afterHostEvent('recordsetChange', this._syncWidths);
    }    
});

Y.namespace('DP').DataTableScroll = DPDataTableScroll;


}, '@VERSION@' ,{requires:['datatable', 'datatable-datasource']});
