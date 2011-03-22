YUI.add('gallery-dp-timeline', function(Y) {

//YUI.add('dp-timeline', function(Y) {
	
        
    var Lang = Y.Lang,
        Node = Y.Node,
        DataType = Y.DataType;


    Y.namespace('DP').Timeline = Y.Base.create( 'gallery-dp-timeline', Y.Widget, [], {
        
        initializer: function() {
            Y.log("init", "info", "Y.DP.Timeline");
        
        },

        destructor : function() {

        },

        renderUI : function() {
            this._renderHeadings();
            this._renderHeadingsDays();
            
            this._renderBackgroundContainer();
            
            this._renderEventContainer();
            this._renderEvents();
            
            this.get('contentBox').append(this._nodeDayContainer);
            this.get('contentBox').append(this._nodeEventContainer);
        },

        bindUI : function() {

        },

        syncUI : function() {
            var events = this.get('events');
            console.dir(events);
            Y.log(this.get('events'), "info", "Y.DP.Timeline");
        },
        
        /**
         * @method _renderHeadings
         * @description Render the containers for the headings
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
         * @method _renderHeadingsDays
         * @description Render all of the day labels
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
                }));
                
                lblDay.set('style.left', this.dateToOffset(labelDate) + 'px');
                lblDay.set('style.width', this.get('dayWidth') + 'px');

                this._nodeDayContainer.append(lblDay);               
            }
            
        },
        
        /**
         * @method _renderEventContainer
         * @description Render the container that will hold events
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

            var startingDate = this.get('date');
            this.clearDateTime(startingDate);
            
            Y.Array.each(this.get('events'), function (e) {
                if (e.start < startingDate) {
                    
                } else {
                    this._renderEvent(e);
                }
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
                className : this.getClassName('event'),
                titleClassName : this.getClassName('event', 'title'),
                title : e.summary
                })),
                duration = this.rangeToDuration(e.start, e.finish);
            
            nodeEvt.set('style.left', this.dateToOffset(e.start) + 'px');
            nodeEvt.set('style.top', (e.overlap * this.get('eventHeight')) + 'px');
            nodeEvt.set('style.width', (this.get('dayWidth') * duration) + 'px');
            
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
            
            this.get('contentBox').append(nodeBg);
        },
        
        /**
         * @method _renderBackgroundHighlights
         * @description Render highlight objects on the background which indicate holidays.
         * @private
         */
        _renderBackgroundHighlights : function() {
            Y.log("_renderBackgroundHighlights", "info", "Y.DP.Timeline");
            
            
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
         * @method rangeToDuration
         * @description Convert a range (2 dates) into a duration. Negative durations are possible
         * @param start {Date} Starting date
         * @param finish {Date} Finishing date
         * @return Number Duration in days, may be negative
         * @private
         */
        rangeToDuration : function(start, finish) {
            Y.log("rangeToDuration", "info", "Y.DP.Timeline");

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
         * @method _calculateOverlaps
         * @description Calculate date ranges with overlaps and assign them an index which then determines how those events get stacked on the y-axis
         * @param e {Object} Object literal of a single event to calculate for overlaps
         * @param events {Array} Array of object literals for every event
         * @private
         */
        _calculateOverlaps : function(e, events) {
            Y.log("_calculateOverlaps:" + e.summary, "info", "Y.DP.Timeline");
            
            var freeslots = Array();
  
                Y.Array.each(events, function(ev) {
                    if (e !== ev) {  
                        if ( (e.start >= ev.finish || e.finish <= ev.start) ) {
                           Y.log("_calculateOverlaps:" + e.summary + " does not overlap " + ev.summary, "info", "Y.DP.Timeline");
                           

                           //
                           //
                           //
                           //ev.overlap = overlapcount;
                           //overlapcount++;
                        } else {
                            Y.log("_calculateOverlaps:" + e.summary + " overlaps " + ev.summary, "info", "Y.DP.Timeline");
                        }
                    }
                }, this);
        },
        
        /*
               _calculateOverlaps : function(e, events) {
            Y.log("_calculateOverlaps:" + e.summary, "info", "Y.DP.Timeline");
            
            var overlapcount = 0;
            
            // Already part of a calculation
            
            if (e.overlap !== undefined) {
                return null;
            } else {
                e.overlap = overlapcount;
                overlapcount++;
            }
            
            Y.Array.each(events, function(ev) {
                if (e.start > ev.start || e.finish < ev.finish) {
                   //ev.overlap = overlapcount;
                   //overlapcount++;
                   ev.overlap = e.overlap + 1;
                }
            }, this);
            
            return null;
        },*/
        
        /**
         * @property _nodeDays
         * @description Array containing nodes for each of the day labels
         * @private
         */
        _nodeDays : Array()

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
                value : '<div class="{className}"><span class="{titleClassName}">{title}</span></div>'
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
             * @attribute dayWidth
             * @description Width of each day label
             * @type Number
             */
            dayWidth : {
                value : 100
            },
            
            /**
             * @attribute eventHeight
             * @description Height of each event
             * @type Number
             */
            eventHeight : {
                value : 20
            },
            
            /**
             * @attribute date
             * @description Starting date of the timeline
             * @type Date
             */
            date : {
                value : Date()
            },
            
            /**
             * @attribute length
             * @description length of the timeline in days
             * @type Number
             */
            length : {
                value : 8
            },
            
            /**
             * @attribute events
             * @description Array of events to be rendered
             * @type Array
             */
            events : {
                value : Array(),
                setter : function(value) {
                    
                    var idx = 0;
                    
                    // Normalise dates supplied
                    Y.Array.each(value, function(v) {
                        if (Lang.isString(v.start)) {
                            v.start = DataType.Date.parse(v.start);
                            Y.log(v.start , "info", "Y.DP.Timeline");
                        }
                        
                        if (Lang.isString(v.finish)) {
                            v.finish = DataType.Date.parse(v.finish);
                            Y.log(v.finish, "info", "Y.DP.Timeline");
                        }
                        
                        v.overlap = idx;
                        idx++;
                    }, this);
                    
                    
                    Y.Array.each(value, function(v) {
                        this._calculateOverlaps(v, value);
                    }, this);                    
                    
                }
            }
        },

        HTML_PARSER : {

        }
    });
            
//}, '@VERSION@' ,{requires:['base']});


}, '@VERSION@' ,{requires:['base', 'widget', 'substitute', 'node', 'datatype']});
