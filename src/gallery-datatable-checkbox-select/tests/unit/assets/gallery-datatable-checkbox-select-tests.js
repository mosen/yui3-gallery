YUI.add('gallery-datatable-checkbox-select-tests', function (Y) {

    var suite = new Y.Test.Suite("gallery-datatable-checkbox-select");

    suite.add(new Y.Test.Case({
        name: "gallery-datatable-checkbox-select tests",

        setUp: function() {

            this.list = new Y.ModelList();

            this.dt = new Y.DataTable({
                columns: [
                    {
                        key: "id",
                        label: "id",
                        width: "50px"
                    }
                ],
                sortable: true,
                modelList: this.list,
                primaryKeys: [ 'id' ],
                checkboxSelectMode: true
            });
        },

        tearDown: function() {
            this.dt.destroy();
            this.list.destroy();
        },

        /*
         * This error is thrown when checkbox select calls syncUI before the table structure is fully rendered.
         * datatable-message tries to render the `no rows available` message into the _tableNode which doesn't exist
         * yet.
         * ---
         * TypeError: this._tableNode is undefined
         *
         * this._tableNode.insertBefore(this._messageNode, this._tbodyNode);
         * datatable-message.js: 228
         * ---
         *
         * This is a regression test for that bug.
         */
        "bug: github.com/stlsmiths/yui3-gallery#7, TypeError thrown after gallery-datatable-checkbox-select calls syncUI() manually": function() {
            this.dt.render();
        }

    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['gallery-datatable-checkbox-select', 'datatable', 'test']});