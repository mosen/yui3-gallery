YUI().use('gallery-dp-search', function(Y) {

	var dps = new Y.DP.Search({
            timeout: 1000
        });
        dps.render('#gallery-dp-search');
});