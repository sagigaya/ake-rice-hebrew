/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "igwCartShipping",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend( {}, defaults, options) ;

        this.$form = this.options.form;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this.bindBehavior();
        },

        bindBehavior: function() {
            this.$element.on('change', this.change.bind(this));
        },

        change: function (event) {
            this.$form.trigger('submit');
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
