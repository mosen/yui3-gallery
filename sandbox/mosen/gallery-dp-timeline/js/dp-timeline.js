//YUI.add('dp-timeline', function(Y) {
	
    // shortcuts and constants
    var Lang = Y.Lang,
        Node = Y.Node,
        DataType = Y.DataType;

    /**
     * @description Static timeline in a gantt-like format
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
            this.after('dateChange', this._afterDateChange);
            
            this._ddNodeBackgroundContainer = new Y.DD.Drag({
                node: this.get('contentBox')
            }).plug(Y.Plugin.DDConstrained, {
                constrain: 'view',
                stickX: true
            });
                          
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
         * @description Render the containers for the headings
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
         * @description Render all of the day labels
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
         * @description Render the container that will hold events
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
         * @method _renderBackgroundContainer
         * @description Render the background objects
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
         * @method _renderBackgroundHighlights
         * @description Render highlight objects on the background which indicate holidays.
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
         * @method _getChildFreeSlot
         * @description Get the first available slot if this event overlaps, WidgetChild version
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
         * @description Get the calculated width of an event object
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
         * @method afterDateChange
         * @description Handle date change, update UI
         * @private
         */
        afterDateChange : function() {
            Y.log("afterDateChange", "info", "Y.DP.Timeline");
          
        },
        
        // Date math functions
        
        /**
         * @method getEndDate
         * @description Get the last date that should be shown on the timeline
         * @return Date Ending date for the timeline
         * @public
         */
        getEndDate : function() {
            Y.log("getEndDate", "info", "Y.DP.Timeline");
            
            var d = this.get('date'),
                endDate = new Date();
                
            endDate.setTime(d.getTime());
            
            // One day is deducted because the word length implies that the starting day is included in that range
            endDate.setDate(endDate.getDate() + (this.get('length') - 1)); 
            
            return endDate;
        },
        
        /**
         * @method dateToOffset
         * @description Convert the supplied date into an x offset
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
         * @description Convert the supplied slot number into a y offset
         * @method slotToOffset
         * @param slot {Number} Slot number
         * @private
         */
        slotToOffset : function(slot) {
            Y.log("slotToOffset", "info", "Y.DP.Timeline");
            
            return slot * (this.get('eventHeight')) + slot * this.get('gutter')
        },

        /**
         * @method isDatePublicHoliday
         * @description Determine if the given date is a public holiday or not
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
         * @property _dates
         * @description Array containing information about dates shown
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
             * @attribute tplDayContainer
             * @description Container for days of the week labels
             * @type String
             */
            tplDayContainer : {
                value : '<div class="{className}"></div>'
            },
            
            /**
             * @attribute tplDay
             * @description Box containing label for day of the week
             * @type String
             */
            tplDay : {
                value : '<div class="{className}"><span class="{labelClassName}">{label}</span></div>'
            },
            
            /**
             * @attribute tplEventContainer
             * @description Container for events that may span days
             * @type String
             */
            tplEventContainer : {
                value : '<div class="{className}"></div>'
            },
            
            /**
             * @attribute tplBackgroundContainer
             * @description Template for the background container which defines background style and holds highlighted days
             * @type String
             */
            tplBackgroundContainer : {
                value : '<div class="{className}"></div>'
            },
            
            /**
             * @attribute tplBackgroundHighlight
             * @description Template for background highlights, used for weekends
             * @type String
             */
            tplBackgroundHighlight : {
                value : '<div class="{className}">&nbsp;</div>'
            },
            
            /**
             * @description Width of each day label
             * @attribute dayWidth
             * @type Number
             */
            dayWidth : {
                value : 100,
                validator : Lang.isNumber
            },
            
            /**
             * @description Height of each event
             * @attribute eventHeight
             * @type Number
             */
            eventHeight : {
                value : 20,
                validator : Lang.isNumber
            },
            
            /**
             * @description Starting date of the timeline
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
             * @description The last date shown in the timeline
             * @attribute endDate
             * @type Date
             */
            endDate : {
                value : Date()
            },
            
            /**
             * @description length of the timeline in days
             * @attribute length
             * @type Number
             */
            length : {
                value : 8,
                validator : Lang.isNumber
            },
            
            /**
             * @description Hold the leftmost pixel of the rightmost event per slot to determine free slots
             * @attribute slots
             * @type Array
             */
            slots : {
                value : Array(),
                validator : Lang.isArray
            },
            
            /**
             * @description Size of the gutter in pixels that lies between each slot
             * @attribute gutter
             *
             * @type Number
             */
            gutter : {
                value : 3,
                validator : Lang.isNumber
            }
        },

        HTML_PARSER : {

        }
    });
            
//}, '@VERSION@' ,{requires:['base']});