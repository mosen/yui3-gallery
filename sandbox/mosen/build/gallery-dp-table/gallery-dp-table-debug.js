YUI.add('gallery-dp-table', function(Y) {

//YUI.add('dp-table-cellrenderers', function(Y) {
	
/**
 * Cell renderers are implemented as functions which return closures that are seeded with the configuration.
 * Example closure: supplying a width parameter returns a function that renders a cell, and contains that width variable 'pre-seeded'.
 */
Y.namespace('DP').CellRenderers = {

        /**
         * Format a date field
         * 
         * @param data {Object} row data
         * @param field {String} field name
         * @param cellNode {Node} TD cell reference
         */
        date : function(data, field, cellNode) {
                var d = data[field];

                if (Lang.isDate(d)) {
                        cellNode.set('innerHTML', Y.DataType.Date.format(d, { format: '%x' }));
                } 
        },

        /**
         * Format a date field, using nice words for days if the date is close to the current date.
         * 
         * @param data {Object} row data
         * @param field {String} field name
         * @param cellNode {Node} TD cell reference
         */
        niceDate : function(data, field, cellNode) {

                var d = data[field];

                if (Lang.isDate(d)) {
                        var today = new Date();
                        today.setHours(0,0,0,0); // Make sure the delta doesnt go negative when we take into account time.

                        var todayDelta = d - today,
                            todayDeltaDays = todayDelta/1000/60/60/24;

                        // Use nice format if difference is at most, a week into the future.
                        if (todayDeltaDays >= 0 && todayDeltaDays <= 6 ) {
                            if (todayDeltaDays < 1) {
                                cellNode.set('innerHTML', 'Today');
                            } else if (todayDeltaDays < 2) {
                                cellNode.set('innerHTML', 'Tomorrow');
                            } else {
                                cellNode.set('innerHTML', Y.DataType.Date.format(d, { format: '%A' }));
                            }
                        } else if (todayDeltaDays > -2 && todayDeltaDays < 0) { // Yesterday
                            cellNode.set('innerHTML', 'Yesterday');
                        } else {
                        // Use standard internationalised format.
                            cellNode.set('innerHTML', Y.DataType.Date.format(d, { format: '%x' }));
                        }
                }                  
        },

        /**
         * Format a field where the value is a key to a hash, defined as a json object on the page.
         * 
         * @param el String Selector for element holding hash values.
         * @return Function 
         */
        hash : function(el) {
                return function(data, field, cellNode) {
                    var valuesElement = el;

                    var optionsNode = Y.one(valuesElement),
                        options = Y.JSON.parse(optionsNode.get('innerHTML'));

                    cellNode.set('innerHTML', options[data[field]]);                          
                }
        },

        /**
         * Display a percentage as a visual progress bar
         */
        progress : function() {
            return function(data, field, cellNode) {

                var percentage_value = parseInt(data[field], 0),
                    TEXT_TEMPLATE = '<div class="yui3-dp-cellrenderer-progress-text">{text}</div>',
                    BAR_TEMPLATE = '<div class="yui3-dp-cellrenderer-progress" style="width: {width}%">{textnode}</div>',
                    BG_TEMPLATE = '<div class="yui3-dp-cellrenderer-progress-wrap">{bar}</div>';

                var text_percent = Y.substitute(TEXT_TEMPLATE, { text: percentage_value + '%' });
                var bar = Y.substitute(BAR_TEMPLATE, { width: percentage_value, textnode: text_percent });
                var back = Y.substitute(BG_TEMPLATE, { bar: bar });

                cellNode.append(Node.create(back));
            }
        }

};
	
//}, '1.0.0', { requires: ['lang', 'node', 'substitute', 'datatype-date', 'json-parse'] });
/**
 * @version 1.0.0
 */
// TODO: DataSource table as an extension of a basic table.
/**
 * DP Table
 *
 * @module DP.Table
 * @requires widget, substitute, classnamemanager
 * @namespace Y.DP
 */
var	Lang = Y.Lang,
        Node = Y.Node;

/**
 * Dynamic table class.
 *  
 * @class TableBase
 * @extends Y.Widget
 */
Y.namespace('DP').TableBody = Y.Base.create('dp-table-body', Y.Widget, [], {

        /**
         * Initializer, implemented for Y.Base
         * 
         * @method initializer
         * @param config {Object} Configuration object.
         */
        initializer : function(config) {

                Y.log('initializer', 'info', 'dp-table-body');

                // Node references
                this._tbodyNode = this.get('contentBox'); //config.tbodyNode;

                // IO
                this.publish('success', {defaultFn: this._defResponseSuccessFn});

                // Just after sendRequest()
                this.publish('loading', {defaultFn: this._defLoadingFn});

                // Single handler for IO Events
                this._ioHandlers = {
                        complete: Y.bind(this._handleResponse, this, 'complete'),
                        success: Y.bind(this._handleResponse, this, 'success'),
                        failure: Y.bind(this._handleResponse, this, 'failure'),
                        end: Y.bind(this._handleResponse, this, 'end')
                };
        },

        /**
         * Destructor, implemented for Y.Base
         * 
         * @method destructor
         */
        destructor : function() {
                // detach click, enter, leave
                this._tbodyNode.detach('click');
                this._tbodyNode.detach('mouseenter');
                this._tbodyNode.detach('mouseleave');

                this._tbodyNode = null;	
        },

        // Y.Widget Rendering Lifecycle

        /**
         * @see Widget.renderUI
         */
        renderUI : function() { 
                this.load(""); // Just load the dataset without any query parameters
        },

        /**
         * @see Widget.bindUI
         */
        bindUI : function() {

                this._tbodyNode.delegate('selectstart', function(e) {
                    e.preventDefault();
                }, 'tr', this);		

                // re-render rows after data change.
                this.after('dataChange', this._afterDataChange);
                this.after('loadingChange', this._afterLoadingChange);

                this.after('queryParametersChange', this._afterQueryParametersChange);
        },

        /**
         * @see Widget.syncUI
         */
        syncUI : function() {

        },

        // PROTECTED VARIABLES

        /**
         * Object used for IO callback. Contains four functions to handle each stage of the IO request.
         * 
         * @property _ioHandlers
         * @type Object
         */
        _ioHandlers: null,

        /**
         * Reference to the TBODY node containing this table data.
         * 
         * @property _tbodyNode
         * @type Node
         */
        _tbodyNode : null,


        // PROTECTED METHODS

        /**
         * Render the rows contained in the data attribute.
         * 
         * @method _renderTableRows
         * @protected
         */
        _renderTableRows : function() {


                var data = this.get('data'),
                    bodyNode = this._tbodyNode,
                    zebraClass;

                if (data.results.length > 0) {
                        bodyNode.setContent('');

                        for (var i=0; i < data.results.length; i++) {
                                zebraClass = (i % 2) ? 'row' : 'row-alt';

                                var trTemplate = Y.substitute(this.ROW_TEMPLATE, {
                                        trClassName: this.getClassName(zebraClass)
                                });
                                var tr = Node.create(trTemplate);

                                var cells = this.get('cells');

                                for (var x=0; x < cells.length; x++) {
                                        var cell = cells[x],
                                            field = cell.field,
                                            cellWidth = cell.width;

                                        var td = Node.create(Y.substitute(this.CELL_TEMPLATE, {
                                                tdClassName: this.getClassName('cell')
                                        }));

                                        // Use renderer if defined
                                        if (undefined === cell.renderer) {
                                                td.setContent(data.results[i][field]);
                                        } else {
                                                cell.renderer(data.results[i], field, td);
                                        }

                                        td.set('width', cellWidth);

                                        tr.append(td);
                                }

                                // Previously we created an array of nodes, and then appended them in one call.
                                // Apparently Node.append no longer supports arrays.
                                bodyNode.append(tr);
                        }
                } else {
                        bodyNode.setContent('');
                        bodyNode.append(Node.create(Y.substitute(this.ZEROROWS_TEMPLATE, {
                                colspan: this.get('cells').length,
                                message: this.get('strings.zerorows')
                        })));
                }
        },

        /**
         * Load data from the provided Y.DataSource Instance
         * 
         * @method load
         * @public
         */
        load : function(requestString) {

                var ds = this.get('dataSource');

                ds.sendRequest({
                        request : requestString,
                        callback : this._ioHandlers
                });	

                this.fire('loading', {id: this._io, request: requestString});
        },

        /**
         * Single interface for io responses, fires custom event at each stage of datasource request.
         * @method _handleResponse
         * @param type {String} Event type
         * @param e {Object} Response Object
         * @protected
         */
        _handleResponse : function (type, e) {
                this.fire(type, {id: this._io, response: e.response});
                this._io = null;
        },

        /**
         * Public handler for parameterchange events.
         * 
         * The subject supplies its list of parameters to us, which we then apply to our locally maintained list of parameters.
         * Our afterChange then applies those to a datasource request.
         * 
         * @method handleParameterChange
         * @public
         * @param e {Event} CustomEvent
         */
        handleParameterChange : function(e) {
                Y.log('handleParameterChange', 'info', 'dp-table-body');

                var params = this.get('queryParameters');
                params[e.type] = e.parameters;
                this.set('queryParameters', params);
        },

        /**
         * Default handler for table:success (DataSource.IO Response Success)
         * 
         * @method _defResponseSuccessFn
         * @param o {Object} Response object
         */
        _defResponseSuccessFn : function(o) {
                Y.log('_defResponseSuccessFn', 'info', 'dp-table-body');

                this.set('data', o.response);
                this.set('loading', false);
        },

        /**
         * Default handler for the loading event
         * 
         * @method _defLoadingFn
         * @param e {Event} Event
         */
        _defLoadingFn : function(e) {
                Y.log('_defLoadingFn', 'info', 'dp-table-body');

                this.set('loading', true);
        },

        /**
         * New data handler, causes table to re-render
         * 
         * @method _afterDataChange
         * @protected
         */
        _afterDataChange : function(e) {
                Y.log('_afterDataChange', 'info', 'dp-table-body');

                this._renderTableRows();
        },

        /**
         * Update widget ui to reflect loading state change.
         * 
         * @method _afterLoadingChange
         * @protected
         * @param e {Event} custom event
         */
        _afterLoadingChange : function(e) {
                var loading = this.get('loading');
                if (loading) {
                        Y.log('loading');
                } else {
                        Y.log('finished loading');
                }
        },

        /**
         * A change in query parameters will rebuild the request string and reload the datasource.
         * 
         * @method _afterQueryParametersChange
         * @protected
         */
        _afterQueryParametersChange : function() {
                Y.log('_afterQueryParametersChange');

                var params = this.get('queryParameters'),
                        requestHash = Array(),
                        source,
                        key;

                // Iterate through sources
                for (source in params) {
                        for (key in params[source]) {
                                if (params[source][key].length > 0) {
                                        requestHash.push(key + '=' + params[source][key]);
                                }
                        }
                }

                var requestString = "?" + requestHash.join("&");
                Y.log(requestString);

                this.load(requestString);
        },

        /**
         * Body section does not require a contentBox because the content is bounded by the TBODY node.
         * 
         * @property CONTENT_TEMPLATE
         * @type String
         */
        CONTENT_TEMPLATE : null,

        /**
         * Row template for a status message, that spans the entire table.
         * 
         * @property ZEROROWS_TEMPLATE
         * @type String
         */
        ZEROROWS_TEMPLATE : '<tr><td colspan="{colspan}">{message}</td></tr>',

        /**
         * Standard row template.
         * 
         * @property ROW_TEMPLATE
         * @type String
         */
        ROW_TEMPLATE : '<tr class="{trClassName}"></tr>',

        /**
         * Standard cell template.
         * 
         * @property CELL_TEMPLATE
         * @type String
         */
        CELL_TEMPLATE : '<td class="{tdClassName}"></td>'
},{
        // static

        /**
         * Static property provides a string to identify the class.
         * <p>
         * Currently used to apply class identifiers to the bounding box 
         * and to classify events fired by the widget.
         * </p>
         *
         * @property Widget.NAME
         * @type String
         * @static
         */
        NAME : "dp-table-body",

        /**
         * Static property used to define the default attribute 
         * configuration for the Widget.
         * 
         * @property Widget.ATTRS
         * @type Object
         * @static
         */
        ATTRS : {

                // TODO: fix overflow when height is set via constructor.

                strings : {
                        value : {
                            loading : "Loading...",
                            zerorows : "No results available"
                        }
                },

                /**
                 * Array of cells to render. 
                 * Does not necessarily have a 1:1 relationship with DataSource fields.
                 * 
                 * cells are specified in the format { field: "fieldname", renderer: fnCellRenderer }
                 */
                cells : {
                        value: Array()
                },

                /**
                 * Active Y.DataSource instance, used to populate the 
                 * 
                 * @attribute dataSource
                 * @default null
                 * @type Y.DataSource
                 */
                dataSource : { 
                        value: null 
                },

                /**
                 * The most recent set of results returned by the datasource.
                 * 
                 * @attribute data
                 * @default null
                 * @type Array
                 */
                data : {
                        value: null
                },

                /**
                 * Whether the table is loading new data or not.
                 * 
                 * @attribute loading
                 * @default false
                 * @type Boolean
                 */
                loading : {
                        value: false,
                        validator: Lang.isBoolean
                },

                /**
                 * Array of params
                 * A change in parameters causes a table reload.
                 * 
                 * @attribute queryParameters
                 * @default Empty array
                 * @type Array
                 */
                queryParameters : {
                        value: Array(),
                        validator: Lang.isArray
                }
        },

        HTML_PARSER : {
                tbodyNode : '.yui3-dp-table-body'
        }
});
/**
 * @version 1.0.0
 */

/**
 * DP Table Headers
 * @module gallery-dp-table-headers
 * @requires widget, substitute
 * @namespace Y.DP
 */
var SORT_ASC = 'asc',
    SORT_DESC = 'desc',
    SORT_KEY = 'sortKey',
    SORT_DIRECTION = 'sortDirection';

/**
 * Table Column Headers
 * Progressive enhancement of TH elements to provide sorting functionality.
 *
 * @class TableHeaders
 */
Y.namespace('DP').TableHeaders = Y.Base.create('dp-table-headers', Y.Widget, [], {

    /**
     * Initializer, implemented for Y.Base
     *
     * @method initializer
     * @param config {Object} Configuration object.
     */
    initializer : function(config) {
        Y.log('init', 'info', 'Y.DP.TableHeaders');

        // we require the table as srcNode because it is the only valid element to wrap in divs
        //this._theadNode = config.theadNode;

        // Sort is fired after a header click
        this.publish('sort', {defaultFn: this._defSortFn});

        // Hover events
        this.publish('columnover', {defaultFn: this._uiSetColumnOver});
        this.publish('columnout', {defaultFn: this._uiSetColumnOut});

        // All subjects of table must publish this to affect the request parameters.
        // Fired when the column sorting changes
        this.publish('queryUpdate', {defaultFn: this._defQueryUpdateFn});
    },

    destructor : function() {
        this._theadNode.detach('click');
        this._theadNode.detach('mouseenter');
        this._theadNode.detach('mouseleave');

        this._theadNode = null;
    },

    // @see Widget.renderUI
    renderUI : function() {
            this._renderTableColumns();
    },

    // @see Widget.bindUI
    bindUI : function() {
            var theadNode = this.get('theadNode');

            // re-render columns after a change in sorting.
            this.after('columnsChange', this._afterColumnsChange);

            // DOM EVENTS
            // 
            // Stop accidental selection of header text.
            theadNode.delegate('selectstart', function(e) {
                    e.preventDefault();
            }, 'th', this);

            // sort on header click
            theadNode.delegate('click', function(e) {
                    this.fire('sort', {headerTarget: e.currentTarget});
            }, 'th', this);

            // Column header mouse hover events.
            theadNode.delegate('mouseenter', function(e) {
                    this.fire('columnover', {headerTarget: e.currentTarget});
            }, 'th', this);

            theadNode.delegate('mouseleave', function(e) {
                    this.fire('columnout', {headerTarget: e.currentTarget});
            }, 'th', this);
    },

    // @see Widget.syncUI
    syncUI : function() {
        
    },

    /**
     * Enhance table columns with styling and sorting
     *
     * @method _renderTableColumns
     * @protected
     */
    _renderTableColumns : function() {
        var columns = this.get('columns');

        for (var c=0; c < columns.length; c++) {
            var cnode = columns[c].node;

            var label = Y.Node.create(Y.substitute(this.COLUMN_LABEL_TEMPLATE, {
                className: this.getClassName('label'),
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
        }
    },

    /**
     * Default handler for table:sort
     *
     * @method _defSortFn
     * @param e {Event}
     */
    _defSortFn : function(e) {
            Y.log('_defSortFn', 'info', 'Y.DP.TableHeaders');

            this.sort(e.headerTarget);
    },

    /**
     * Default handler for CustomEvent queryUpdate
     *
     * @method _defQueryUpdateFn
     * @param e {Event}
     */
    _defQueryUpdateFn : function(e) {
            Y.log('gallery-dp-table-headers:_defQueryUpdateFn');
    },

    /**
     * Default handler for column mouseenter
     *
     * @method _uiSetColumnOver
     * @param e {Event}
     */
    _uiSetColumnOver : function(e) {
            var node = e.headerTarget;

            if (!node.hasClass(this.getClassName('column', 'over'))) {
                    node.addClass(this.getClassName('column', 'over'));
            }
    },

    /**
     * Default handler for column mouseexit
     *
     * @method _uiSetColumnOut
     * @param e {Event}
     */
    _uiSetColumnOut : function(e) {
            var node = e.headerTarget;

            if (node.hasClass(this.getClassName('column', 'over'))) {
                    node.removeClass(this.getClassName('column', 'over'));
            }
    },

    /**
     * Sort a column in the specified direction.
     *
     * No specified direction will alternate the sort direction.
     * This is usually called by TableHeaders._defSortFn after a custom "sort" event.
     *
     * @method sort
     * @public
     * @param node {Node} TH node to change sort direction for.
     * @param direction SORT_ASC | SORT_DESC [optional] sorting direction.
     */
    sort : function(node, direction) {
            Y.log('gallery-dp-table-headers:sort');

            var columns = this.get('columns');

            for (var c=0; c < columns.length; c++) {
                    if (columns[c].node == node) {
                            // Sort inverse
                            switch (columns[c].sort) {
                                    case SORT_ASC:
                                            columns[c].sort = (undefined === direction) ? SORT_DESC : direction;
                                            break;
                                    case SORT_DESC:
                                            columns[c].sort = (undefined === direction) ? '' : direction;
                                            break;
                                    default:
                                            columns[c].sort = (undefined === direction) ? SORT_ASC : direction;
                            }

                            Y.log('Sorting ' + columns[c].title);
                            break;
                    }
            }

            this.set('columns', columns);
    },

    /**
     * Handle a change in the columns attribute
     * Causes columns to be re-rendered.
     *
     * @method _afterColumnsChange
     * @protected
     */
    _afterColumnsChange : function(e) {
            Y.log('gallery-dp-table-headers:_afterColumnsChange');

            var columns = this.get('columns'),
                    queryParameters = Array();

            for (var c=0; c < columns.length; c++) {
                    var col = columns[c];

                    queryParameters['sort[' + col.key + ']'] = col.sort;

                    // Column sorting switches between ascending, descending and none
                    switch (col.sort) {
                            case SORT_ASC:
                                    Y.log('Adding sort ASCENDING to ' + col.title);

                                    if (col.sortNode.hasClass(this.getClassName('sort','desc'))) {
                                            col.sortNode.removeClass(this.getClassName('sort','desc'));
                                    }

                                    col.sortNode.addClass(this.getClassName('sort','asc'));

                                    break;
                            case SORT_DESC:
                                    Y.log('Adding sort DESCENDING to ' + col.title);

                                    if (col.sortNode.hasClass(this.getClassName('sort','asc'))) {
                                            col.sortNode.removeClass(this.getClassName('sort','asc'));
                                    }

                                    col.sortNode.addClass(this.getClassName('sort','desc'));
                                    break;
                            default:
                                    Y.log('Removing sort from ' + col.title);

                                    if (col.sortNode.hasClass(this.getClassName('sort','desc'))) {
                                            col.sortNode.removeClass(this.getClassName('sort','desc'));
                                    }

                                    if (col.sortNode.hasClass(this.getClassName('sort','asc'))) {
                                            col.sortNode.removeClass(this.getClassName('sort','asc'));
                                    }
                    }
            }

            this.fire('queryUpdate', {parameters : queryParameters});
    },

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
    COLUMN_LABEL_TEMPLATE : '<span class="{className}">{label}</span>',

    /**
     * No content template because this is encompassed by a table tag.
     *
     * @property CONTENT_TEMPLATE
     * @static
     */
    CONTENT_TEMPLATE : null
    
}, {
    
    NAME : "dp-table-headers",

    ATTRS : {

            /**
             * Reference to the table head element
             * 
             * @attribute theadNode
             * @default null
             * @type Node
             */
            theadNode : {
                value: null
            },
            
            /**
             * Reference to the table row element containing the column headers
             *
             * @attribute columnsNode
             * @default null
             * @type Node
             */
            columnsNode : {
                    value : null
            },

            /**
             * Array of objects representing columns with keys for title and width
             * This will be refactored into a columns object.
             *
             * @attribute columns
             * @default Empty array
             * @type Array
             */
            columns : {
                    value : Array()
            }
    },

    HTML_PARSER : {
        
            // Reference to the thead node which will become our contentBox
            theadNode : 'thead.yui3-gallery-dp-table-headers',
            
            // Reference to the row holding the <TH> nodes, aka column headers.
            columnsNode : 'tr.yui3-gallery-dp-table-headers-columns',

            /**
             * Parse table column headers (TH) into a columns array.
             *
             * @param srcNode {Node}
             */
            columns : function(srcNode) {
                    var cols = Array(),
                            ths = srcNode.one('.yui3-dp-table-headers-columns').all('.yui3-dp-table-headers-column');

                    ths.each(function(th) {
                            cols.push({
                                    title: th.get('innerHTML'),
                                    width: th.get('width'),
                                    key: th.getAttribute(SORT_KEY),
                                    sort: th.getAttribute(SORT_DIRECTION),
                                    node: th
                            });
                    }, this);

                    Y.log(cols);
                    return cols;
            }
    }
});


}, '@VERSION@' ,{requires:['substitute', 'json-parse', 'node', 'widget', 'datatype', 'dataschema', 'datasource', 'node-pluginhost']});
