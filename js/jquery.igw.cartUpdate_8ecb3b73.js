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
    var pluginName = "igwCartUpdate",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);

        this.$subtotal = $('#js-subtotal');
        this.$tax = $('#js-tax');
        this.$weight = $('#js-car-weight');
        this.$shipping = $('#js-shipping');
        this.$summarysubtotal = $('#js-summary-subtotal');
        this.$total = $('#js-total');

        this.$discount = $('#js-discount');
        this.$couponDiscount = $('#js-coupon-discount');
        this.$promotionDiscount = $('#js-promotion-discount');
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
            this.$element.on('submit', this.submit.bind(this));

            var textNote = this.$element.find('textarea[name=note]');
            textNote.on('change', this.submit.bind(this));
        },

        submit: function (event) {
            event.preventDefault();

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
            this.updateItems(json);
            this.displayShipping(json);
            this.updateSummary(json);
            this.updateBadge(json);
            this.updateCheckoutButton(json);
        },

        fail: function (jqXHR) {
            var json = jqXHR.responseJSON;
            alert(json.errors[0].detail);
        },

        displayShipping: function(json) {
            let data = json.data;
            let meta = json.meta;
            let label = json.label_shipping_method;
            let html = '';

            if (data.shipping_type == 'service') {
                html = '<td class="shipping"><strong>'+label+'</strong></td>'+'<td class="text-right"><span id="js-shipping">'+
                numeral(meta.shipping).format('0,0.00')+'</span></td>';

                $("#tr-js-shipping").removeAttr('style');
            } else {
                $("#tr-js-shipping").attr('style', 'display: none;');
            }

            $("#tr-js-shipping").html(html);
        },

        updateItems: function (json) {
            var items = json.data.items.data;
            var i = 0;
            var length = items.length;

            for (i; i < length; i++) {
                var unitPriceContainer = $('#js-item-unit-price-' + items[i].id);
                var totalPriceAreaContainer = $('#js-item-total-' + items[i].id);

                if (items[i].is_wholesale == 1) {
                    //Catch up whole sale price
                    unitPriceContainer.html([
                        '<strike>' + numeral(items[i].price_real).format('0,0.00') + '</strike><br />',
                        '<span class="text-danger">' + numeral(items[i].price).format('0,0.00') + '</span>'
                    ] . join(''));

                    totalPriceAreaContainer.html([
                        '<strike>' + numeral(items[i].total_real).format('0,0.00') + '</strike><br />',
                        '<span class="text-danger">' + numeral(items[i].total).format('0,0.00') + '</span>'
                    ] . join(''));

                } else {
                    //Normal price
                    totalPriceAreaContainer.html(numeral(items[i].total).format('0,0.00'));
                    unitPriceContainer.html(numeral(items[i].price).format('0,0.00'));
                }

                //Show / hide checkoutable notification
                var checkoutableNotification = $('.checkoutable-notification-' + items[i].product_id);
                if (items[i].can_checkout) {
                    checkoutableNotification.addClass('hide');
                } else {
                    checkoutableNotification.removeClass('hide').html(items[i].can_checkout_error);
                }
            }
        },

        updateSummary: function (json) {
            this.$subtotal.html(numeral(json.meta.subtotal).format('0,0.00'));
            this.$tax.html(numeral(json.meta.tax).format('0,0.00'));
            this.$weight.html(numeral(json.meta.totalWeight).format('0,0.00'));
            this.$shipping.html(numeral(json.meta.shipping).format('0,0.00'));
            this.$total.html(numeral(json.meta.total).format('0,0.00'));

			// var subTotal = parseFloat(json.meta.subtotal) - parseFloat(json.meta.tax);
            // var subTotal = parseFloat(json.meta.subtotalDiscount) - parseFloat(json.meta.tax);
            var subTotal = json.meta.total - json.meta.shipping;

            if (json.meta.tax > 0) {
                this.$summarysubtotal.html(numeral(subTotal).format('0,0.00'));
                $('#js-summary-subtotal-xxx').html(numeral(json.meta.subtotalDiscount).format('0,0.00'));
            } else {
                this.$summarysubtotal.html(numeral(subTotal).format('0,0.00'));
            }

            if (json.meta.UseCoupon) {
                $("#tr-js-coupon-discount").show();
                this.$couponDiscount.html(/*'- ' + */numeral(json.meta.couponDiscount).format('0,0.00'));
            } else {
                $("#tr-js-coupon-discount").hide();
            }

            if (json.meta.webDiscount > 0) {
                $("#tr-js-web-discount").show();
                this.$discount.html(/*'- ' + */numeral(json.meta.webDiscount).format('0,0.00'));
            } else {
                $("#tr-js-web-discount").hide();
            }

            if (json.meta.promotionDiscount > 0) {
                $("#tr-js-promotion-discount").show();
                this.$promotionDiscount.html(numeral(json.meta.promotionDiscount).format('0,0.00'));
            } else {
                $("#tr-js-promotion-discount").hide();
            }

            // this.$discount.html(/*'- ' + */numeral(json.meta.discount).format('0,0.00'));
            // this.$promotionDiscount.html(numeral(json.meta.promotionDiscount).format('0,0.00'));

            this.$subtotalDiscount.html(numeral(json.meta.subtotalDiscount).format('0,0.00'));
        },

        updateBadge: function (json) {
            // ===== Update Mini Cart at Frontend =====
            var rootElement = $('li.cart-top');
            var cartItems = json.data.items.data;
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
                                            '<span class="title">' + item.quantity + '</span> x '+
                                            '<span class="item-qty-price">'+ item.price + ' '+ i18n_currency +'</span>'+
                                         '</div>'+
                                         '<div class="item-total">' +
                                            '<span class="title">Total: </span>'+
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
