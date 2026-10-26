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
    var pluginName = "igwCartItemDelete",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);

        this.$subtotal = $('#js-subtotal');
        this.$tax = $('#js-tax');
        this.$shipping = $('#js-shipping');
        this.$summarysubtotal = $('#js-summary-subtotal');
        this.$total = $('#js-total');

        this.$discount = $('#js-discount');
        this.$subtotalDiscount = $('#js-subtotal-discount');

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
            // this.$element.on('submit', this.confirm.bind(this));
            this.$element.on('click', this.confirm.bind(this));
        },

        confirm: function (event) {
            event.preventDefault();

            swal(
                {
                    title: i18n_are_you_sure,
                    text: i18n_you_delete_this_item,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: i18n_text_alert_confirm,
                    cancelButtonText: i18n_text_alert_cancel,
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                this.submit.bind(this)
            );
        },

        submit: function () {
            // var url = this.$element.attr('action');
            var url = this.$element.attr('href');

            $.ajax({
                url: url,
                // type: 'POST',
                // data: this.$element.serialize(),
                dataType: 'json'
            })
            .done(this.done.bind(this))
            .fail(this.fail.bind(this));
        },

        done: function (json) {
            this.displayResponse();
            this.updateSummary(json);
            this.updateBadge(json);
            this.updateCart(json);
            this.updateCheckoutButton(json);
        },

        fail: function(jqxhr,textStatus,errorThrown) {
            swal("", "Can not delete item.", "error");
        },

        displayResponse: function() {
            swal({
                title: "",
                text: i18n_delete_this_item_from_cart_success,
                type: "success",
                timer: 3000,
                showConfirmButton: false
            });

            // this.$element.closest('tr').addClass('hide');
            // this.$element.closest('tr').remove();
            var itemId = this.$element.data('itemid');
            $('#js-form-cart').find('a[data-itemid=' + itemId + ']').first().closest('tr').remove();
        },

        updateSummary: function (json) {
            this.$subtotal.html(json.meta.subtotal);
            this.$tax.html(json.meta.tax);
            this.$shipping.html(json.meta.shipping);
            this.$total.html(json.meta.total);

			var subTotal = parseFloat(json.meta.subtotal) - parseFloat(json.meta.tax);

			this.$summarysubtotal.html(numeral(subTotal).format('0,0.00'));

            if (json.meta.UseCoupon) {
                $("#tr-js-discount").show();
            } else {
                $("#tr-js-discount").hide();
            }
            this.$discount.html('- ' + json.meta.discount);

            this.$subtotalDiscount.html(json.meta.subtotalDiscount);
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
                        '<a data-itemid="' + item.id + '" href="/'+lang+'/cart/delete/item/' + item.id + '" class="delete" rel="delete">' +
                            '<i class="fa fa-times"></i>' +
                        '</a>' +
                    '</div></div>'
                );
            });
            // ===== Update Mini Cart at Frontend =====
            divResults.find('a.delete').igwCartItemDelete();
        },

        updateCart: function (json) {
            if(json.data.items.data.length <= 0){
                $('.cart-product').hide();
                $('.wizard-container').hide();
                $('.choose-more-product').removeClass('hide');
            }

            $('.shopping-basket').html(
                '<i class="material-icons">shopping_basket</i>' + ' ' +
                i18n_you_have +' '+ json.data.items.data.length +' '+ i18n_items_in_your_cart
            );
        },
        updateCheckoutButton: function (json) {
            var confirmBtn = $('.btn-confirm-order');
            if (json.meta.can_checkout) {
                confirmBtn.removeClass('disabled');
                confirmBtn.removeAttr('disabled');
                confirmBtn.attr('data-toggle', 'modal');
            } else {
                confirmBtn.addClass('disabled');
                confirmBtn.attr('disabled', 'disabled');
                confirmBtn.removeAttr('data-toggle', 'modal');
            }

            var orderMinimumCheckoutAmountError = $('.order-minimum-checkout-amount-error');
            if (json.meta.order_can_checkout) {
                orderMinimumCheckoutAmountError.hide();
            } else {
                orderMinimumCheckoutAmountError.html(json.meta.order_can_checkout_error).show();
            }
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
