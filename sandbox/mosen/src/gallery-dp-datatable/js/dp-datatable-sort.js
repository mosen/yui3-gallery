Y.namespace('DP').DataTableSort = Y.augment( Y.Plugin.DataTableSort, {
   /**
    * Before header cell element is created, inserts link markup around {value}.
    * 
    * Fix static "title" in TH node
    * Ticket #2529943 / http://yuilibrary.com/projects/yui3/ticket/2529943
    *
    * @method _beforeCreateTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _beforeCreateTheadThNode: function(o) {
        Y.log("augmented sort th node", "info", "object");
        if(o.column.get("sortable")) {
            o.value = Y.substitute(this.get("template"), {
                link_class: o.link_class || "",
                link_title: o.column.get("title") || "title",
                link_href: "#",
                value: o.value
            });
        }
    }
}, true);