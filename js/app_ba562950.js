// var windowHeight = $(window).height();

$(function(){
	$('#js-form-cart').igwCart();
	$('.js-form-cart-add').igwCartItemAdd();
	$('.cart-top .result-each-item').find('.delete').igwCartItemDelete();
	//$('[data-tooltip="tooltip"]').tooltip({container: 'body'});

	// filter search
	$('.filter-search-select').change(function () {
		var search_val = $(this).val();
		$('#filter-addon label').text(search_val);
	});

	//Member tabs
    $(window).on('hashchange', function() {
        $('.nav-tabs a[href=' + location.hash + ']', $('.user-profile-manage')).tab('show')
    });
    
   $('.item-post a[href*="#"]:not([href="#"])').click(function() {
     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
       var target = $(this.hash);
       target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
       if (target.length) {
         $('html, body').animate({
           scrollTop: target.offset().top
         }, 500);
         return false;
       }
     }
   });

});

$('.widget-sidebar .widget-box-head .title').each(function() {
	if($(this).text() == '') {
		$(this).parent().remove();
	}
});

// Back to top
if ($('.back-to-top').length) {
	var scrollTrigger = 800,
	backToTop = function () {
		var scrollTop = $(window).scrollTop();
		if (scrollTop > scrollTrigger) {
			$('.back-to-top').addClass('show');
		} else {
			$('.back-to-top').removeClass('show');
		}
	};
	backToTop();
	$(window).on('scroll', function () {
		backToTop();
	});
	$('.back-to-top').on('click', function (e) {
		e.preventDefault();
		$('html,body').animate({
			scrollTop: 0
		}, 700);
	});
}

$('.photo-slide').each(function() {
	var $thumbItem = $(this).attr('data-thumbItem');
	$(this).lightSlider({
		gallery: true,
		item: 1,
		loop: true,
		slideMargin: 0,
		thumbItem: $thumbItem,
		thumbMargin: 10,
		adaptiveHeight: true
	});
});

// module reviews
// function ModuleReviewSlide(position, itemCount, itemResponsive = 1) {
// 	$(position + ' .module-reviews-slide').lightSlider({
// 		item: itemCount,
// 		loop: false,
// 		slideMove: 2,
// 		controls: false,
// 		easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
// 		speed: 600,
// 		responsive: [
// 			{
// 				breakpoint: 800,
// 				settings: {
// 					item: itemResponsive,
// 					slideMove: 1,
// 					slideMargin: 6,
// 				}
// 			},
// 			{
// 				breakpoint: 480,
// 				settings: {
// 					item: 1,
// 					slideMove: 1               
// 				}
// 			}
// 		]
// 	})
// }
// ModuleReviewSlide('.sidebar', 1);
// ModuleReviewSlide('.main-content-2', 3, 2);

$('.item-product-photo .slider-main').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	fade: true,
	asNavFor: '.slider-thumbnail'
});
$('.item-product-photo .slider-thumbnail').slick({
	slidesToShow: 4,
	slidesToScroll: 1,
	asNavFor: '.slider-main',
	focusOnSelect: true
});

$(function () {
	$("#amphur_id").chained("#province_id");
	$("#district_id").chained("#amphur_id");
	$("#postcode").chained("#amphur_id");
});

// Toggle Menu Widget
$('.toggle-menu').click(function(e) {
	$('.category-dept-0 a').removeClass('active');
	var checkElement = $(this).parent().next();
	if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
		checkElement.slideUp(500);
		return false;
	}
	if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
		//$('.category-dept-0 ul:visible').not(checkElement.parentsUntil('.category-dept-0')).slideUp(200);
		$(this).parent().addClass('active');
		checkElement.slideDown(500);
		return false;
	}
	e.preventDefault();
});

$('.dropdown-menu.profiles-tab').on('click','a',function(e){
	window.location = $(this).attr('href');
	location.reload();
});

$('.hero-banner .site-cover-bg').slick({
	fade: true,
	dots: true,
	speed: 1000,
	arrows: true,
	infinite: true,
	autoplay: true,
	autoplaySpeed: ($('div[data-slick-index="0"]').data("duration") * 1000)
});
console.log('Slick initialized for .hero-banner .site-cover-bg');
console.log('Duration from data-slick-index="0":', $('div[data-slick-index="0"]').data("duration"));
console.log('Initial autoplaySpeed:', $('div[data-slick-index="0"]').data("duration") * 1000);

$('.hero-banner .site-cover-bg').on("beforeChange", function (){
	if($('.header-video').length)
	{
		$('.header-video').stop();
		$('.header-video').currentTime = 0;
		$('.header-video').load();
	}
});

$('.hero-banner .site-cover-bg').on('afterChange', function(event, slick, currentSlide) {
	var slideTime = $('div[data-slick-index="'+ slick.currentSlide + '"]').data("duration") * 1000;
	console.log('afterChange - Current slide:', slick.currentSlide, 'Duration:', $('div[data-slick-index="'+ slick.currentSlide + '"]').data("duration"), 'autoplaySpeed:', slideTime);
	$('.hero-banner .site-cover-bg').slick("setOption", "autoplaySpeed", slideTime);
});

// menu collapse open
$('#menu-collapse').on('show.bs.collapse', function() {
	$('body').addClass('navbar-collapse-open');
}).on('hide.bs.collapse', function() {
	$('body').removeClass('navbar-collapse-open');
});

// navbar fix
function headerFix() {
	// if($('.navbar-main').length){
	// 	var windowpos = $(window).scrollTop();
	// 	if (windowpos >= 200) {
	// 		$('.navbar-main').addClass('affix');
	// 	} else {
	// 		$('.navbar-main').removeClass('affix');
	// 	}
	// }
	var windowPos = $(window).scrollTop();
	var	mainContentOffset = $('.main-content').offset().top;
	var	distance = (mainContentOffset - windowPos);
	if (distance < 0) {
		$('.navbar-main').addClass('affix');
	} else {
		$('.navbar-main').removeClass('affix');
	}
}
headerFix();
$(window).on('scroll', function() {
	headerFix();
});

// tinyMCE
if(typeof jQuery.fn.tinymce != 'undefined')
{
	$(function () {
		tinymce.init({
			selector: '.textarea',
			setup : function(ed) {
				ed.on('init', function()
				{
					$(ed.getBody()).on('blur', function(e) {
						tinyMCE.triggerSave();
						$('textarea').trigger('change');
					});
				});
			},
			theme: 'modern',
			menubar:false,
			theme_advanced_toolbar_location : "top",
			theme_advanced_buttons1 : "bold,italic,underline",
			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : ""
		});
	});
}

$(document).ready(function(){
	$('body').on('click','.btn-cart-cancel',function(e){
		$('.btn-cart').removeAttr("disabled");
		$('.btn-cart').html('<i class="fa fa-shopping-cart"></i>&nbsp;<span class="btn-text">'+i18n_add_to_cart+'</span>');
	});
	
	$('.chat-block .btn').click(function(e) {
		var role_attr = $(this).attr('role');
		if(role_attr == 'button')
		{
			$(this).removeAttr('data-toggle');
			$(this).removeAttr('href');
			if($("#advice").hasClass("collapse") == true)
			{
				$('#advice').removeClass('collapse');
			}
			else
			{
				$('#advice').addClass('collapse');
			}
			e.preventDefault();
		}
	});
});