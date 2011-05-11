/**
 * This patch addresses YUI tickets #2529920, #2529921
 * 
 * #2529920 - Documentation refers to the cell formatter function having access to the TD element, but the TD reference is not passed.
 * #2529921 - {value} template is shown when the record data is null or undefined
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