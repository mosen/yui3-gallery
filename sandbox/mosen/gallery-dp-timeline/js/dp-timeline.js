//YUI.add('dp-timeline', function(Y) {
	
    // shortcuts and constants
    var Lang = Y.Lang,
        Node = Y.Node,
        DataType = Y.DataType;


    /**
     * @description gallery-dp-timeline presents a static timeline
     * @module gallery-dp-timeline
     * @class Y.DP.Timeline
     * @extends Widget
     */
    Y.namespace('DP').Timeline = Y.Base.create( 'gallery-dp-timeline', Y.Widget, [], {
        
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
        destructor : function() {

        },

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
            
            // Does not happen until datasource provides us with information
            //this._renderEvents();
            
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
            this.after('eventsChange', this._uiSetEvents);
        },

        /**
         * Synchronizes the DOM state with the attribute settings
         *
         * @method syncUI
         */
        syncUI : function() {
            Y.log("This timeline will finish on " + this.getEndDate(), "info", "Y.DP.Timeline");
            
            this.get('boundingBox').set('style.width', this.get('length') * this.get('dayWidth') + 'px');
            this._renderEvents();
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
         * @method _renderEvents
         * @description Render all events in the events array
         * @private
         */
        _renderEvents : function() {
            Y.log("_renderEvents", "info", "Y.DP.Timeline");

            var startingDate = this.get('date'),
                endingDate = this.getEndDate();
                
            this.clearDateTime(startingDate);
            this.clearDateTime(endingDate);
            
            Y.Array.each(this.get('events'), function (e) {
                
                if (e.start < startingDate) {
                    e.start = startingDate;
                    e.clippedLeft = true;
                } 
                
                if (e.finish > endingDate) {   
                    e.finish = endingDate;
                    e.clippedRight = true;
                }
                    
                this._renderEvent(e);
                
            }, this);
        },

        /**
         * @method _renderEvent
         * @description Render a single event on the timeline.
         * @param e {Object} Object literal of the event to render
         * @private
         */
        _renderEvent : function(e) {
            Y.log("_renderEvent", "info", "Y.DP.Timeline");
            
            var nodeEvt = Node.create(Y.substitute(this.get('tplEvent'), {
                outerClassName : this.getClassName('event'),
                className : this.getClassName('event', 'content'),
                leftCapClassName : this.getClassName('event', 'left'),
                titleClassName : this.getClassName('event', 'title'),
                title : e.summary
                })),
                duration = this.rangeToDuration(e.start, e.finish),
                leftOffset = this.dateToOffset(e.start),
                eventWidth = this.get('dayWidth') * duration,
                rightOffset = leftOffset + eventWidth,
                freeSlot = this._getFreeSlot(e, leftOffset),
                topOffset = freeSlot * (this.get('eventHeight')) + freeSlot * this.get('gutter'),
                slots = this.get('slots');
            
            e.slot = freeSlot;
            slots[freeSlot] = rightOffset;
           
            
            Y.log("_renderEvent:" + e.summary + " slot: " + e.slot , "info", "Y.DP.Timeline");
            
            nodeEvt.set('style.left', leftOffset + 'px');
            nodeEvt.set('style.top', topOffset + 'px');
            nodeEvt.set('style.width', eventWidth + 'px');
            
            nodeEvt.one('.' + this.getClassName('event', 'content')).set('style.height', this.get('eventHeight'));
            
            this._nodeEventContainer.append(nodeEvt);
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
         * @method _getFreeSlot
         * @description Get the first available slot if this event overlaps
         * @private
         */
        _getFreeSlot : function(e, leftedge) {
            Y.log("_getFreeSlot: " + e.summary, "info", "Y.DP.Timeline");
            
            var slots = this.get('slots');
            
            if (Lang.isNumber(e.slot)) {
                return e.slot;
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
  
        // ATTR change hooks
        
        /**
         * @method afterDateChange
         * @description Handle date change, update UI
         * @private
         */
        afterDateChange : function() {
            Y.log("afterDateChange", "info", "Y.DP.Timeline");
          
        },
        
        _uiSetEvents : function() {
            Y.log("_uiSetEvents", "info", "Y.DP.Timeline");
            
            this._renderEvents();
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
            //Y.log("dateToOffset", "info", "Y.DP.Timeline");
            
            var dayInMilliseconds = 1000*60*60*24,
                timeDiff = d.getTime() - this.get('date').getTime(),
                timeDiffDays = Math.floor(timeDiff/dayInMilliseconds);
            
            return timeDiffDays * this.get('dayWidth');
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
         * @method rangeToDuration
         * @description Convert a range (2 dates) into a duration. Negative durations are possible
         * @param start {Date} Starting date
         * @param finish {Date} Finishing date
         * @return Number Duration in days, may be negative
         * @private
         */
        rangeToDuration : function(start, finish) {
            //Y.log("rangeToDuration", "info", "Y.DP.Timeline");

            // Adding a day to the duration because when we say start now finish now, we mean one day of duration
            // Because that is the minimum duration on the timeline
            var dayInMilliseconds = 1000*60*60*24,
                timeDiff = finish.getTime() - start.getTime(),
                timeDiffDays = Math.ceil(timeDiff/dayInMilliseconds) + 1;
                
            return timeDiffDays;
        },
        
        /**
         * @method clearDateTime
         * @description Clear the time from a date
         * @param d {Date} Date to set time back to 00:00
         * @return Date date with time cleared
         * @public
         */
        clearDateTime : function(d) {
            Y.log("clearDateTime", "info", "Y.DP.Timeline");
            
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            
            return d;
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
             * @attribute tplEvent
             * @description Template to use for rendering events
             * @type String
             */
            tplEvent : {
                value : '<div class="{outerClassName}"><div class="{className}"><span class="{titleClassName}">{title}</span></div></div>'
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
                value : Date()
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
            },
            
            /**
             * @description Array of events to be rendered
             * @attribute events
             * @type Array
             */
            events : {
                value : Array(),
                setter : function(value) {
                    
                    // Normalise dates supplied
                    Y.Array.each(value, function(v) {
                        if (Lang.isString(v.start)) {
                            v.start = DataType.Date.parse(v.start);
                            //Y.log(v.start , "info", "Y.DP.Timeline");
                        }
                        
                        if (Lang.isString(v.finish)) {
                            v.finish = DataType.Date.parse(v.finish);
                            //Y.log(v.finish, "info", "Y.DP.Timeline");
                        }
                    }, this);               
                }
            }
        },

        HTML_PARSER : {

        }
    });
            
//}, '@VERSION@' ,{requires:['base']});