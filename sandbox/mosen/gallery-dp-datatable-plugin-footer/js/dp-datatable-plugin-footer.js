/**
 * The DataTable footer plugin allows you to display any value in the footer section of the table.
 * You can do simple calculations or provide a function to render content based on the recordset.
 * 
 * @module dp-datatable-plugin-footer
 */

YUI.add('dp-datatable-plugin-footer', function(Y) {
	
	var Lang = Y.Lang,
		Node = Y.Node,
		YgetClassName = Y.ClassNameManager.getClassName;
	
	/**
	 * The DataTable footer plugin allows you to display any value in the footer section of the table.
	 * You can do simple calculations or provide a function to render content based on the recordset.
	 * 
	 * The footer columnset definition is different to the DataTable columnset definition because there are use cases for
	 * footer columns not based on data, or aggregated from multiple columns.
	 * 
	 * @class DataTableFooter
	 * @extends Plugin
	 * @augments DataTable
	 * @param config {Object} Configuration object literal with initial attribute values
	 * @constructor
	 */
	Y.namespace('DP').DataTableFooter = Y.Base.create( 'dp-datatable-plugin-footer', Y.Plugin.Base, [], {
		
		initializer: function(config) {
			Y.log('initializer', 'info', 'DataTableFooter');
			
			this.afterHostMethod("render", this._renderFooter);        
            this.afterHostEvent("recordsetChange", this._renderColumnValues);
		},
		
		destructor : function() {
			
		},
		
		/**
		 * @method _renderFooter
		 * @description Renders the initial markup for the footer.
		 * @private
		 */
		_renderFooter : function() {
			var columnset = this.get('columnset');
			
			Y.log('_afterHostRenderMethod', 'info', 'DataTableFooter');
			
			this._tfoot = Node.create(Y.substitute(this.get('tfootTemplate'), {
				tfootClassName: this.get('host').getClassName('footer', 'tfoot'),
				trClassName: this.get('host').getClassName('footer', 'tr')
			}));
			
			this.get('host').get('contentBox').one('table').append(this._tfoot);
		},
		
		/**
		 * @method _renderColumnValues
		 * @description Render the footer definition. Occurs every time the recordSetChange event is fired by the host.
		 * @return undefined
		 */
		_renderColumnValues : function() {
			Y.log('_renderColumnValues', 'info', 'DataTableFooter');
			
			var columns = this.get('columnset'),
				columnNodes = Array(),
				columnNode,
				v = "",
				span = 1;
			
			Y.Array.each(columns, function(c) {
				
				if (Lang.isFunction(c.value)) {
					v = c.value(this.get('host').get('recordset'));
				} else {
					v = c.value;
				}
				
				if (c.span !== undefined) {
					span = c.span;
				} else {
					span = 1;
				}
				
				columnNode = Node.create(Y.substitute(this.get('tdTemplate'), {
					tdClassName: this.get('host').getClassName('footer', 'col'),
					linerClassName: this.get('host').getClassName('liner'),
					tdColSpan: span,
					value: v
				}));

				this._tfoot.one('tr').append(columnNode);
			}, this);
		}
		
	},{
		
		/**
		 * @property _tfoot
		 * @description Reference to the created TFOOT node
		 * @type Node
		 * @default undefined
		 */
		_tfoot : undefined,
		
		/**
		 * @property NAME
		 * @type String
		 */
		NAME : "datatableFooter",
		
		/**
		 * @property NS
		 * @type String
		 */
		NS : "dtfoot",
		
		
		ATTRS : {
			
			/**
			 * @attribute columnset
			 * @description Column definitions for the footer section.
			 * @type Array
			 */
			columnset : {
				value : Array()
			},
			
			/**
			 * @attribute tfootTemplate
			 * @description Template for the footer minus the columns
			 * @type String
			 */
			tfootTemplate : {
				value : "<tfoot class=\"{tfootClassName}\"><tr class=\"{trClassName}\"></tr></tfoot>"
			},
			
			/**
			 * @attribute tdTemplate
			 * @description Template for every footer cell
			 * @type String
			 */
			tdTemplate : {
				value : "<td class=\"{tdClassName}\" colspan=\"{tdColSpan}\"><div class=\"{linerClassName}\">{value}</div></td>"
			}
		}
	});
}, '@VERSION@' ,{requires:['base']});