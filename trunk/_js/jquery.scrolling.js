/* 20090108-1327 */
/******************************************************************************
 * Scrolling 2.0 - Terra Networks - Equipe Webdev
 * 2008
 * Modulo dependente do plugin MouseWheel e jqdnr
 * 
 * COMO UTILIZAR
 * 
 * Para utilizar o scrolling deve ser utilizada uma div com a classe scrolling
 * e esta div deve ter a classe scr-vertical ou scr-horizontal que define qual
 * sera o scroll utilizado
 *
 *
 * <div class="scrolling scr-vertical">
 * 	<div class="scr-content">
 * 		<div class="scr-innercontent">
 *			Lorem ipsum dolor siamet
 * 		</div>
 * 	</div>
 * </div>
 *
 ******************************************************************************/

(function($) {

	$.fn.extend({
		// scrolling
		scrolling: function() {
			var configs = ({
				marginWheel: 100
			});

			$(this).each(function(i) {
				var objScrolling = $(this);

				// Show combobox
				var combobox = objScrolling.parents(".combobox");
				if (combobox.size() > 0) {
					combobox.find(".scr-listvalues").show();
				}

				// Unbind wheel
				
				//alert(objScrolling.find(".scr-innercontent").height());
				//alert(objScrolling.height());
				
				objScrolling.unmousewheel();
				if (objScrolling.find(".scr-innercontent").height() > objScrolling.height() || objScrolling.find(".scr-innercontent").width() > objScrolling.width()) { // Scrolling
					if (objScrolling.find(".scr-scrollbar").size() == 0) {
						objScrolling.append("<div class=\"scr-scrollbar hide\">" +
												"<div class=\"scr-track\"><!-- --></div>" +
												"<div class=\"scr-bar\"><!-- --></div>" +
											"</div>" +
											"<div class=\"clear\"><!-- --></div>");
					}

					objScrolling.find(".scr-content").addClass("content-scroll");

					// Reset position
					$(document).ready(function() {
						objScrolling.find(".scr-content").get(0).scrollTop = 0;
						objScrolling.find(".scr-content").get(0).scrollLeft = 0;
					});

					// Track
					objScrolling.find(".scr-track").unbind("click").click(function(e) {
						if (objScrolling.hasClass("scr-horizontal")) { // Horizontal
							$(this).parents(".scrolling").scrollBarPosition(e.pageX, 0);
						} else { // Vertical
							$(this).parents(".scrolling").scrollBarPosition(e.pageY, 0);
						}
					});

					// Drag
					objScrolling.find(".scr-bar").jqDrag(null,
						function() {
							if (objScrolling.hasClass("scr-horizontal")) { // Horizontal
								objScrolling.scrollBarPosition(objScrolling.find(".scr-bar").css("left").replace("px",""), 1);
							} else { // Vertical
								objScrolling.scrollBarPosition(objScrolling.find(".scr-bar").css("top").replace("px",""), 1);
							}
						}
					);

					// Wheel
					objScrolling.mousewheel(function(event, delta){
						wheelScroll(delta, this);
						return false;
					});

				} else { // No scrolling
					objScrolling.find(".scr-content").removeClass("content-scroll");
					objScrolling.find(".scr-scrollbar").next().remove();
					objScrolling.find(".scr-scrollbar").remove();
				}

				// Hide combobox content
				if (combobox.size() > 0) {
					combobox.find(".scr-listvalues").hide();
				}
			});



			/*
			 * Functions
			 */
			/*
			
			 * PARAMETERS
			 * - selector (.scrolling)
			 */
			function getContentPosition(selector) {
				var objScrolling = $(selector);
				return objScrolling.hasClass("scr-horizontal") ? objScrolling.find(".scr-content").get(0).scrollLeft : objScrolling.find(".scr-content").get(0).scrollTop;
			}

			/*
			 * PARAMETERS
			 * - selector (.scrolling)
			 */
			function wheelScroll(delta, selector) {
				objScrolling = $(selector);

				objScrolling.scrollContentPosition(getContentPosition(selector) + (configs.marginWheel*delta*(-1)));
			}
		},



		/*
		 * Functions
		 */

		/*
		 * PARAMETERS
		 * - position (numeric)
		 * - selector (.scrolling)
		 * - flgDrag (0 - No drag / 1 - Drag)
		 */
		scrollBarPosition: function(position, flgDrag) {

			var configs = ({
				animateDuration: 200 // Milliseconds
			});

			var objScrolling = $(this);
			var objBar = objScrolling.find(".scr-bar");
			var objContent = objScrolling.find(".scr-content");
			
			if (objScrolling.hasClass("scr-horizontal")) { // Horizontal
				if (flgDrag == 0) { // No drag
					var posBarX = Math.min(Math.max(position - objScrolling.offset().left - objBar.width()/2,0),objBar.parent().width()-objBar.width());
					objBar.animate({left:posBarX+"px"},{ duration: configs.animateDuration, queue: false });
				} else { // Drag
					var posBarX = position;
				}
				percentPosition = (100 * posBarX) / (objBar.prev().width() - objBar.width());
				var posContentX = ( (objContent.find(".scr-innercontent").width() - objContent.width()) * percentPosition ) / 100;
				if (flgDrag == 0) {
					objContent.animate({scrollLeft: posContentX},{ duration: configs.animateDuration, queue: false });
				} else {
					objContent.get(0).scrollLeft = posContentX;
				}

			} else { // Vertical
				if (flgDrag == 0) {
					var posBarY = Math.min(Math.max(position - objScrolling.offset().top - objBar.height()/2,0),objBar.parent().height()-objBar.height());
					objBar.animate({top:posBarY+"px"},{ duration: configs.animateDuration, queue: false });
				} else {
					var posBarY = position;
				}
				percentPosition = (100 * posBarY) / (objBar.prev().height() - objBar.height());
				var posContentY = ( (objContent.find(".scr-innercontent").height() - objContent.height()) * percentPosition ) / 100;
				if (flgDrag == 0) {
					objContent.animate({scrollTop: posContentY},{ duration: configs.animateDuration, queue: false });
				} else {
					objContent.get(0).scrollTop = posContentY;
				}
			}
		},

		/*
		 * PARAMETERS
		 * - position (numeric)
		 * - selector (.scrolling)
		 */
		scrollContentPosition: function(position) {

			var configs = ({
				animateDuration: 200 // Milliseconds
			});

			var objScrolling = $(this);
			var objBar = objScrolling.find(".scr-bar");
			var objContent = objScrolling.find(".scr-content");

			// Stop current animation
			objContent.stop();
			objBar.stop();

			if (objScrolling.hasClass("scr-horizontal")) { // Horizontal
				objContent.animate({scrollLeft: position},{ duration: configs.animateDuration, queue: false });
				percentPosition = Math.min(100,Math.max(0,(position * 100) / (objContent.find(".scr-innercontent").width() - objContent.width())));
				posBarX = ( (objBar.parent().width()-objBar.width()) * percentPosition ) / 100;
				objBar.animate({left:posBarX+"px"},{ duration: configs.animateDuration, queue: false });

			} else { // Vertical
				objContent.animate({scrollTop: position},{ duration: configs.animateDuration, queue: false });
				percentPosition = Math.min(100,Math.max(0,(position * 100) / (objContent.find(".scr-innercontent").height() - objContent.height())));
				posBarY = ( (objBar.parent().height()-objBar.height()) * percentPosition ) / 100;
				objBar.animate({top:posBarY+"px"},{ duration: configs.animateDuration, queue: false });
			}
		}
	});
})(jQuery);

// $(".scrolling").scrolling();