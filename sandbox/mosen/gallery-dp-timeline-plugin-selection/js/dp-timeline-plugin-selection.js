/**
 * The timeline selection plugin allows events to be selected and fires events when they are selected.
 * 
 * The selection can also be retrieved from this plugin
 *
 * @module gallery-dp-timeline-plugin-selection
 * @requires gallery-dp-timeline
 */

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang;

/**
 * Y.DP.TimelineSelection plugin
 *
 * @class dp-timeline-plugin-selection
 * @extends Plugin
 */
Y.namespace('DP').TimelineSelection = Y.Base.create('gallery-dp-timeline-plugin-selection', Y.Plugin.Base, [], {

    /**
     * Widget lifecycle: Initializer
     *
     * @method initializer
     * @param config {Object} Configuration object
     * @protected
     * @constructor
     */
    initializer : function (config) {
        Y.log("init", "info", "Y.DP.TimelineSelection");

        this.afterHostMethod('bindUI', this.bindUI);
        // this.afterHostEvent('render', this.onHostRenderEvent);
        // this.afterHostMethod('render', this.onHostRender);
    },

    /**
     * Create the DOM structure for the gallery-dp-timeline-plugin-selection.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {

    },


    /**
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        Y.log("bindUI", "info", "Y.DP.TimelineSelection");
        
        this.after('selectedChange', function() { Y.log('selected changed!!!')});

        this.get('host').get('contentBox').delegate("click", 
            Y.bind(this.onEventMouseClick, this), 
            '.yui3-gallery-dp-timeline-event-content', 'div');
            
        this.get('host').get('contentBox').delegate("mouseenter", 
            Y.bind(this.onEventMouseEnter, this), 
            '.yui3-gallery-dp-timeline-event-content', 'div');
            
        this.get('host').get('contentBox').delegate("mouseleave", 
            Y.bind(this.onEventMouseLeave, this), 
            '.yui3-gallery-dp-timeline-event-content', 'div');
    },
    
    /**
     * Synchronizes the DOM state with the attribute settings
     *
     * @method syncUI
     */
    syncUI : function () {
        
    },

    /**
     * Destructor lifecycle implementation for the gallery-dp-timeline-plugin-selection class.
     *
     * @method destructor
     * @protected
     */
    destructor: function() { },
    
    /**
     * @description Handle mouse entering an event
     * @method onEventMouseEnter
     * @param e {Event} Event facade
     * @private
     */
    onEventMouseEnter : function(e) {
        Y.log("onEventMouseEnter", "info", "Y.DP.TimelineSelection");
        e.target.addClass(this.get('host').getClassName('event', 'over'));
    },
    
    /**
     * @description Handle mouse leaving an event
     * @method onEventMouseLeave
     * @private
     */
    onEventMouseLeave : function(e) {
        Y.log("onEventMouseLeave", "info", "Y.DP.TimelineSelection");
        e.target.removeClass(this.get('host').getClassName('event', 'over'));
    },
    
    /**
     * @description Handle mouse click on an event
     * @method onEventMouseClick
     * @private
     */
    onEventMouseClick : function(e) {
        Y.log("onEventMouseClick", "info", "Y.DP.TimelineSelection");
        
        var currentSelection = this.get('selected') || e.target;
        
        if (e.target == currentSelection) {
            // No need to reselect same thing
        } else {
            Y.log('Add selection');
            currentSelection.removeClass(this.get('host').getClassName('event', 'selected'));
            this.set('selected', e.target);
        }
    },
    
    /**
     * @description Handle selection change
     * @method afterSelectedChange
     * @private
     */
    afterSelectedChange : function() {
        Y.log("afterSelectedChange", "info", "Y.DP.TimelineSelection");
    }
    
    
    // Use NetBeans Code template "ymethod" to add methods here

}, {
    
    NAME : "timelineSelection",

    /**
     * The plugin namespace
     * 
     * @property Y.DP.TimelineSelection.NS
     * @type String
     * @protected
     * @static
     */
    NS : "selection",


    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Y.DP.TimelineSelection.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : { 
       
       /**
         * @description Node reference to the selected node
         * @attribute selected
         * @type Node
         */
        selected : {
            value : null
        }
       // Use NetBeans Code Template "yattr" to add attributes here
    }
        

});

