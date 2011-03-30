//YUI.add('dp-timeline', function(Y) {
	
    // shortcuts and constants
    var Lang = Y.Lang,
        Node = Y.Node,
        DataType = Y.DataType;

    /**
     * Static timeline in a gantt-like format
     *
     * @module gallery-dp-timeline
     * @class Y.DP.Timeline
     * @extends Widget
     */
    Y.namespace('DP').Timeline = Y.Base.create( 'gallery-dp-timeline', Y.Widget, [Y.WidgetParent], {
        
        /**
         * @method initializer
         * @param config {Object} Configuration object
         * @protected
         * @constructor
         */
        initializer: function() {
            Y.log("init", "info", "Y.DP.Timeline");
        },

        /**
         * Destructor lifecycle implementation
         *
         * @method destructor
         * @protected
         */
        destructor : function() { },

        /**
         * Create the DOM structure.
         *
         * @method renderUI
         * @protected
         */
        renderUI : function() {
            
            // Timeline headings, Date labels
            this._renderHeadings();
            this._renderHeadingsDays();
            
            // Background, Background highlights / markers
            this._renderBackgroundContainer();
            this._renderBackgroundHighlights();
            
            // Events
            this._renderEventContainer();
            this._childrenContainer = this._nodeEventContainer; // Render WidgetChild into this container
            
            
            this.get('contentBox').append(this._nodeDayContainer);
            this.get('contentBox').append(this._nodeEventContainer);
        },

        /**
         * Bind events to the ui
         * 
         * @method bindUI
         * @protected
         */
        bindUI : function() {
            
            // DOM EVENTS
            
            this.get('contentBox').delegate("mouseenter", 
                Y.bind(this.onEventMouseEnter, this), 
                'div.yui3-gallery-dp-timeline-event-content');
            
            
            this.get('contentBox').delegate("mouseleave", 
                Y.bind(this.onEventMouseLeave, this), 
                'div.yui3-gallery-dp-timeline-event-content');
            

            
            Y.on("key", Y.bind(this.onEventKeyDelete, this), document, "down:46, 8");

            // Set selection on mousedown
            this.on("gallery-dp-timeline-event:mousedown", function(event) {
               
               var item = event.target,
               domEvent = event.domEvent;
               
               if (this.get("multiple")) {
                   if (domEvent.metaKey) {
                       item.set("selected", 1);
                   } else {
                       this.deselectAll();
                       item.set("selected", 1);
                   }
               } else {
                   item.set("selected", 1);
               }
            });
            
            this._nodeBackgroundContainer.on("dblclick",
                Y.bind(this.onEventMouseDblClick, this));
            
            // ATTR EVENTS
            this.after('dateChange', this._afterDateChange);
            this.after('selectionChange', this._afterSelectionChange);
            this.after('addChild', this._afterChildrenChange);
            this.after('removeChild', this._afterChildrenChange);
            
            
            /*
            this._ddNodeBackgroundContainer = new Y.DD.Drag({
                node: this.get('contentBox')
            }).plug(Y.Plugin.DDConstrained, {
                constrain: 'view',
                stickX: true
            });*/
                          
        },

        /**
         * Synchronizes the DOM state with the attribute settings
         *
         * @method syncUI
         */
        syncUI : function() {
            Y.log("This timeline will finish on " + this.getEndDate(), "info", "Y.DP.Timeline");
            
            this.get('boundingBox').set('style.width', this.get('length') * this.get('dayWidth') + 'px');
        },
        
        // Rendering helper methods
        
        /**
         * Render the containers for the headings
         *
         * @method _renderHeadings
         * @private
         */
        _renderHeadings : function() {
            Y.log("_renderHeadings", "info", "Y.DP.Timeline");
            
            var nodeDayContainer = Node.create(Y.substitute(this.get('tplDayContainer'), {
               className : this.getClassName('day', 'container')
            }));
            
            this._nodeDayContainer = nodeDayContainer;
        },
        
        /**
         * Render all of the day labels
         *
         * @method _renderHeadingsDays
         * @private
         */
        _renderHeadingsDays : function() {
            Y.log("_renderHeadingsDays", "info", "Y.DP.Timeline");
            
            var currentDate = this.get('date'),
                labelDate,
                i;
            
            for (i = 0; i < this.get('length'); i++) {
                
                labelDate = new Date(currentDate.getTime());
                labelDate.setDate(labelDate.getDate() + i);
                 
                var lblDay = Node.create(Y.substitute(this.get('tplDay'), {
                    className : this.getClassName('day'),
                    labelClassName : this.getClassName('day', 'label'),
                    label : DataType.Date.format(labelDate, {format:"%a %e"})
                })),
                    leftOffset = this.dateToOffset(labelDate);
                
                lblDay.set('style.left', leftOffset + 'px');
                lblDay.set('style.width', this.get('dayWidth') + 'px');

                this._nodeDayContainer.append(lblDay);
                this._dates.push({ date: labelDate, left: leftOffset });
            }
            
        },
        
        /**
         * Render the container that will hold events
         *
         * @method _renderEventContainer
         * @private
         */
        _renderEventContainer : function() {
            Y.log("_renderEventContainer", "info", "Y.DP.Timeline");
            
            this._nodeEventContainer = Node.create(Y.substitute(this.get('tplEventContainer'), {
                className : this.getClassName('event', 'container')
            }));
           
        },
        
        /**
         * Render the background objects
         *
         * @method _renderBackgroundContainer
         * @private
         */
        _renderBackgroundContainer : function() {
            Y.log("_renderBackgroundContainer", "info", "Y.DP.Timeline");
            
            var nodeBg = Node.create(Y.substitute(this.get('tplBackgroundContainer'), {
                className : this.getClassName('background')
            }));
            nodeBg.set('style.width', this.get('length') * this.get('dayWidth') + 'px');
            
            this._nodeBackgroundContainer = nodeBg;
            this.get('contentBox').append(this._nodeBackgroundContainer);
        },
        
        /**
         * Render highlight objects on the background which indicate holidays.
         *
         * @method _renderBackgroundHighlights
         * @private
         */
        _renderBackgroundHighlights : function() {
            Y.log("_renderBackgroundHighlights", "info", "Y.DP.Timeline");
            
            Y.Array.each(this._dates, function(d){
            
                if (this.isDatePublicHoliday(d.date)) {
                    Y.log("is public holiday :" + d.date, "info", "Y.DP.Timeline");

                    var nodeBgHl = Node.create(Y.substitute(this.get('tplBackgroundHighlight'), {
                        className : this.getClassName('background', 'highlight')
                    }));
                    nodeBgHl.set('style.left', this.dateToOffset(d.date) + 'px');
                    nodeBgHl.set('style.width', this.get('dayWidth') + 'px');

                    this._nodeBackgroundContainer.append(nodeBgHl);
                }
            
            }, this);
        },
        
        /**
         * Get the first available slot if this event overlaps, WidgetChild version
         *
         * @method _getChildFreeSlot
         * @private
         */
        _getChildFreeSlot : function(e, leftedge) {
            Y.log("_getFreeSlot: " + e.get('summary'), "info", "Y.DP.Timeline");
            
            var slots = this.get('slots');
            
            if (Lang.isNumber(e.get('slot'))) {
                return e.get('slot');
            }
            
            for (var i = 0; i < slots.length; i++) {
                if (slots[i] <= leftedge) {
                    //Y.log("_getFreeSlot: Found free slot " + i + " because slot rightedge was " + slots[i] + " vs our leftedge " + leftedge, "info", "Y.DP.Timeline");
                    break;
                } else {
                    //Y.log("_getFreeSlot: Cant use slot " + i + " because slot rightedge was " + slots[i] + " vs our leftedge " + leftedge, "info", "Y.DP.Timeline");
                }
            }
            
            return i;
        },
        
        /**
         * Remove the currently selected item (if any)
         *
         * @method removeSelected
         * @private
         */
        removeSelected : function() {
            Y.log("removeSelected", "info", "Y.DP.Timeline");
            
            this.get('selection').remove();
        },
          
        /**
         * Get the calculated width of an event object
         *
         * @method getEventWidth
         * @param e {Y.DP.TimelineEvent} Event child object
         * @private
         */
        getEventWidth : function(e) {
            Y.log("getEventWidth", "info", "Y.DP.Timeline");
            
            return this.get('dayWidth') * e.get('duration');
        },
  
        // ATTR change hooks
        
        
        /**
         * Handle a change in child objects, from WidgetParent
         * 
         * @method _afterChildrenChange
         * @private
         */
        _afterChildrenChange : function() {
            Y.log("_afterChildrenChange", "info", "Y.DP.Timeline");
            
            this.reflowEvents();
        },
        
        /**
         * Re-flow events so that they are stacked where possible
         * 
         * @method reflowEvents
         * @public
         */
        reflowEvents : function() {
            Y.log("reflowEvents", "info", "Y.DP.Timeline");
            
            var childLeftOffset,
                childSlot,
                slots;
            
            this.set('slots', new Array());
            
            this.each(function(c) {
                
                c.set('slot', undefined);
                childLeftOffset = this.dateToOffset(c.get('start'));
                childSlot = this._getChildFreeSlot(c, childLeftOffset);
                Y.log("Reflowing Child: " + c.get('summary') + " to slot: " + childSlot, "info", "Y.DP.Timeline");
                
                c.set('slot', childSlot);
                slots = this.get('slots');
                slots[childSlot] = childLeftOffset + this.getEventWidth(c);
                
                this.set('slots', slots);
            }, this);
        },
        
        /**
         * Handle date change, update UI
         *
         * @method afterDateChange
         * @private
         */
        afterDateChange : function() {
            Y.log("afterDateChange", "info", "Y.DP.Timeline");
          
        },
        
        /**
         * Handle selection change, update UI
         *
         * @method afterSelectionChange
         * @private
         */
        afterSelectionChange : function() {
            Y.log("afterSelectionChange", "info", "Y.DP.Timeline");
        },
        
        /**
         * Handle mouse entering an event
         *
         * @method onEventMouseEnter
         * @private
         */
        onEventMouseEnter : function(e) {
            //Y.log("onEventMouseEnter", "info", "Y.DP.Timeline");
            e.currentTarget.addClass(this.getClassName('event', 'over'));
        },
        
        /**
         * Handle mouse leaving an event
         *
         * @method onEventMouseLeave
         * @private
         */
        onEventMouseLeave : function(e) {
            //Y.log("onEventMouseLeave", "info", "Y.DP.Timeline");
            e.currentTarget.removeClass(this.getClassName('event', 'over'));
        },
        
        /**
         * Delete selected event when a delete/backspace key is pressed
         *
         * @method onEventKeyDelete
         * @param e {Event} Event facade
         * @private
         */
        onEventKeyDelete : function(e) {
            Y.log("onEventKeyDelete", "info", "Y.DP.Timeline");
            
            this.get('selection').remove();
        },
        
        /**
         * @description Handle mouse doubleclick on background
         * @method onEventMouseDblClick
         * @private
         */
        onEventMouseDblClick : function() {
            Y.log("onEventMouseDblClick", "info", "Y.DP.Timeline");
            
            this.add(this.get('childPrototype'));
        },
        
        // Date math functions
        
        /**
         * Get the last date that should be shown on the timeline
         *
         * @method getEndDate
         * @return Date Ending date for the timeline
         * @public
         */
        getEndDate : function() {
            Y.log("getEndDate", "info", "Y.DP.Timeline");
            
            // One day is deducted because the word length implies that the starting day is included in that range
            return Y.DP.TimelineUtil.addDays(this.get('date'), (this.get('length') - 1));
        },
        
        /**
         * Convert the supplied date into an x offset
         *
         * @method dateToOffset
         * @param d {Date} Date which will be compared to our date attribute
         * @private
         */
        dateToOffset : function(d) {
            // Y.log("dateToOffset", "info", "Y.DP.Timeline");
            
            var duration = Y.DP.TimelineUtil.rangeToDifference(this.get('date'), d),
                offset = duration * this.get('dayWidth');
            
            Y.log("dateToOffset:" + offset + "px", "info", "Y.DP.Timeline");
            
            return offset;
        },
        
        /**
         * Convert the supplied slot number into a y offset
         *
         * @method slotToOffset
         * @param slot {Number} Slot number
         * @private
         */
        slotToOffset : function(slot) {
            Y.log("slotToOffset", "info", "Y.DP.Timeline");
            
            return slot * (this.get('eventHeight')) + slot * this.get('gutter');
        },

        /**
         * Determine if the given date is a public holiday or not
         *
         * @method isDatePublicHoliday
         * @param d {Date} Date to examine
         * @todo Support alternate datasource for public holidays in addition to fixed holidays
         * @return boolean True if date is a public holiday
         * @private
         */
        isDatePublicHoliday : function(d) {
            //Y.log("isDatePublicHoliday", "info", "Y.DP.Timeline");
            
            if (d.getDay() === 0 || d.getDay() === 6) {
                return true;
            } else {
                return false;
            }
        },
        
        /**
         * Array containing information about dates shown
         *
         * @property _dates
         * @private
         */
        _dates : Array()

    }, {
        // @see Y.Widget.NAME
        NAME : "timeline",

        ATTRS : {
            
            /**
             * Default child class to use
             * 
             * @attribute defaultChildType
             * @type String
             * @readonly
             * @private
             */
            defaultChildType: {
                value: Y.DP.TimelineEvent
            },
            
            /**
             * Container for days of the week labels
             *
             * @attribute tplDayContainer
             * @type String
             */
            tplDayContainer : {
                value : '<div class="{className}"></div>'
            },
            
            /**
             * Box containing label for day of the week
             *
             * @attribute tplDay
             * @type String
             */
            tplDay : {
                value : '<div class="{className}"><span class="{labelClassName}">{label}</span></div>'
            },
            
            /**
             * Container for events that may span days
             *
             * @attribute tplEventContainer
             * @type String
             */
            tplEventContainer : {
                value : '<div class="{className}"></div>'
            },
            
            /**
             * Template for the background container which defines background style and holds highlighted days
             *
             * @attribute tplBackgroundContainer
             * @type String
             */
            tplBackgroundContainer : {
                value : '<div class="{className}"></div>'
            },
            
            /**
             * Template for background highlights, used for weekends
             *
             * @attribute tplBackgroundHighlight
             * @type String
             */
            tplBackgroundHighlight : {
                value : '<div class="{className}">&nbsp;</div>'
            },
            
            /**
             * Width of each day label
             *
             * @attribute dayWidth
             * @type Number
             */
            dayWidth : {
                value : 100,
                validator : Lang.isNumber
            },
            
            /**
             * Height of each event
             *
             * @attribute eventHeight
             * @type Number
             */
            eventHeight : {
                value : 20,
                validator : Lang.isNumber
            },
            
            /**
             * Starting date of the timeline
             *
             * @attribute date
             * @type Date
             */
            date : {
                value : Date(),
                setter : function(value) {
                    return Y.DP.TimelineUtil.zeroTime(value);
                }
            },
            
            /**
             * The last date shown in the timeline
             *
             * @attribute endDate
             * @type Date
             */
            endDate : {
                value : Date()
            },
            
            /**
             * length of the timeline in days
             *
             * @attribute length
             * @type Number
             */
            length : {
                value : 8,
                validator : Lang.isNumber
            },
            
            /**
             * Hold the leftmost pixel of the rightmost event per slot to determine free slots
             *
             * @attribute slots
             * @type Array
             */
            slots : {
                value : Array(),
                validator : Lang.isArray
            },
            
            /**
             * Size of the gutter in pixels that lies between each slot
             *
             * @attribute gutter
             * @type Number
             */
            gutter : {
                value : 3,
                validator : Lang.isNumber
            },
            
            /**
             * Prototype object for child objects
             * 
             * @attribute childPrototype
             * @type Object
             */
            childPrototype : {
                readonly: true,
                getter: function() {
                    return {start: this.get('date'), 
                            finish: this.get('date'), 
                            summary: 'Title', 
                            category: 'booked'};
                }
            }
        },

        HTML_PARSER : {

        }
    });
            
//}, '@VERSION@' ,{requires:['base']});