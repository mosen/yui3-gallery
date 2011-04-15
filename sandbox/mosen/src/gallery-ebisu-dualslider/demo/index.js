YUI({
    filter: 'debug'
}).use('gallery-ebisu-dualslider', 'console', function(Y) {
        /*
	var yconsole = new Y.Console({
		newestOnTop: false,
		height: '600px'
	});*/
	//yconsole.render('#log');

        var slider = new Y.Slider();
        slider.render('.yui3-slider');

        var dslider = new Y.Ebisu.DualSlider();
        //var dslider = new Y.Slider();
        dslider.render('.yui3-dualslider');

        
});