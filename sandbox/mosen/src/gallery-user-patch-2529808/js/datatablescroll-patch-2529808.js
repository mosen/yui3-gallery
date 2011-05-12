// patch for YUI 3.3.0 DataTable bug
// forum post: http://yuilibrary.com/forum/viewtopic.php?f=92&t=6355
// bug ticket: http://yuilibrary.com/projects/yui3/ticket/2529808
// also see: https://github.com/mosen/yui3-gallery/tree/master/sandbox/mosen/src/gallery-dp-datatable
//

Y.Plugin.DataTableScroll.prototype.injected_bindUI = Y.Plugin.DataTableScroll.prototype.bindUI;
Y.Plugin.DataTableScroll.prototype.bindUI = function() {
    this.get('host').after('recordsetChange', Y.bind(this.syncUI, this));

    Y.log('Calling unpatched bindUI', 'info', 'gallery-user-patch-2529808');
    this.injected_bindUI();
};

Y.Plugin.DataTableScroll.prototype.injected_syncWidths = Y.Plugin.DataTableScroll.prototype._syncWidths;
Y.Plugin.DataTableScroll.prototype._syncWidths = function() {
    
    var dt = this.get('host'),
        rs = dt.get('recordset'),
        rsLength = rs.getLength();

    if (rsLength === 0) {
        return false;
    } else {
        Y.log('Calling unpatched _syncWidths', 'info', 'gallery-user-patch-2529808');
        this.injected_syncWidths();
    }
};