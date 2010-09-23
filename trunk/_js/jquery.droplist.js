(function ($) {
	
	var DropList = function (element, settings, callback) {
	
		var self = this;
		
		/*
		SETTINGS
		==============================================================================
		*/
		
		settings = settings || {};
		settings.direction = settings.direction || 'auto';
		settings.namespaces = settings.namespaces || {
			droplist: 'droplist',
			clickout: 'droplistClickout'
		};
		
		
		/*
		PRIVATE METHODS
		==============================================================================
		*/
		
		function setText(str) {
			self.option.html(str);
		}
		
		function customScroll() {
			var h1 = settings.height || 150,
				h2 = self.listWrapper.height();
			if (h2 > h1) {
				self.list.css('height', h1 + 'px').jScrollPane({
					showArrows: false
				});
			}
		}
		
		function layout() {
			self.listWrapper.css('width', (self.obj.width - (self.listWrapper.outerWidth(true) - self.listWrapper.width())) + 'px');
			self.option.css('width', (self.obj.width - self.drop.width() - self.option.outerWidth(true)) + 'px');
		}
		
		var options2list = function (data) {
			var output = '<ul>';
			data.each(function () {
				var selected = $(this).attr('selected') ? 'selected' : '';
				output += '<li class="' + selected + '"><a href="' + $(this).val() + '">' + $(this).text() + '</a></li>\t';
			});
			output += '</ul>';
			return output;
		};
		
		
		/*
		PUBLIC METHODS
		==============================================================================
		*/
		
		self.open = function () {
		
			// just show
			self.listWrapper.show();
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
			self.listItems.filter('.selected').focus();
			
			// events (clickout / ESC key / type-ahead)
			self.typedKeys = '';
			
			$(document).bind('click.' + settings.namespaces.clickout, function (e) {
				
				// clickout
				if ($(e.target).closest('.droplist').length === 0) {
					self.close();
				}
			
			}).bind('keyup.' + settings.namespaces.clickout, function (e) {
			
				// get keycode
				var keycode = null;
				if (e === null) { // ie
					keycode = event.keyCode;
				}
				else { // mozilla
					keycode = e.which;
				}
				
				// esc
				if (keycode === 27) {
					self.close();
				}
				
				// space
				else if (keycode === 32) {
					var focused = $('a:focus'),
						current = (focused.parent().is('li')) ? focused.parent() : self.listItems.first();
					self.set(current);
					self.close();
				}
				
				// type-ahead support
				else if (keycode >= 0x30 && keycode <= 0x7a) {
				
					// key char
					var key = String.fromCharCode(keycode);
					
					// clear up
					clearTimeout(self.typeDelay);
					
					// typing a letter repeatedly
					if (self.typedKeys === key) {
					
						var cur = self.list.find('.selected:first'),
							next = cur.next(),
							link = next.find('>a');
						
						if (link.text().toUpperCase().indexOf(self.typedKeys) === 0) {
							self.set(next);
						}
						else {
							self.setBySearch(self.typedKeys);
						}
					
					}
					
					// typing a word
					else {
					
						// concatenate
						self.typedKeys += key + '';
						
						// wait user to finish typing
						self.typeDelay = setTimeout(function () {
							
							self.setBySearch(self.typedKeys);
							self.typedKeys = '';
						
						}, 300);
					
					}
				
				}
			
			});
			
			self.obj.trigger('open.' + settings.namespaces.droplist, self);
		
		};
		
		self.close = function () {
			
			self.listWrapper.hide();
			self.wrapper.removeClass('droplist-active');
			$(document).unbind('.' + settings.namespaces.clickout);
			
			self.obj.trigger('close.' + settings.namespaces.droplist, self);
		
		};
		
		self.set = function (el) {
		
			var el = $(el),
				link = el.find('>a'),
				text = link.text();
			
			self.listItems.removeClass('selected');
			el.addClass('selected');
			
			setText(text);
		
			if (self.inputHidden.length > 0) {
				var val = el.find('a').attr('href');
				self.inputHidden.attr('value', val);
			}
			
			// trigger
			self.obj.trigger('change.' + settings.namespaces.droplist, self);
		
		};
		
		self.setBySearch = function (q) {
			
			self.listItems.each(function () {
				var link = $(this).find('>a');
				if (link.text().toUpperCase().indexOf(q) === 0) {
					self.set(this);
					return false;
				}
			});
		
		};
		
		self.get = function () {
			return self.list.find('.selected:first a').attr('href');
		};
		
		
		/*
		HELPERS
		==============================================================================
		*/
		
		self.tabs = function () {
			var that = this;
			that.list.find('li').bind('click', function () {
				that.set(this);
				that.close();
				var id = $(this).find('a').attr('href');
				$(id).removeClass('hide').show().siblings().hide();
				return false;
			});
		};


		/*
		CONTROLLER
		==============================================================================
		*/
		
		self.obj = $(element);
		self.obj.css('border','none');
		
		self.obj.id = self.obj.attr('id');
		self.obj.classname = self.obj.attr('class');
		self.obj.name = self.obj.attr('name');
		self.obj.width = self.obj.width();
		self.obj.title = self.obj.attr('title');
		
		var isInsideForm = false,
			isDisabled = (self.obj.attr('disabled') == true);
			
		if (isDisabled) {
			self.obj.classname += ' droplist-disabled';
		}
		
		// insert wrapper
		var wrapperHtml = '<div id="' + self.obj.id + '" class="' + self.obj.classname + '"><div class="droplist-list"></div></div>';
		
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
			
			// override list
			self.list = self.listWrapper.find('ul:first');
		
		}
		
		// insert HTML into the wrapper
		self.wrapper.prepend('<div class="droplist-value"><a href="javascript:void(0);"></a><div></div></div>');
		
		// input hidden
		if (isInsideForm) {
			self.wrapper.append('<input type="hidden" name="' + self.obj.name + '" value="" />');
		}
		
		
		// GET ELEMENTS
		self.listItems = self.list.find('li');
		self.select = self.wrapper.find('.droplist-value:first');
		self.option = self.select.find('div:first');
		self.drop = self.select.find('a:first');
		self.inputHidden = self.wrapper.find('input[type=hidden]:first');
		
		
		/*
		EVENTS
		==============================================================================
		*/
		
		if (isDisabled == false) {
		
			// clicking on select
			self.select.bind('click', function () {
				if (self.listWrapper.is(':hidden')) {
					self.open();
				} else {
					self.close();
				}
			});
		
			if (isInsideForm) {
				
				// clicking on an option inside a form
				self.list.find('a').bind('click', function () {
					var parent = $(this).parent();
					self.set(parent);
					self.close();
					return false;
				});
				
				// label correlation
				if (self.obj.id) {
					self.wrapper.parents('form').find('label[for="' + self.obj.id + '"]').bind('click', function () {
						self.drop.focus();
					});
				}
			
			}
		
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
			self.close();
		}
		else {
			self.set(self.list.find('li:first'));
			self.close();			
		}
		
		// title
		if (self.obj.title !== '') {
			setText(self.obj.title);
		}
		
		// CALLBACK
		if (typeof callback == 'function') {
			callback.apply(self);
		}
		
		self.wrapper.data('instanced', true);
		return self;
	
	};

	
	/*
	INSTANCES MANAGER
	==============================================================================
	*/
	
	$.fn.droplist = function (settings, callback) {
		return this.each(function () {
			
			var obj = $(this),
				instance = null;
			
			if (obj.data('instanced')) {
				return obj;
			}
				
			instance = new DropList(this, settings, callback);
			obj.data('droplist', instance);
			
		});
	};

})(jQuery);