YUI().use('gallery-dp-timeline', 'console', function(Y) {
        /*
	var yconsole = new Y.Console({
		newestOnTop: false,
		height: '600px'
	});*/
	//yconsole.render('#log');
        
        var dptimeline = new Y.DP.Timeline({
            width: '800px',
            date: new Date(),
            events: [
                {start: '2011-03-25', finish: '2011-03-29', summary: 'Project A'},
                {start: '2011-03-22', finish: '2011-03-24', summary: 'Project B'},
                {start: '2011-03-23', finish: '2011-03-25', summary: 'Project C'}
            ]
        });
        dptimeline.render('#gallery-dp-timeline');

});