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
                {start: '2011-03-24', finish: '2011-03-29', summary: 'Project B'},
                {start: '2011-03-22', finish: '2011-03-23', summary: 'Project C'},
                {start: '2011-03-23', finish: '2011-03-29', summary: 'Project D'},
                {start: '2011-03-24', finish: '2011-03-25', summary: 'Project E'},
                {start: '2011-03-27', finish: '2011-03-27', summary: 'Project F'},
                {start: '2011-03-28', finish: '2011-03-28', summary: 'Project G'},                
            ]
        });
        dptimeline.render('#gallery-dp-timeline');

});