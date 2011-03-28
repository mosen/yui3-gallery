/**
 *
 *
 * @module gallery-dp-timeline-event
 * @requires Lang, Base, Widget
 */

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang,
    contentClassName = Y.ClassNameManager.getClassName('gallery-dp-timeline-event', 'content'),
    boundingClassName = Y.ClassNameManager.getClassName('gallery-dp-timeline-event', 'bounding');

/**
 *
 *
 * @class Dp-timeline-event
 * @extends Widget
 */
Y.namespace('DP').TimelineEvent = Y.Base.create( 'gallery-dp-timeline-event', Y.Widget, [Y.WidgetChild], {

    /**
     * Content Template
     * @attribute CONTENT_TEMPLATE
     * @protected
     */
    CONTENT_TEMPLATE : '<div class="' + contentClassName + '"></div>',
    
    /**
     * Bounding Template
     * @attribute BOUNDING_TEMPLATE
     * @protected
     */
    BOUNDING_TEMPLATE : "<div></div>",

    /**
     *
     *
     * @method initializer
     * @param config {Object} Configuration object
     * @protected
     * @constructor
     */
    initializer : function (config) {
        Y.log("init event", "info", "Y.DP.TimelineEvent");

        this._afterDateChange(); // Calculate Duration
    },

    /**
     * Create the DOM structure for the dp-timeline-event.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        
        
        var parent = this.get('parent'),
            width = parent.getEventWidth(this),
            leftOffset = parent.dateToOffset(this.get('start')),
            slot = parent._getChildFreeSlot(this, leftOffset),
            topOffset = parent.slotToOffset(slot),
            rightOffset = leftOffset + width;
            
            
        var evt = Node.create(Y.substitute('<span class="{titleClassName}">{title}</span>', {
            titleClassName : parent.getClassName('event', 'title'),
            title : this.get('summary')
        }));
        
        this.get('contentBox').append(evt);
        
        this.set('slot', slot);
        
        Y.log("render X:" + leftOffset + " Y:" + topOffset + " W:" + width, "info", "Y.DP.TimelineEvent");
        
        this.get('boundingBox').set('style.left', leftOffset + 'px');
        this.get('boundingBox').set('style.top', topOffset + 'px');
        this.set('width', width + 'px');
        
        var slots = this.get('parent').get('slots');
        
        slots[slot] = rightOffset;
        this.get('parent').set('slots', slots);        
        
        Y.log("renderUI", "info", "Y.DP.TimelineEvent");
    },


    /**
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        this.after('startChange', this._afterDateChange);
        this.after('finishChange', this._afterDateChange);
    },
    
    /**
     * Synchronizes the DOM state with the attribute settings
     *
     * @method syncUI
     */
    syncUI : function () {
        
    },

    /**
     * Destructor lifecycle implementation for the dp-timeline-event class.
     *
     * @method destructor
     * @protected
     */
    destructor: function() { },
    
    
    
    
    /**
     * @description Recalculate duration and width after date changes
     * @method _afterDateChange
     * @private
     */
    _afterDateChange : function() {
        Y.log("_afterDateChange", "info", "Y.DP.TimelineEvent");
        
        // Update calculated duration
        this.set('duration', Y.DP.TimelineUtil.rangeToDuration(this.get('start'), this.get('finish')));
    }
    // Use NetBeans Code template "ymethod" to add methods here

}, {

    /**
     * Required NAME static field, to identify the Widget class and 
     * used as an event prefix, to generate class names etc. (set to the 
     * class name in camel case).
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME : "event",

    /**
     * Static Object hash used to capture existing markup for progressive
     * enhancement.  Keys correspond to config attribute names and values
     * are selectors used to inspect the contentBox for an existing node
     * structure.
     *
     * @property HTML_PARSER
     * @type Object
     * @protected
     * @static
     */
    HTML_PARSER : {},

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : { 
        
        /**
         * Strings that need to be localized can be placed here
         *
         * @property ATTRS
         * @type Object
         * @protected
         * @static
         */

        
        /**
         * @description Starting date of the event (inclusive)
         * @attribute start
         * @type Date
         */
        start : {
            value : new Date(),
            setter : function(v) {
                return Lang.isString(v) ? Y.DataType.Date.parse(v) : v;
            }
        },
        
        /**
         * @description Ending date of the event (non inclusive)
         * @attribute finish
         * @type Date
         */
        finish : {
            value : new Date(),
            setter : function(v) {
                return Lang.isString(v) ? Y.DataType.Date.parse(v) : v;
            }
        },

        /**
         * @description Duration (in days) of the event
         * @attribute duration
         * @type Number
         */
        duration : {
            value : 0,
            validator : Lang.isNumber
        },
        
        /**
         * @description Title of the event
         * @attribute summary
         * @type String
         */
        summary : {
            value : '',
            validator : Lang.isString
        },
        
        /**
         * @description Vertical slot to fit this event into, parent will calculate this
         * @attribute slot
         * @type Number
         */
        slot : {
            value : undefined
        }

        // Use NetBeans Code Template "yattr" to add attributes here
    }
});

