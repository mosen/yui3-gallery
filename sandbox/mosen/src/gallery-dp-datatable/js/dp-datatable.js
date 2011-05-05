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
