/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "igwCartItemAdd",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);
        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            this.bindBehavior();
        },

        bindBehavior: function() {
            this.$element.on('submit', this.submit.bind(this));
        },

        submit: function (event) {
            event.preventDefault();

            var submitBtn = this.$element.find('button[type=submit]');
            submitBtn.attr('disabled', 'disabled');
            var btnTxt = submitBtn.html();
            //submitBtn.html('<i class="fa fa-refresh fa-spin"></i> <span class="btn-text">Please Wait</span>');
            submitBtn.html('<i class="fa fa-refresh fa-spin"></i>');

            var url = this.$element.attr('action');

            $.ajax({
                url: url,
                type: 'POST',
                data: this.$element.serialize(),
                dataType: 'json'
            })
            .done(this.done.bind(this))
            .fail(this.fail.bind(this));
        },

        done: function (json) {
            // Sweet Alert
            swal(
                {
                    title: "",
                    text: i18n_add_this_item_to_cart_success,
                    type: "success",
                    showCancelButton: true,
                    confirmButtonText: i18n_text_checkout,
                    cancelButtonText: i18n_text_continue_shopping,
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        document.location.href = '/cart';
                    }
                }
            );

            this.updateBadge(json);

            // Enable Submit Btn Again
            var submitBtn = this.$element.find('button[type=submit]');
            submitBtn.html('<i class="fa fa-shopping-cart"></i> <span class="btn-text">'+i18n_add_to_cart+'</span>');
            submitBtn.removeAttr('disabled');
        },

        fail: function (jqXHR) {
            var errMsg = jqXHR.responseJSON.errors[0].detail;
            swal("", 'Cannot add this item to cart. - ' + errMsg, "error");
            var submitBtn = this.$element.find('button[type=submit]');
            // if (errMsg == 'Product out of stock.') {
            //     submitBtn.html('Out of stock');
            // } else {
            //     submitBtn.html('<i class="fa fa-shopping-cart"></i> <span>Add to cart</span>');
            //     submitBtn.removeAttr('disabled');
            // }
            submitBtn.html('<i class="fa fa-shopping-cart"></i> <span class="btn-text">Add to cart</span>');
            submitBtn.removeAttr('disabled');
        },

        updateBadge: function (json) {
            // ===== Update Mini Cart at Frontend =====
            var rootElement = $('div.cart-top');
            var cartItems = json.data.items;
            // Update Badge Counter
            var countItems = cartItems.length;
            rootElement.find('span.count-badge').html(countItems);
            // Update div.actions
            var divActionNoItem  = rootElement.find('div.actions > div.action-no-item');
            var divActionHasItem = rootElement.find('div.actions > div.action-has-item');
            if (countItems == 0) {
                divActionHasItem.hide();
                divActionNoItem.show();
            } else {
                divActionHasItem.show();
                divActionNoItem.hide();
            }
            
            var path = window.location.href;
            var str = path.split("/");
			if (typeof str[3] !== 'undefined') {
				var lang = str[3];
			} else {
				var lang = 'th';	
			}
            
            // Update Items
            var divResults = rootElement.find('div.result div.result-each-item');
            divResults.html('');
            $.each(cartItems, function(index, item){

                divResults.append(
                    '<div class="item"><div class="thumbnail">' +
                        '<div class="row">'+
                            '<div class="col-xs-4 col-sm-4">'+
                                '<a href="/products/' + item.product_id + '" class="item-image">' +
                                    '<img src="' + item.thumbnail + '">' +
                                '</a>' +
                            '</div>'+
                            '<div class="col-xs-8 col-sm-8">' +
                                '<div class="caption">' +
                                    '<a class="title" href="/products/' + item.product_id + '">' +
                                        item.title +
                                    '</a>' +
                                    '<div class="item-price">' +
                                        '<div class="item-qty">'+
                                            '<span>' + item.quantity + '</span> x '+
                                            '<span class="item-qty-price">'+ item.price + ' '+ i18n_currency +'</span>'+
                                         '</div>'+
                                         '<div class="item-total">' +
                                            '<span>Total: </span>'+
                                            '<span class="item-total-price">' + item.total + ' '+ i18n_currency +'</span>'+
                                         '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'+
                        '<a data-itemid="' + item.id + '" href="/'+lang+'/cart/delete/item/' + item.id + '" class="delete">' +
                            '<i class="fa fa-times"></i>' +
                        '</a>' +
                    '</div></div>'
				);
            });
            // ===== Update Mini Cart at Frontend =====
            divResults.find('a.delete').igwCartItemDelete();
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
