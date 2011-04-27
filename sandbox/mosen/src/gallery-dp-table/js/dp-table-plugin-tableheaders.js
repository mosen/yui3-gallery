/**
 *
 *
 * @module Headers
 * @requires
 */

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang;

/**
 *
 *
 * @class Headers
 * @extends Plugin
 */
Y.namespace('DP').TableHeaders = Y.Base.create( 'dp-table-headers-plugin', Y.Plugin.Base, [], {

    /**
     * Lifecycle : Initializer
     *
     * @method initializer
     * @param config {Object} Configuration object
     * @protected
     * @constructor
     */
    initializer : function (config) {

        // Sort is fired after a header click
        this.publish('sort', {defaultFn: this._defSortFn});

        // Hover events
        this.publish('columnover', {defaultFn: this._uiSetColumnOver});
        this.publish('columnout', {defaultFn: this._uiSetColumnOut});

        // All subjects of table must publish this to affect the request parameters.
        // Fired when the column sorting changes
        this.publish('queryUpdate', {defaultFn: this._defQueryUpdateFn});

        this.afterHostEvent('render', this.renderUI);
        this.afterHostMethod('bindUI', this.bindUI);
    },

    /**
     * Lifecycle : Create the DOM structure for the headers.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        this._renderTableHead();
        this._renderTableHeadColumns();
    },


    /**
     * Lifecycle : Bind event handlers to the DOM and for CustomEvents
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {

        // re-render columns after a change in sorting.
        this.after('columnsChange', this._afterColumnsChange);

        // DOM EVENTS
        // 
        // Stop accidental selection of header text.
        this._theadNode.delegate('selectstart', function(e) {
                e.preventDefault();
        }, 'th', this);

        // sort on header click
        this._theadNode.delegate('click', function(e) {
                this.fire('sort', {headerTarget: e.currentTarget});
        }, 'th', this);

        // Column header mouse hover events.
        this._theadNode.delegate('mouseenter', function(e) {
                this.fire('columnover', {headerTarget: e.currentTarget});
        }, 'th', this);

        this._theadNode.delegate('mouseleave', function(e) {
                this.fire('columnout', {headerTarget: e.currentTarget});
        }, 'th', this);
    },
    
    /**
     * Lifecycle : Synchronize the model to the DOM
     *
     * @method syncUI
     */
    syncUI : function () {
        
    },

    /**
     * Destructor lifecycle implementation for the headers class.
     *
     * @method destructor
     * @protected
     */
    destructor: function() { 
        
        this._theadNode.detach('selectstart');
        this._theadNode.detach('click');
        this._theadNode.detach('mouseenter');
        this._theadNode.detach('mouseleave');

        this._theadNode = null;

    },
    
    /**
     * Render the THEAD node for this plugin
     *
     * @method _renderTableHead
     * @private
     */
    _renderTableHead : function() {
        Y.log("_renderTableHead", "info", "Y.DP.TableHeaders");
        this._theadNode = Node.create(Y.substitute(this.THEAD_TEMPLATE, {
            className : this.get('host').getClassName('tableHeaders', 'thead')
        }));
        
        this.get('host').append(this._theadNode);
    },
    
    /**
     * Enhance table columns with styling and sorting
     *
     * @method _renderTableHeadColumns
     * @protected
     */
    _renderTableHeadColumns : function() {
        /*
        var columns = this.get('columns');

        for (var c=0; c < columns.length; c++) {
            var cnode = columns[c].node;

            var label = Y.Node.create(Y.substitute(this.COLUMN_LABEL_TEMPLATE, {
                className: this.get('host').getClassName('label'),
                label: cnode.get('innerHTML')
            }));

            cnode.setContent('');
            cnode.append(label);

            columns[c].sortNode = Node.create(Y.substitute(this.COLUMN_SORT_INDICATOR_TEMPLATE, {
                className: this.getClassName('sort')
            }));

            if (c === 0) {
                columns[c].node.addClass(this.getClassName('column', 'leftcorner'));
            } else if (c == (columns.length - 1)) {
                columns[c].node.addClass(this.getClassName('column', 'rightcorner'));
            }

            cnode.append(columns[c].sortNode);
        }*/
        
    },

    
    /**
     * Reference to the THEAD element in the table
     *
     * @property _theadNode
     * @type Node
     * @protected
     */
    _theadNode : null,
    
    /**
     * Template used to render the table header node.
     *
     * @property THEAD_TEMPLATE
     * @type String
     */
    THEAD_TEMPLATE : '<thead class="{className}"></thead>',
    
    /**
     * Template used to render the row for headings
     *
     * @property ROW_TEMPLATE
     * @type String
     */
    ROW_TEMPLATE : '<tr class="{className}"></tr>',
    
    /**
     * Template used to render each of the headings in the head node.
     *
     * @property COLUMN_TEMPLATE
     * @type String
     */
    COLUMN_TEMPLATE : '<th class="{className}">{value}</th>',
    
    /**
     * Contains the sort indicator graphic
     *
     * @property COLUMN_SORT_INDICATOR_TEMPLATE
     * @type String
     * @static
     */
    COLUMN_SORT_INDICATOR_TEMPLATE : '<div class="{className}">&nbsp;</div>',

    /**
     * Column text content will be wrapped in this element.
     *
     * @property COLUMN_LABEL_TEMPLATE
     * @type String
     * @static
     */
    COLUMN_LABEL_TEMPLATE : '<span class="{className}">{label}</span>'
    
    
// Use NetBeans Code template "ymethod" to add methods here

}, {

    /**
     * The plugin namespace
     *
     * @property Headers.NS
     * @type String
     * @protected
     * @static
     */
    NS : "tableHeaders",


    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Headers.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : {
        
// Use NetBeans Code Template "yattr" to add attributes here
}
        

});