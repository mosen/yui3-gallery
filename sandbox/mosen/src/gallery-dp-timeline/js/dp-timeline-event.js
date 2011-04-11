

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang,
    Node = Y.Node,
    contentClassName = Y.ClassNameManager.getClassName('gallery-dp-timeline-event', 'content'),
    boundingClassName = Y.ClassNameManager.getClassName('gallery-dp-timeline-event', 'bounding');

/**
 * Timeline event represents a single event on a Y.DP.Timeline
 *
 * @class DP.TimelineEvent
 * @extends Widget
 */
Y.namespace('DP').TimelineEvent = Y.Base.create( 'gallery-dp-timeline-event', Y.Widget, [Y.WidgetChild], {

    /**
     * Content Template
     * 
     * @property CONTENT_TEMPLATE
     * @protected
     */
    CONTENT_TEMPLATE : '<div class="' + contentClassName + '"></div>',
    
    /**
     * Bounding Template
     * 
     * @property BOUNDING_TEMPLATE
     * @protected
     */
    BOUNDING_TEMPLATE : "<div></div>",

    /**
     * Y.Widget Lifecycle : Initializer
     *
     * @method initializer
     * @param config {Object} Configuration object
     * @constructor
     * @protected
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
        
        Y.log("renderUI:" + this.get('summary'), "info", "Y.DP.TimelineEvent");
        
        var parent = this.get('parent'),
            width = parent.getEventWidth(this),
            myStartDate = this.get('start'),
            leftOffset = parent.dateToLocalOffset(myStartDate),
            slot = parent._getChildFreeSlot(this, leftOffset),
            topOffset = parent.slotToOffset(slot),
            rightOffset = leftOffset + width,
            slots = parent.get('slots');
            
            Y.log("mystartdate : " + myStartDate, "info", "Y.DP.TimelineEvent");    
            
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
        
        slots[slot] = rightOffset;
        this.get('parent').set('slots', slots);        
        
        Y.log("renderUI", "info", "Y.DP.TimelineEvent");
    },


    /**
     * Y.Widget Lifecycle
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        this._parentEventHandles = [
            this.after('startChange', this._afterDateChange),
            this.after('finishChange', this._afterDateChange),
            this.after('slotChange', this._afterSlotChange),
            this.get('parent').after('offsetChange', this._afterParentDateChange, this)
        ];
        
        this.after('parentChange', this._afterParentChange); // Disconnect Events
    },
    
    /**
     * Synchronizes the DOM state with the attribute settings
     *
     * @method syncUI
     * @protected
     */
    syncUI : function () {
        this.get('contentBox').addClass(this.getClassName(this.get('category')));
    },

    /**
     * Destructor lifecycle implementation for the dp-timeline-event class.
     *
     * @method destructor
     * @protected
     */
    destructor: function() { 
        Y.log("destroy", "info", "Y.DP.TimelineEvent");
    },
    
    /**
     * Recalculate duration and width after date changes
     * @method _afterDateChange
     * @private
     */
    _afterDateChange : function() {
        Y.log("_afterDateChange", "info", "Y.DP.TimelineEvent");
        
        // Update calculated duration
        this.set('duration', Y.DP.TimelineUtil.rangeToDuration(this.get('start'), this.get('finish')));
    },
    
    /**
     * Recalculate offset after parent date changes
     * 
     * @method _afterParentDateChange
     * @param e {Event} ATTR Change Event
     * @private
     */
    _afterParentDateChange : function(e) {
        Y.log("_afterParentDateChange", "info", "Y.DP.TimelineEvent");
        
        var parent = this.get('parent'), 
            leftOffset = parent.dateToLocalOffset(this.get('start'));
                     
                     
        this.get('boundingBox').set('style.left', leftOffset + 'px');
    },
    
    /**
     * Reset the Y position when the slot attribute changes
     * 
     * @method _afterSlotChange
     * @private
     */
    _afterSlotChange : function(e) {
        //Y.log("_afterSlotChange", "info", "Y.DP.TimelineEvent");
        
        var topOffset = this.get('parent').slotToOffset(this.get('slot'));
        this.get('boundingBox').set('style.top', topOffset + 'px');
    },
    
    /**
     * Detach events when parent changes.
     * 
     * @method _afterParentChange
     * @private
     */
    _afterParentChange : function() {
        Y.log("_afterParentChange", "info", "Y.DP.TimelineEvent");
        
        Y.Array.each(this._parentEventHandles, function(h) { h.detach(); });
    },
    
    /**
     * Array of handles to parent events.
     * 
     * @property _parentEventHandles
     * @type Array
     */
    _parentEventHandles : []

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
    NAME : "timelineEvent",

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
         * Starting date of the event (inclusive)
         * 
         * @attribute start
         * @type Date
         */
        start : {
            value : new Date(),
            setter : function(v) {
                return Lang.isDate(v) ? v : new Date(Date.parse(v));
                //return Lang.isString(v) ? Y.DataType.Date.parse(v) : v;
            }
        },
        
        /**
         * Ending date of the event (non inclusive)
         * 
         * @attribute finish
         * @type Date
         */
        finish : {
            value : new Date(),
            setter : function(v) {
                return Lang.isDate(v) ? v : new Date(Date.parse(v));
                //return Lang.isString(v) ? Y.DataType.Date.parse(v) : v;
            }
        },

        /**
         * Duration (in days) of the event
         * 
         * @attribute duration
         * @type Number
         */
        duration : {
            value : 0,
            validator : Lang.isNumber
        },
        
        /**
         * Title of the event
         * 
         * @attribute summary
         * @type String
         */
        summary : {
            value : '',
            validator : Lang.isString
        },
        
        /**
         * Category of the event, used for colouring
         * 
         * @attribute category
         * @type String
         */
        category : {
            value : '',
            validator : Lang.isString
        },
        
        /**
         * Vertical slot to fit this event into, parent will calculate this
         * 
         * @attribute slot
         * @type Number
         */
        slot : {
            value : undefined
        }

        // Use NetBeans Code Template "yattr" to add attributes here
    }
});

