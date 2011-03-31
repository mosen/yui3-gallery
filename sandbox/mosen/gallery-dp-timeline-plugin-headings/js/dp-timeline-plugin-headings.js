/**
 *
 *
 * @module gallery-dp-timeline-plugin-headings
 * @requires gallery-dp-timeline
 */

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang,
    Node = Y.Node,
    DataType = Y.DataType;

/**
 * Headings plugin for DP.Timeline provides headings which show dates at fixed intervals
 *
 * @class DP.TimelineHeadings
 * @extends Plugin
 */
Y.namespace('DP').TimelineHeadings = Y.Base.create( 'gallery-dp-timeline-plugin-headings', Y.Plugin.Base, [], {

    /**
     * Init
     *
     * @method initializer
     * @param config {Object} Configuration object
     * @protected
     * @constructor
     */
    initializer : function (config) {

        // this.afterHostEvent('render', this.onHostRenderEvent);
        this.beforeHostMethod('render', this.onHostRender);
    },

    /**
     * Render headings into host container.
     * 
     * @method onHostRender
     * @private
     */
    onHostRender : function() {
        Y.log("onHostRender", "info", "Y.DP.TimelineHeadings");
        
        this._nodeDayContainer = this._renderHeadings();
        this._renderHeadingsDays(this._nodeDayContainer);
        
        this.get('host').get('contentBox').insert(this._nodeDayContainer);
    },

    /**
     * Destructor lifecycle implementation for the dp-timeline-plugin-headings class.
     *
     * @method destructor
     * @protected
     */
    destructor: function() { },
    
    
    // Use NetBeans Code template "ymethod" to add methods here


    /**
     * Render the containers for the headings
     *
     * @method _renderHeadings
     * @return Y.Node Heading Container
     * @private
     */
    _renderHeadings : function() {
        //Y.log("_renderHeadings", "info", "Y.DP.Timeline");

        var nodeDayContainer = Node.create(Y.substitute(this.get('tplDayContainer'), {
           className : this.get('host').getClassName('day', 'container')
        }));

        return nodeDayContainer;
    },
    
    
    /**
     * Render all of the day labels
     *
     * @method _renderHeadingsDays
     * @param parent {Node} Parent to render into
     * @private
     */
    _renderHeadingsDays : function(parent) {
        //Y.log("_renderHeadingsDays", "info", "Y.DP.Timeline");

        var host = this.get('host'),
            datesShown = host._dates;

        Y.Array.each(datesShown, function(d) {
            
            var lblDay = Node.create(Y.substitute(this.get('tplDay'), {
                className : host.getClassName('day'),
                labelClassName : host.getClassName('day', 'label'),
                label : DataType.Date.format(d.date, {format:"%a %e"})
            }));

            lblDay.set('style.left', d.left + 'px');
            lblDay.set('style.width', host.get('dayWidth') + 'px');

            parent.append(lblDay);
        }, this);
    }
    
    /*
    _renderHeadingsDays : function(parent) {
        //Y.log("_renderHeadingsDays", "info", "Y.DP.Timeline");

        var host = this.get('host'),
            currentDate = host.get('date'),
            labelDate,
            i;

        for (i = 0; i < host.get('length'); i++) {

            labelDate = new Date(currentDate.getTime());
            labelDate.setDate(labelDate.getDate() + i);

            var lblDay = Node.create(Y.substitute(this.get('tplDay'), {
                className : host.getClassName('day'),
                labelClassName : host.getClassName('day', 'label'),
                label : DataType.Date.format(labelDate, {format:"%a %e"})
            })),
                leftOffset = host.dateToOffset(labelDate);

            lblDay.set('style.left', leftOffset + 'px');
            lblDay.set('style.width', this.get('dayWidth') + 'px');

            parent.append(lblDay);

            this._dates.push({ 
                date: labelDate, 
                left: leftOffset, 
                mid: leftOffset + Math.ceil(this.get('dayWidth') / 2) 
            });
        }
    }*/

}, {

    /**
     * The plugin namespace
     * 
     * @property Dp-timeline-plugin-headings.NS
     * @type String
     * @protected
     * @static
     */
    NS : "headings",


    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Dp-timeline-plugin-headings.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : {
        
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
        }
       // Use NetBeans Code Template "yattr" to add attributes here
    }
        

});

