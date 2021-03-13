(function($) {
	
	//Cache jQuery Selector
	var $window		= $(window),
		$header		= $('#header'),
		$dropdown  	= $('.dropdown-toggle');
	
	
	// 1. Preloader For Hide loader
	function handlePreloader() {
		if($('.preloader').length){
			$('.preloader').delay(500).fadeOut(500);
			$('body').removeClass('page-load');
		}
	}
	
	// 18. When document is loading, do	
	$window.on('load', function() {
		handlePreloader();
	});
	
	
	//Scroll top by clicking arrow up
	$window.scroll(function () {
		if ($(this).scrollTop() > 500) {
			$('#scroll').fadeIn();
		}
		else {
			$('#scroll').fadeOut();
		}
	});
	$('#scroll').click(function () {
		$("html, body").animate({
			scrollTop: 0
		}, 1000);
		return !1;
	});
	
	
	//bootstrap selectpiker
	$(function(){
    $('.selectpicker').selectpicker();
	});
	
	
	//Update Header Style + Scroll to Top
	function headerStyle() {
		if($header.length){
			var windowpos = $window.scrollTop();
			if (windowpos >= 100) {
				$header.addClass('fixed-top');
			} else {
				$header.removeClass('fixed-top');
			}
		}
	}
	
	
	
	//dropdown submenu on hover in desktopand dropdown sub menu on click in mobile	
	$('#navbarSupportedContent').each(function() {
		$dropdown.on('click', function(e){
			if($window.width() < 1100){
				if($(this).parent('.dropdown').hasClass('visible')){
				//	$(this).parent('.dropdown').children('.dropdown-menu').first().stop(true, true).slideUp(300);
				//	$(this).parent('.dropdown').removeClass('visible');
					window.location = $(this).attr('href');
				}
				else{
					e.preventDefault();
					$(this).parent('.dropdown').siblings('.dropdown').children('.dropdown-menu').slideUp(300);
					$(this).parent('.dropdown').siblings('.dropdown').removeClass('visible');
					$(this).parent('.dropdown').children('.dropdown-menu').slideDown(300);
					$(this).parent('.dropdown').addClass('visible');
				}
				e.stopPropagation();
			}
		});
		
		$('body').on('click', function(e){
			$dropdown.parent('.dropdown').removeClass('visible');
		});
		
		$window.on('resize', function(){
			if($window.width() > 991){
				$('.dropdown-menu').removeAttr('style');
				$('.dropdown ').removeClass('visible');
			}
		});
		
	});

    // Auto active class adding with navigation
    $window.on('load', function () {
        var current = location.pathname;
        var $path = current.substring(current.lastIndexOf('/') + 1);
        $('.navbar-nav a').each(function (e) {
            var $this = $(this);
            // if the current path is like this link, make it active
            if ($path == $this.attr('href')) {
                $this.addClass('active');
            } else if ($path == '') {
                $('.navbar-nav li:first-child > a').addClass('active');
            }
        })
    })
	
	// Layer Slider Settings
	$('#slider').layerSlider({
		sliderVersion: '6.0.0',
		type: 'fullwidth',
		responsiveUnder: 0,
		maxRatio: 1,
		slideBGSize: 'auto',
		hideUnder: 0,
		hideOver: 100000,
		skin: 'outline',
		fitScreenWidth: true,
		fullSizeMode: 'fitheight',
		thumbnailNavigation: 'disabled',
		height: 740,
		skinsPath: 'skins/'
	});
	
	//owl_carousel_1 index_1 page Featured Section
	$('.owl_carousel_1').owlCarousel({
	 loop: true,
	 autoplay: false,
	 autoplayTimeout: 1700,
	 margin: 30,
	 nav: true,
	 dots: false,
	 navText: ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
	responsive:{
			0:{
				items:1
			},
			768:{
				items:2
			},
			992:{
				items:3
			}
		}
	 });
	
	//owl_carousel_2 index_1 page Team Section
	$('.owl_carousel_2').owlCarousel({
	 loop: true,
	 autoplay: false,
	 margin: 30,
	 nav: true,
	 dots: false,
	 navText: ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
	responsive:{
		0:{
			items:1
		},
		500:{
			items:2
		},
		768:{
			items:3
		},
		1200:{
			items:4
		}
	}
	 });
	
	//owl_carousel_3 index_1 page feedback section
	$('.owl_carousel_3').owlCarousel({
	 loop: true,
	 autoplay: true,
	 autoplayTimeout: 1500,
	 nav: false,
	 dots: true,
	 navText: ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
	responsive:{
		0:{
			items:1
		},
		500:{
			items:1
		},
		768:{
			items:1
		},
		1200:{
			items:1
		}
	}
	 });
	
	//owl_carousel_4 index_2 page feedback section
	$('.owl_carousel_4').owlCarousel({
	 loop: true,
	 autoplay: true,
	margin: 30,
	 autoplayTimeout: 1500,
	 nav: true,
	 dots: true,
	 navText: ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
	responsive:{
		0:{
			items:1
		},
		768:{
			items:2
		}
	}
	 });
	//owl_carousel_5 property_list page sidebar Team Section
	$('.owl_carousel_5').owlCarousel({
	 loop: true,
	 autoplay: false,
	 margin: 30,
	 nav: true,
	 dots: false,
	 navText: ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
	responsive:{
		0:{
			items:1
		},
		550:{
			items:2
		},
		992:{
			items:1
		}
	}
	 });
	//owl_carousel_6 single_property page sidebar Team Section
	$('.owl_carousel_6').owlCarousel({
	 loop: true,
	 autoplay: false,
	 margin: 30,
	 nav: true,
	 dots: false,
	 navText: ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
	responsive:{
		0:{
			items:1
		},
		768:{
			items:2
		},
		992:{
			items:1
		}
	}
	 });
	
	
	//Fact Counter For Achivement Counting
	function factCounter() {
		if($('.fact-counter').length){
			$('.fact-counter .achievement.animated').each(function() {
				var $t = $(this),
					n = $t.find(".counting").attr("data-stop"),
					r = parseInt($t.find(".counting").attr("data-speed"), 10);
					
				if (!$t.hasClass("counted")) {
					$t.addClass("counted");
					$({
						countNum: $t.find(".count-text").text()
					}).animate({
						countNum: n
					}, {
						duration: r,
						easing: "linear",
						step: function() {
							$t.find(".counting").text(Math.floor(this.countNum));
						},
						complete: function() {
							$t.find(".counting").text(this.countNum);
						}
					});
				}
				//set skill building height
					var size = $(this).children('.progress-bar').attr('aria-valuenow');
					$(this).children('.progress-bar').css('width', size+'%');
			});
		}
	}
	
	
	
	
	// 24. Elements Animation
	if($('.wow').length){
		var wow = new WOW(
		  {
			boxClass:     'wow',      // animated element css class (default is wow)
			animateClass: 'animated', // animation css class (default is animated)
			offset:       0,          // distance to the element when triggering the animation (default is 0)
			mobile:       false,       // trigger animations on mobile devices (default is true)
			live:         true       // act on asynchronously loaded content (default is true)
		  }
		);
		wow.init();
	}
	
	
	
	
	
	//Full Screen Map Height
	$window.on('resize', function(){
		setMapHeight();
	});
	
	function setMapHeight(){
		var $body = $('body');
		if($body.hasClass('full-page-map')) {
			$('#map').height($window.height() - $('header').height());
		}
	}
	
	setMapHeight();
	//Slide Up Advance Search Form On Map
	$('.form-up-btn').each(function(){
		$(this).on('click',function(e){
			if($('#find-location').is(".open"))
			{
				$('#find-location').removeClass("open");
				setTimeout(function(){$('#map-banner').removeClass("visible")},0);
			}
			else
			{
				$('#find-location').addClass("open");
				setTimeout(function(){
					$('#map-banner').addClass("visible")
				},400);
			}
		e.preventDefault();
		});
	});
	
	
	
	
	
	//Gallery With Filters List
	if($('.filter-list').length){
		$('.filter-list').mixItUp({});
	}
	
	
	
	
	// 29. Pricing bar Filter like index 7
	
	
	
	
	
	
	
	// 33. Star Rating Creator
	
	function ratingEnable() {

        $('#example-reversed, .select_option').barrating('show', {
            theme: 'bars-reversed',
            showSelectedRating: true,
        });
		
		$('.select_option').barrating('show', {
            theme: 'bars-reversed',
            showSelectedRating: true,
			showValues: true,
        });
    }

    function ratingDisable() {
        $('select').barrating('destroy');
    }

    ratingEnable();
	
	
	
	
	
	// 34. Use for Accordion Box
	if($('.according_area').length){
		$('.according_title').on('click', function() {
			if($(this).hasClass('active')){
				$(this).addClass('active');			
			}
			else{
				$('.according_title').removeClass('active');
				$('.according_details').slideUp(300);
				$(this).addClass('active');
				$(this).next('.according_details').slideDown(300);	
			}
		});	
	}
	
	// 35. When document is Scrollig, do
	$window.on('scroll', function() {
		headerStyle();
		factCounter();
	});
	
	// 36. Put slider space for nav not in mini screen
	if(document.querySelector('.nav-on-top') !== null) {
		var get_height = jQuery('.nav-on-top').height();
		if(get_height > 0 && $window.width() > 991){
			jQuery('.nav-on-top').next().css('margin-top', get_height);
		}
		$window.on('resize', function(){
			if($window.width() < 991){
				jQuery('.nav-on-top').next().css('margin-top', '0');
			}
			else {
				jQuery('.nav-on-top').next().css('margin-top', get_height);
			}
		});
	 }
	 if(document.querySelector('.nav-on-banner') !== null) {
		var get_height = jQuery('.nav-on-banner').height();
		if(get_height > 0 && $window.width() > 991){
			jQuery('.page-banner').css('padding-top', get_height);
		}
		$window.on('resize', function(){
			if($window.width() < 991){
				jQuery('.page-banner').css('padding-top', '0');
			}
			else {
				jQuery('.page-banner').css('padding-top', get_height);
			}
		});
	}

})(window.jQuery);