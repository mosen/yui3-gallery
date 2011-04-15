YUI.add('gallery-ebisu-dualslider', function(Y) {

/**
 *
 *
 * @module gallery-ebisu-dualslider
 * @requires Base, Slider
 */

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang,
    NODE = 'node',
    MIN       = 'min',
    MAX       = 'max',
    VALUE     = 'value',

    round = Math.round;

/**
 * Extends Slider to provide a second thumb which cannot cross-over the first thumb.
 *
 * @class Ebisu.DualSlider
 * @extends Slider
 */
Y.namespace('Ebisu').DualSlider = Y.Base.create( 'ebisu-dualslider', Y.Slider, [], {


    /**
     * Lifecycle : Create the DOM structure for the ebisu-dualslider.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        
        var contentBox = this.get( 'contentBox' );

        /**
         * The Node instance of the Slider's rail element.  Do not write to
         * this property.
         *
         * @property rail
         * @type {Node}
         */
        this.rail = this.renderRail();

        this._uiSetRailLength( this.get( 'length' ) );

        /**
         * The Node instance of the Slider's thumb element.  Do not write to
         * this property.
         *
         * @property thumbs
         * @type {Node}
         */
        this.thumbs = this.renderThumbs();

        this.rail.appendChild( this.thumbs[0] );
        this.rail.appendChild( this.thumbs[1] );
        // @TODO: insert( contentBox, 'replace' ) or setContent?
        contentBox.appendChild( this.rail );

        // <span class="yui3-slider-x">
        contentBox.addClass( this.getClassName( this.axis ) );
    },

    
    
    /**
     * Render markup for both thumbs.
     *
     * @method renderThumbs
     * @private
     */
    renderThumbs : function() {
        Y.log("renderThumbs", "info", "Ebisu.DualSlider");
        
        // Left Thumb
        this._initThumbUrl();

        var imageUrl = this.get( 'thumbUrl' ),
            leftThumb = Y.Node.create(
                Y.substitute( this.THUMB_TEMPLATE, {
                    thumbClass      : this.getClassName( 'thumb', 'l' ),
                    thumbShadowClass: this.getClassName( 'thumb', 'shadow' ),
                    thumbImageClass : this.getClassName( 'thumb', 'image' ),
                    thumbShadowUrl  : imageUrl,
                    thumbImageUrl   : imageUrl
                }) 
            ),
            rightThumb = Y.Node.create(
                Y.substitute( this.THUMB_TEMPLATE, {
                    thumbClass      : this.getClassName( 'thumb', 'r' ),
                    thumbShadowClass: this.getClassName( 'thumb', 'shadow' ),
                    thumbImageClass : this.getClassName( 'thumb', 'image' ),
                    thumbShadowUrl  : imageUrl,
                    thumbImageUrl   : imageUrl
                }) 
            );
            
        
        return [ leftThumb, rightThumb ]; 
        
    },
    
    /**
     * Makes the thumb draggable and constrains it to the rail.
     *
     * @method _bindThumbDD
     * @protected
     */
    _bindThumbDD: function () {
        var config = { constrain: this.rail };
        
        // { constrain: rail, stickX: true }
        config[ 'stick' + this.axis.toUpperCase() ] = true;

        /** 
         * The DD.Drag instance linked to the left thumb node.
         *
         * @property _dd
         * @type {DD.Drag}
         * @protected
         */
        this._dd = new Y.DD.Drag( {
            node   : this.thumbs[0],
            bubble : false,
            on     : {
                'drag:start': Y.bind( this._onDragStart, this )
            },
            after  : {
                'drag:drag': Y.bind( this._afterDrag,    this ),
                'drag:end' : Y.bind( this._afterDragEnd, this )
            }
        } );
        
        
        /** 
         * The DD.Drag instance linked to the right thumb node.
         *
         * @property _ddr
         * @type {DD.Drag}
         * @protected
         */
        this._ddr = new Y.DD.Drag( {
            node   : this.thumbs[1],
            bubble : false,
            on     : {
                'drag:start': Y.bind( this._onDragStart, this )
            },
            after  : {
                'drag:drag': Y.bind( this._afterDrag,    this ),
                'drag:end' : Y.bind( this._afterDragEnd, this )
            }
        } );
        

        // Constrain the thumb to the rail
        this._dd.plug( Y.Plugin.DDConstrained, config );
        this._ddr.plug( Y.Plugin.DDConstrained, config );
    },
    
    /**
     * Calculates and caches
     * (range between max and min) / (rail length)
     * for fast runtime calculation of position -&gt; value.
     *
     * @method _calculateFactor
     * @protected
     */
    _calculateFactor: function () {
        
        // TODO : should only require one calculation because both thumbs operate on the same factor?
        this._calculateFactorDual(this.thumbs[0]);
        this._calculateFactorDual(this.thumbs[1]);
       
    },
    
    /**
     * Calculates and caches value to rail offset
     *
     * @method _calculateFactorDual
     * @param {Node} Thumb node
     * @private
     */
    _calculateFactorDual : function(thumb) {
        Y.log("_calculateFactorDual", "info", "DualSlider");
        
        var length    = this.get( 'length' ),
            thumbSize = thumb.getStyle( this._key.dim ),
            min       = this.get( MIN ),
            max       = this.get( MAX );

        // The default thumb width is based on Sam skin's thumb dimension.
        // This attempts to allow for rendering off-DOM, then attaching
        // without the need to call syncUI().  It is still recommended
        // to call syncUI() in these cases though, just to be sure.
        length = parseFloat( length, 10 ) || 150;
        thumbSize = parseFloat( thumbSize, 10 ) || 15;

        this._factor = ( max - min ) / ( length - thumbSize );

        Y.log("Calculating factor(~" + this._factor.toFixed(3) + " = (max(" + max + ") - min(" + min + ")) / (length(" + length + ") - thumb size(" + thumbSize + "))","info","slider");
    }
    

}, {

    /**
     * Namespace
     *
     * @property NAME
     * @type String
     * @protected
     * @static
     */
    NAME : "dualSlider",

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
        
        // Use NetBeans Code Template "yattr" to add attributes here
    }
        

});


}, '@VERSION@' ,{requires:['base', 'dd', 'slider']});
