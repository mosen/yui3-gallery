YUI().use('datasource', 'gallery-dp-datatype', 'gallery-dp-table', 'gallery-dp-search', function(Y) {
	
	/**
	 * Render a project name cell, with link to project.
	 * 
	 * @param data {Object} Row data.
	 * @param field {String} Field name.
	 * @param cellNode {Node} Reference to cell node.
	 */
	function renderProjectCell( data, field, cellNode ) {
                if (cellNode == null) { throw('cellNode not supplied to formatter.'); }

                var uri = '/projects/edit/object/id/' + data["id"];
		var aNode = Y.Node.create(Y.substitute('<a href="{uri}">{title}</a>', {
			uri : uri,
			title : data[field]
		}));
		cellNode.append(aNode);
	}
	
	function initTable() {
            
            //console.profile();
            var myDataSource = new Y.DataSource.Local({source: { 
                    resultCount: 5,
                    results : [
                        { id: 1, start: '2010-01-01 00:00:00', finish: '2010-12-01 00:00:00', progress: '50', name: 'test project 1' },
                        { id: 2, start: '2010-01-01 00:00:00', finish: '2010-12-01 00:00:00', progress: '60', name: 'some other project' },
                        { id: 3, start: '2010-01-01 00:00:00', finish: '2010-12-01 00:00:00', progress: '10', name: 'again another one' },
                        { id: 4, start: '2010-01-01 00:00:00', finish: '2010-12-01 00:00:00', progress: '33', name: 'etc etc' },
                        { id: 5, start: '2010-01-01 00:00:00', finish: '2010-12-01 00:00:00', progress: '98', name: 'project number five' }
                    ]
            }});
        
            myDataSource.plug(Y.Plugin.DataSourceJSONSchema, {
                schema: {
                    metaFields : { count: "resultCount" },
                    resultListLocator : "results",
                    resultFields : [
                    // DP.DataType.DateTime Was created to natively parse MySQL ISO8601 DateTimes
                    { key:"finish", parser:Y.DP.DataType.DateTime.parse }, 
                    { key:"start", parser:Y.DP.DataType.DateTime.parse },
                    "progress",
                    "name",
                    "id"
                    ]
                }
            });
		
		// 12 cache entries covers all permutations of sorting (single column sort only)
		myDataSource.plug({fn:Y.Plugin.DataSourceCache, cfg:{max:12}});
	
		var tbl = new Y.DP.TableBody({ 
			srcNode : '.yui3-dp-table',
			boundingBox : '.yui3-dp-table-body',
			dataSource : myDataSource,
			cells : [
			         { field: "name", renderer: renderProjectCell, width: '150em' },
			         { field: "start", renderer: Y.DP.CellRenderers.niceDate, width: '15em' },
			         { field: "finish", renderer: Y.DP.CellRenderers.niceDate, width: '15em' },
                                 { field: "progress", renderer: Y.DP.CellRenderers.progress, width: '20em' }
			]
		});
		
		var thead = new Y.DP.TableHeaders({ srcNode: '.yui3-dp-table', boundingBox: '.yui3-dp-table-headers' });
		thead.on('queryUpdate', tbl.handleParameterChange, tbl);
		thead.render();
		
		var search = new Y.DP.Search({ srcNode: '.yui3-dp-search' });
		search.on('queryUpdate', tbl.handleParameterChange, tbl);
		search.render();

		tbl.render();
            
            //console.profileEnd();
	}
	
	//Y.on("available", initTable, "#projects-list-content");
	initTable();
});