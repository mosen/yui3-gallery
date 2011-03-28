YUI({
   /* filter: 'debug' */
}).use('gallery-dp-timeline', 'console', function(Y) {
        /*
	var yconsole = new Y.Console({
		newestOnTop: false,
		height: '600px'
	});*/
	//yconsole.render('#log');
        
        var dptimeline = new Y.DP.Timeline({
            date: new Date(),
            length: 9,
            children: [
                {start: '2011-03-29', finish: '2011-04-03', summary: 'Project A'},
                {start: '2011-04-01', finish: '2011-04-01', summary: 'Project B'},
                {start: '2011-04-01', finish: '2011-04-10', summary: 'Project C'}
            ]
        });

        dptimeline.render('#gallery-dp-timeline');
});