/* v0.6 (forked by tanguy.pruvot@gmail.com from v0.3r16)

  http://code.google.com/p/droplist/

  jQuery('.droplist').droplist();
  
  Files
  JS
   script/jquery.droplist.js
   script/jquery.mousewheel.js (if using customScroll)
   script/jquery.jScrollPane.js (if using customScroll)
  CSS
   script/droplist.css
   script/images/droplist_shadow.png

  v0.6 by tanguy.pruvot@gmail.com (29 Aug 2010) :
   + autoresize setting to reduce selectbox width when possible
   + optgroup key navigation
   + CSS cleanup
  v0.5 by tanguy.pruvot@gmail.com (28 Aug 2010) :
   + Prevent event propagation on click and key nav.
   + Automatic addClass("droplist") on <select>, 
     allowing a simple jQuery('select').droplist();
  v0.4 by tanguy.pruvot@gmail.com (23 Aug 2010) :
   + Arrows,Page,End Key navigation / Enter,space to select
   + Type ahead : next position and rotation
   + Automatic onchange event from select tag
*/
(function ($) {

	var DropList = function (el, settings, callback) {
	
		var self = this;
		var initialized = false;
		
		// DEFAULT SETTINGS
		settings = settings || {};
		settings.direction = settings.direction || 'auto';
		settings.customScroll = true;
		settings.autoresize = true;
		
		// PRIVATE METHODS
		
		function setText(str) {
			self.option.html(text2html(str));
		}
		
		function customScroll() {
			var h1 = settings.height || 220,
				h2 = self.listWrapper.height();
			if (h2 > h1) {
				self.list.css('height', h1 + 'px').jScrollPane({showArrows:false});
			}
		}
		
		function layout() {
			self.listWrapper.css('width', (self.obj.width - (self.listWrapper.outerWidth(true) - self.listWrapper.width())) + 'px');
			if (!settings.autoresize) {
				self.option.css('display','block');
				self.option.css('float','left');
				self.drop.css('display','block');
				self.drop.css('float','right');
				self.option.css('width', (self.obj.width - self.drop.width() - self.option.outerWidth(true)) + 'px');
			}
		}
		var text2html = function (data) {
			//fix incorrect chars in possible values
			return data.replace("<","&lt;").replace(">","&gt;");
		}
		
		var options2list = function (data) {
			var output = '<ul>';
			data.each(function () {
				var selected = $(this).attr('selected') ? 'selected' : '';
				output += '<li class="' + selected +'"><a href="' + $(this).val() +'">' + text2html($(this).text()) + '</a></li>\t';
			});
			output += '</ul>';
			return output;
		};
		
		
		/* PUBLIC METHODS */
		
		self.open = function () {
			
			// just show
			self.listWrapper.show();
			
			// close other opened lists
			var opened = $('html').find('.droplist-active');
			if (opened !== null && opened.length > 0) {
				opened.find('.droplist-list:first').hide();
				opened.removeClass('droplist-active');
				$('html').unbind('keydown');
			}
			
			self.wrapper.addClass('droplist-active');
			
			// auto direction
			if (settings.direction === 'auto') {
				var distanceFromBottom = (self.select.height() + self.wrapper.offset().top - $(document).scrollTop() - $(window).height()) * -1,
					objHeight = self.select.height() + self.listWrapper.height();
				if (distanceFromBottom < objHeight) {
					self.wrapper.addClass('droplist-up');
				} else {
					self.wrapper.removeClass('droplist-up');
				}
			} else if (settings.direction === 'up') {
				self.wrapper.addClass('droplist-up');
			}
			
			// focus selected item (auto scroll)
			if (settings.customScroll)
				self.listItems.filter('.selected').focus();
			
			// events (clickout / ESC key / type-ahead)
			self.typedKeys = '';
			
			$('html').bind('click', function (e) {
				
				// clickout
				if ($(e.target).closest('.droplist').length === 0) {
					self.close();
				}
			
			}).bind('keydown', function (e) {

				var curSel = self.listItems.filter('.selected');
				var curPos = self.listItems.index(curSel);
				var nextSelection=null;
				
				// get keycode
				if (e === null) { // old ie
					keycode = event.keyCode;
				}
				else { // moz, webkit, ie8
					keycode = e.which;
				}
			
				// esc/tab
				if (keycode == 27 || keycode == 9) {
					self.close();
					e.preventDefault();
					return true;
				}
				
				//enter,space : selection
				else if (keycode == 13 || keycode == 32) {
					if (curPos >= 0) {
						self.set(self.listItems.filter('.selected').first());
						e.preventDefault();
					} else {
						var focused = self.list.filter('a:focus'),
						current = (focused.parent().is('li')) ? focused.parent() : self.listItems.first();
						self.set(current);
					}
					return true;
				}
				
				// type-ahead support
				else if ((keycode >= 0x30 && keycode <= 0x7a)) {
					
					var newKey = '' + String.fromCharCode(keycode);
					var searchFrom = 0;
					if (self.typedKeys != newKey) {
						curPos = -1;
						self.typedKeys += newKey;
					} else {
						//same key repeated, next element
						if (curPos >= 0) {
							searchFrom = curPos+1;
							curPos = -1;
							self.typedKeys = newKey;
							clearTimeout(self.typeDelay);
						}
					}
					if (curPos == -1) {
						clearTimeout(self.typeDelay);
						self.typeDelay = setTimeout(function () {
							self.typedKeys = '';
						}, 800);
						self.listItems.slice(searchFrom).each(function () {
							if ($(this).find('>a').text().toUpperCase().indexOf(self.typedKeys) === 0) {
								nextSelection = $(this);
								return false;
							}
						});
					}

				} else {
				
					self.typedKeys = '';
					
					//down arrow
					if (keycode == 40) {
						if (curPos >= 0)
							nextSelection = self.listItems.eq(curPos+1);
						if (nextSelection === null || nextSelection.length === 0)
							nextSelection = self.listItems.last();
					}
					//up arrow
					else if (keycode == 38) {
						if (curPos > 0)
							nextSelection = self.listItems.eq(curPos-1);
						if (nextSelection === null || nextSelection.length === 0)
							nextSelection = self.listItems.first();
					}
					//page down
					else if (keycode == 34) {
						if (curPos >= 0) {
							nextSelection = self.listItems.eq(curPos+10);
							if (nextSelection === null || nextSelection.length === 0)
								nextSelection = self.listItems.last();
						}
					}
					//page up
					else if (keycode == 33) {
						if (curPos >= 10)
							nextSelection = self.listItems.eq(curPos-10);
						else
							nextSelection = self.listItems.first();
					}
					//home key
					else if (keycode == 36) {
						nextSelection = self.listItems.first();
					}
					//end key
					else if (keycode == 35) {
						nextSelection = self.listItems.last();
					}
					
				}
	
				if (nextSelection !== null) {
					self.listItems.removeClass('selected');
					nextSelection.addClass('selected').focus();
					e.preventDefault();
					return false;
				}

			});
		
		};
		
		self.close = function () {
			self.listWrapper.hide();
			self.wrapper.removeClass('droplist-active');
			$('html').unbind('click').unbind('keydown');
		};
		
		self.set = function (el) {
			
			var str = $(el).find('>a').text();
			setText(str);
			self.listItems.removeClass('selected').filter(el).addClass('selected');
		
			if (self.inputHidden.length > 0) {
				var val = el.find('a').attr('href');
				self.inputHidden.attr('value', val);
			}
			
			if (self.initialized) {
				self.close();
				if (self.obj.attr('onchange')) {
					//set "this.value"
					self.obj.val(self.get()); //firefox, chrome
					self.obj.append( //IE8 doesnt want a value without selected <option>
						$('<option selected="selected"></option>').val(self.get()).html('')
					);
					self.obj.trigger('onchange');
				} else {
					self.obj.trigger('droplistchange', self);
				}
			}
			
			//set container width to div + dropdown bt width to prevent dropdown br
			if (settings.autoresize) {
				self.option.css('width','');
				if (self.option.outerWidth(true) + self.drop.outerWidth(true) >= self.wrapper.width()) {
					var wx = self.option.outerWidth(true) - self.option.width();
					self.option.css('width',self.wrapper.width() - self.drop.outerWidth(true) - wx);
				}
			}
		};
		
		self.get = function () {
			return self.list.find('.selected:first a').attr('href');
		};
		
		self.tabs = function () {
			var that = this;
			that.list.find('li').bind('click', function (e) {
				that.set(this);
				var id = $(this).find('a').attr('href');
				jQuery(id).removeClass('hide').show().siblings().hide();
				e.preventDefault();
				return false;
			});
		};
	
	
		// CONTROLLER
		
		self.obj = $(el);
		self.obj.css('border','none');
		
		self.obj.className = self.obj.attr('class');
		self.obj.name = self.obj.attr('name');
		self.obj.width = self.obj.width();
		self.obj.title = self.obj.attr('title');
		
		var isInsideForm = false;
		
		// insert wrapper
		var wrapperHtml = '<div class="' + self.obj.className + ' droplist"><div class="droplist-list"></div></div>';
		
		// get elements
		self.wrapper = self.obj.removeAttr('class').wrap(wrapperHtml).parent().parent();
		self.listWrapper = self.wrapper.find('.droplist-list:first');
		self.list = self.listWrapper.find('ul:first');
		
		// case it's a SELECT tag, not a UL
		if (self.list.length === 0) {
			isInsideForm = true;
			var html = '',
				optgroups = self.listWrapper.find('select:first optgroup'),
				options;
			if (optgroups.length > 0) {
				html += '<ul>';
				optgroups.each(function () {
					options = $(this).find('option');
					html += '<li><strong>' + $(this).attr('label') + '</strong>' + options2list(options) + '</li>';
				});
				html += '</ul>';
			} else {
				options = self.listWrapper.find('select:first option');
				html += options2list(options);
			}
			self.listWrapper.html(html);
			self.list = self.listWrapper.find('ul:first');
		}
		
		// insert HTML into the wrapper
		self.wrapper.prepend('<div class="droplist-value"><div></div><a class="nogo" href="#nogo"></a></div>');
		
		// input hidden
		if (isInsideForm) {
			self.wrapper.append('<input type="hidden" name="' + self.obj.name + '" value="" />');
		}
		
		// GET ELEMENTS
		self.listItems = self.list.find('li a').closest('li');
		self.select = self.wrapper.find('.droplist-value:first');
		self.option = self.select.find('div:first');
		self.drop = self.select.find('a:first');
		self.inputHidden = self.wrapper.find('input[type=hidden]:first');
		
		// EVENTS
		
		// clicking on select
		self.select.bind('click', function (e) {
			if (self.listWrapper.is(':hidden')) {
				self.open();
			} else {
				self.close();
			}
			e.preventDefault();
			return true;
		});
		
		// clicking on an option inside a form
		if (isInsideForm) {
			self.list.find('li a').bind('click', function (e) {
				var parent = $(this).parent();
				self.set(parent);
				e.preventDefault();
				return false;
			});
		}
		
		// ADJUST LAYOUT (WIDTHS)
		layout();
		
		// CUSTOM SCROLL
		if (settings.customScroll) {
			customScroll();
		}
		
		// INITIAL STATE
		self.close();
		
		// set selected
		var selectedItem = self.list.find('.selected:first');
		if (selectedItem.length === 1) {
			self.set(selectedItem);
		}
		else {
			self.set(self.list.find('li a').closest('li:first'));
		}
		
		// title
		if (self.obj.title !== '') { setText(self.obj.title); }
		
		// CALLBACK
		if (typeof callback == 'function') { callback.apply(self); }
		
		self.initialized = true;
	
	};

	// extend jQuery
	$.fn.droplist = function (settings, callback) {
		return this.each(function (){
			var obj = $(this);
			if (obj.data('droplist')) return; // return early if this obj already has a plugin instance
			var instance = new DropList(this, settings, callback);
			obj.data('droplist', instance);
		});
	};

})(jQuery);