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
     *
     *
     * @method initializer
     * @param config {Object} Configuration object
     * @protected
     * @constructor
     */
//    initializer : function (config) {
//
//
//    },

    /**
     * Create the DOM structure for the dp-datatable.
     *
     * @method renderUI
     * @protected
     */
//    renderUI : function () {
//
//    },


    /**
     *
     * @method bindUI
     * @protected
     */
//    bindUI : function () {
//
//    },
//    
    /**
     * Synchronizes the DOM state with the attribute settings
     *
     * @method syncUI
     */
//    syncUI : function () {
//        
//    },

    /**
     * Destructor lifecycle implementation for the dp-datatable class.
     *
     * @method destructor
     * @protected
     */
//    destructor: function() { }
    
    
    // Use NetBeans Code template "ymethod" to add methods here


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

    /**
     * Required NAME static field, to identify the Widget class and
     * used as an event prefix, to generate class names etc. (set to the
     * class name in camel case).
     *
     * @property Dp-datatable.NAME
     * @type String
     * @static
     */
//    NAME : "DataTable",

    /**
     * Static Object hash used to capture existing markup for progressive
     * enhancement. Keys correspond to config attribute names and values
     * are selectors used to inspect the contentBox for an existing node
     * structure.
     *
     * @property Dp-datatable.HTML_PARSER
     * @type Object
     * @protected
     * @static
     */
//    HTML_PARSER : {},

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Dp-datatable.ATTRS
     * @type Object
     * @protected
     * @static
     */
//    ATTRS : {
        
        /**
         * Strings that need to be localized can be placed here
         *
         * @property Dp-datatable.ATTRS
         * @type Object
         * @protected
         * @static
         */
//        strings: {
//            value: {
//                //yourkey:your String value
//            }
//        }

        // Use NetBeans Code Template "yattr" to add attributes here
    //}
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


Y.namespace('DP').DataTableDataSource = Y.extend( DPDataTableDataSource, Y.Plugin.DataTableDataSource, {
    
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


}, '@VERSION@' ,{requires:['datatable', 'datatable-datasource']});
