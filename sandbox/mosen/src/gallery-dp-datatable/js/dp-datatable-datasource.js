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