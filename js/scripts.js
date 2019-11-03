jQuery(function( $ ) {
	'use strict';
	var $window = $( window );
	var $body   = $( 'body' );

	/* Carregar menu */
	//console.log('Carregar menu');
	$("#menu-content").load("menu.html");

	/* -----------------------------------------
	Responsive Menus Init with mmenu
	----------------------------------------- */
	var $mainNav      = $( '.navigation-main' );
	var $mobileToggle = $( '.mobile-toggle' );

	/* -----------------------------------------
	Main Navigation Init
	----------------------------------------- */
	if ( $window.width() > 1023 ) {
		$mainNav.superfish({
			delay: 300,
			animation: { opacity: 'show', height: 'show' },
			speed: 'fast',
			dropShadows: false
		});
	}

	$mobileToggle.click( function( e ) {
		e.preventDefault();
		$body.toggleClass( 'mobile-toggled-active' );
	});

	/* -----------------------------------------
	Responsive Videos with fitVids
	----------------------------------------- */
	$( '.main' ).fitVids();

	/* -----------------------------------------
	Image Lightbox
	----------------------------------------- */
	$( ".ci-lightbox, a[data-lightbox^='gal']" ).magnificPopup({
		type: 'image',
		mainClass: 'mfp-with-zoom',
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true
		}
	} );

	$window.on( 'load', function() {
		var sidebarHeight = $('.layout-sidebar').outerHeight();
		var contentHeight = $('.layout-content').outerHeight();

		var $layout = $('.sidebar, .content-wrap');
		$layout.stick_in_parent({
			parent: '#page',
			spacer: sidebarHeight > contentHeight ? '.layout-content' : '.layout-sidebar'
		});

		/* -----------------------------------------
		FlexSlider Init
		----------------------------------------- */
		var $contentSlider = $('.ci-content-slider');
		var $slidePrev     = $('.slide-control-prev');
		var $slideNext     = $('.slide-control-next');
		var $contentShow   = $('.slide-control-show');
		var $contentHide   = $('.slide-control-hide');

		if ( $contentSlider.length ) {
			var animation      = $contentSlider.data( 'effect' );
			var slideshow      = $contentSlider.data( 'autoslide' );
			var slideshowSpeed = $contentSlider.data( 'slide-speed' );
			var	animationSpeed = 600;

			$contentSlider.flexslider({
				animation: animation,
				slideshow: slideshow,
				slideshowSpeed: slideshowSpeed,
				animationSpeed: animationSpeed,
				controlNav: false,
				directionNav: false,
				namespace: 'ci-',
				prevText: '',
				nextText: '',
				start: function( slider ) {
					slider.fadeIn();
					slider.removeClass( 'loading' );
				}
			});
		}

		$slidePrev.on('click', function (e) {
			$contentSlider.flexslider('prev');
			e.preventDefault();
		});

		$slideNext.on('click', function (e) {
			$contentSlider.flexslider('next');
			e.preventDefault();
		});

		$contentHide.on('click', function (e) {
			$body
				.removeClass('main-content-visible')
				.addClass('main-content-hidden');
			e.preventDefault();
		});

		$contentShow.on('click', function (e) {
			$body
				.removeClass('main-content-hidden')
				.addClass('main-content-visible');
			e.preventDefault();
		});

		/* -----------------------------------------
		Video Backgrounds
		----------------------------------------- */
		var $videoWrap = $('#ci-video-background');

		// YouTube videos
		function onYouTubeAPIReady() {
			if ( typeof YT === 'undefined' || typeof YT.Player === 'undefined' ) {
				return setTimeout(onYouTubeAPIReady, 333);
			}

			var ytPlayer = new YT.Player('youtube-vid', {
				videoId: $videoWrap.data('video-id'),
				playerVars: {
					autoplay: 1,
					controls: 0,
					showinfo: 0,
					modestbranding: 1,
					loop: 1,
					playlist: $videoWrap.data('video-id'),
					fs: 0,
					cc_load_policy: 0,
					iv_load_policy: 3,
					autohide: 0
				},
				events: {
					onReady: function (e) {
						e.target.mute();
					}
				}
			});
		}

		function onVimeoAPIReady() {
			if ( typeof Vimeo === 'undefined' || typeof Vimeo.Player === 'undefined' ) {
				return setTimeout(onVimeoAPIReady, 333);
			}

			var player = new Vimeo.Player($videoWrap, {
				id: $videoWrap.data('video-id'),
				loop: true,
				autoplay: true,
				byline: false,
				title: false,
			});

			player.setVolume(0);
		}

		function resizeToRatio() {
			var coverRatio = Math.max(
				$window.width() / 16,
				$window.height() / 9
			);

			$videoWrap.width(16 * coverRatio);
			$videoWrap.height(9 * coverRatio);
		}

		var videoType = $videoWrap.data('video-type');

		if (
			$videoWrap.length
			&& ( $body.hasClass('page-template-nocontent') || window.innerWidth > 1080 )
		) {
			var tag = document.createElement('script');
			var firstScript = $('script');

			if (videoType === 'youtube') {
				tag.src = 'https://www.youtube.com/player_api';
				firstScript.parent().prepend(tag);
				onYouTubeAPIReady();
			} else if (videoType === 'vimeo') {
				tag.src = 'https://player.vimeo.com/api/player.js';
				firstScript.parent().prepend(tag);
				onVimeoAPIReady();
			}

			resizeToRatio();
			$window.on('resize', resizeToRatio);
		}
	});
});
