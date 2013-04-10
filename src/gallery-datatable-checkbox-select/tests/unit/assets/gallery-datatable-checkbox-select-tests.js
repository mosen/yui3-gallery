YUI.add('gallery-datatable-checkbox-select-tests', function (Y) {

    var suite = new Y.Test.Suite("gallery-datatable-checkbox-select");

    suite.add(new Y.Test.Case({
        name: "gallery-datatable-checkbox-select tests",

        setUp: function() {

            this.list = new Y.ModelList();
            this.dt = new Y.DataTable({
                modelList: this.list,
                primaryKeys: [ 'id' ],
                checkboxSelectMode: true
            });
        },

        tearDown: function() {
            this.dt.destroy();
            this.list.destroy();
        },

        "BUG#4: datatable-message throws a TypeError with empty ModelList and checkbox-select enabled": function() {
            this.dt.render();
        }

    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['gallery-datatable-checkbox-select', 'test']});