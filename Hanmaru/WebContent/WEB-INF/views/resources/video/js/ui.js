$(function(){
	var winH = $(window).height();
	var $dim = $(".dim");

	var ui = {
		init : function(){
			ui.header();
			ui.radio();
			ui.slide();
			ui.ampmToggle();
			ui.layerPopup();
			ui.moveTop();
		},
		header : function(){
			var $header = $("#header");
			var $navWrap = $("#navWrap");
			var $nav = $("#navWrap .nav");
			var $btnNavOpen = $header.find(".btnNavOpen");
			var $dep2 = $nav.find(".menuWrap .sub");
			var navTopH = $nav.find(".navTop").outerHeight();
			var dep1H = $nav.find(".menuWrap .menu").outerHeight();
			var quickMenuH = $nav.find(".quickMenu").outerHeight();
			var calcH = ((winH - (navTopH + dep1H + quickMenuH)) / 6.4);

			$dep2.css("height", calcH + "vh");

			$(window).on("resize", function(){
				$dep2.css("height", calcH + "vh");		
			});

			$btnNavOpen.on("click", function(){
				TweenMax.to($navWrap, .5, { x : "0%", ease:Power2.easeOut });
				dimCtrl(true, 1100);
				$dim.on("touchmove", function(e){ e.preventDefault(); });
			});

			var $btnSearch = $header.find(".btnSearch");
			var $searchWrap = $("#searchWrap");
			var $btnSrchClose = $searchWrap.find(".btnSrchClose");

			$btnSearch.on("click", function(){
				$searchWrap.css({
					display: "block",
					opacity: 1
				});
				dimCtrl(true);
			});

			$btnSrchClose.on("click", function(){
				$searchWrap.css({
					display: "none",
					opacity: 0
				});
				dimCtrl(false);
			});

			$dim.on("click", function(){
				TweenMax.to($navWrap, .5, { x:"-100%", ease:Power2.easeOut });
				dimCtrl(false, 500);
				$dim.unbind('touchmove');
			});
			
			function dimCtrl(visibleState, zIdx){
				if( visibleState === undefined ){ visibleState = true };
				if( visibleState ){
					$("body").addClass("freeze");
					$dim.show();
					$dim.css("zIndex", zIdx);
					TweenMax.to( $dim, .2, { opacity : 1, ease : Ease.Power0 });
				} else {
					$("body").removeClass("freeze");
					$dim.css("zIndex", zIdx);
					TweenMax.to( $dim, .2, { opacity : 0, ease : Ease.Power0, onComplete : function(){ $dim.hide(); } });
					$searchWrap.hide();
				}
			}
		},
		radio : function(){
			var $radioWrap = $(".radioWrap");

			$radioWrap.each(function(){
				var $radioBtn = $(this).find(".radio");

				$radioBtn.on("click", function(){
					$radioBtn.removeClass("checked");
					$(this).addClass("checked");
				});	
			});
		},
		ampmToggle : function(){
			var $ampmBtn = $('.ampm');

			$ampmBtn.on("click", function(){
				if( $(this).text() === "오전" ){
					$(this).text("오후");
				} else if( $(this).text() === "오후" ){
					$(this).text("오전");
				}
			});
		},
		slide : function(){
			// mainVisual
			$("#mainVisual .slideWrap").slick({
				fade: true,
				dots: false,
				arrows: true,
				infinite: true,
				speed: 1000,
				pauseOnHover: true,
				pauseOnFocus: false
			});

			// mainTopBanner
			$("#mainTopBanner .slideWrap").slick({
				fade: true,
				dots: true,
				appendDots: $("#mainTopBanner .slideContainer"),
				arrows: false,
				infinite: true,
				speed: 1000,
				pauseOnHover: true,
				pauseOnFocus: false
			});
		},
		layerPopup : function(){
			var $layerPop = $('.layerpop');
			var $previewPop = $('#pop_preview');
			var $btnOpenLayer = $('.btnLayerOpen');
			var $btnCloseLayer = $('.btnLayerClose');
			var $btnClosePop = $('.btnLayerClose, .btnConfirm, .btnCancel, .btnSave');

			$previewPop.css("height", winH - 150);

			$btnOpenLayer.on('click', function(e){
				var tgId = $(this).attr('data-layer-id');
				var $tg = $('#' + tgId );
				var layerW = $tg.width();
				var layerH = $tg.height();

				$(window).trigger('resize');
				$("body").addClass('freeze');

				$tg.show();
				dimCtrl();
				popAlignCenter($tg, layerW, layerH);
			});

			$('.dim, .btnLayerClose, .btnConfirm, .btnCancel, .btnSave').on('click', function(){
				closeLayer();
			});

			$btnClosePop.on('click', function(){
				$(this).parents('.commonPop').hide();
			});

			function popAlignCenter($tg, lw, lh){
				var winW = $(window).width();
				var winH = $(window).height();

				$tg.css({
					left : (( winW - lw ) / 2),
					top : (( winH - lh ) / 2)
				});

				$(window).resize(function(){
					resizePopAlignCenter($tg);
				});
			}

			function resizePopAlignCenter($tg){
				var winW = $(window).width();
				var winH = $(window).height();
				var a = $tg.width();
				var b = $tg.height();	

				$tg.css({
					left : (( winW - a ) / 2),
					top : (( winH - b ) / 2)
				});
			}

			function closeLayer(){
				$layerPop.hide();
				$previewPop.hide();
				dimCtrl(false);
				$("body").removeClass('freeze');
			}

			function dimCtrl(visibleState){
				if( visibleState === undefined ){ visibleState = true };
				if( visibleState ){
					$dim.show();
					TweenMax.to( $dim, .2, { opacity : 1, ease : Ease.Power0 });
				} else {
					TweenMax.to( $dim, .2, { opacity : 0, ease : Ease.Power0, onComplete : function(){ $dim.hide(); } });
				}
			}
		},
		moveTop : function(){
			var $btnTop = $("#container").find(".btnTop");

			$(window).on('scroll', function(){
				var st = $(this).scrollTop();
				if( st > (winH / 3) ){
					$btnTop.css("opacity", 1);
				} else { 
					$btnTop.css("opacity", 0);
				}
			});

			$btnTop.on('click', function(){
				TweenMax.to( "html, body", .4, { scrollTop : 0, ease : Quad.easeInOut } );
			});
		}
	};
	ui.init();
});