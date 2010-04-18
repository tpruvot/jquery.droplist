/* v0.1 - 2010-40-18 00:27 */
(function($) {

	var DropList = function(el, settings, callback) {
	
		var self = this;
		
		//SETTINGS
		settings = settings || {};
		settings.direction = settings.direction || 'auto';
		
		// PRIVATE METHODS
		
		function setText(str) {
			self.option.html(str);
		}
		
		function customScroll() {
			var h1 = settings.height || 150;
			var h2 = self.listWrapper.height();
			if (h2 > h1) {
				self.list.css('height', h1 + 'px').jScrollPane({showArrows:false});
			}
		}
		
		function layout() {
			self.listWrapper.css('width', (self.obj.width - (self.listWrapper.outerWidth(true) - self.listWrapper.width())) + 'px');
			self.option.css('width', (self.obj.width - self.drop.width() - self.option.outerWidth(true)) + 'px');
		}
		
		var options2list = function(data) {
			var output = '<ul>';
			data.each(function() {
				var selected = $(this).attr('selected') ? 'selected' : '';
				output += '<li class="' + selected +'"><a href="' + $(this).val() +'">' + $(this).text() + '</a></li>\t';
			});
			output += '</ul>';
			return output;
		};
		
		
		/* PUBLIC METHODS */
		
		self.open = function() {
			
			// just show
			self.listWrapper.show();
			self.wrapper.addClass('droplist-active');
			
			// auto direction
			if (settings.direction == 'auto') {
				var distanceFromBottom = (self.select.height() + self.wrapper.offset().top - $(document).scrollTop() - $(window).height()) * -1;
				var objHeight = self.select.height() + self.listWrapper.height();
				if (distanceFromBottom < objHeight) {
					self.wrapper.addClass('droplist-up');
				} else {
					self.wrapper.removeClass('droplist-up');
				}
			} else if (settings.direction == 'up') {
				self.wrapper.addClass('droplist-up');
			}
			
			// clickout and ESC key
			$('html').bind('click', function(e) {
				if ($(e.target).closest('.droplist').length === 0) {
					self.close();
				}
			}).bind('keyup', function(e){
				if (e == null) { // ie
					keycode = event.keyCode;
				} else { // mozilla
					keycode = e.which;
				}
				if(keycode == 27){ // close
					self.close();
				}	
			});
		
		};
		
		self.close = function() {
			self.listWrapper.hide();
			self.wrapper.removeClass('droplist-active');
			$('html').unbind('click').unbind('keyup');
		};
		
		self.set = function(el) {
			var str = $(el).text();
			setText(str);
			self.list.find('li').removeClass('selected').filter(el).addClass('selected');
		
			if (self.inputHidden.length > 0) {
				var val = el.find('a').attr('href');
				self.inputHidden.attr('value', val);
			}
			
			self.close();
			self.obj.trigger('droplistchange', self);
		};
		
		self.get = function() {
			return self.list.find('.selected:first a').attr('href');
		};
		
		self.tabs = function() {
			var that = this;
			that.list.find('li').bind('click', function() {
				that.set(this);
				var id = $(this).find('a').attr('href');
				jQuery(id).removeClass('hide').show().siblings().hide();
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
		var wrapperHtml = '<div class="' + self.obj.className + '"><div class="droplist-list"></div></div>';
		
		// get elements
		self.wrapper = self.obj.removeAttr('class').wrap(wrapperHtml).parent().parent();
		self.listWrapper = self.wrapper.find('.droplist-list:first');
		self.list = self.listWrapper.find('ul:first');
		
		// if it is a select tag
		if (self.list.length === 0) {
			isInsideForm = true;
			var html = '';
			var optgroups = self.listWrapper.find('select:first optgroup');
			if (optgroups.length > 0) {
				html += '<ul>';
				optgroups.each(function() {
					var options = $(this).find('option');
					html += '<li><strong>' + $(this).attr('label') + '</strong>' + options2list(options) + '</li>';
				});
				html += '</ul>';
			} else {
				var options = self.listWrapper.find('select:first option');
				html += options2list(options);
			}
			self.listWrapper.html(html);
			self.list = self.listWrapper.find('ul:first');
		}
		
		// insert HTML into the wrapper
		self.wrapper.prepend('<div class="droplist-value"><a href="#nogo"></a><div></div></div>');
		
		// input hidden
		if (isInsideForm) {
			self.wrapper.append('<input type="hidden" name="' + self.obj.name + '" value="" />');
		}
		
		/* GET ELEMENTS */
		self.select = self.wrapper.find('.droplist-value:first');
		self.option = self.select.find('div:first');
		self.drop = self.select.find('a:first');
		self.inputHidden = self.wrapper.find('input[type=hidden]:first');
		
		// EVENTS
		
		// clicking on select
		self.select.bind('click', function() {
			if (self.listWrapper.is(':hidden')) {
				self.open();
			} else {
				self.close();
			}
		});
		
		// clicking on an option inside a form
		if (isInsideForm) {
			self.list.find('a').bind('click', function() {
				var parent = $(this).parent();
				self.set(parent);
				return false;
			});
		}
		
		// ADJUST LAYOUT (WIDTHS)
		layout();	
		
		// CUSTOM SCROLL
		if (settings.customScroll) { customScroll(); }
		
		// INITIAL STATE
		
		self.close();
		
		// set selected
		var selectedItem = self.list.find('.selected:first');
		if (selectedItem.length === 1) { self.set(selectedItem); }
		else { self.set(self.list.find('li:first')); }
		
		// title
		if (self.obj.title !== '') { setText(self.obj.title); }
		
		// CALLBACK
		if (typeof callback == 'function') { callback.apply(self); }
	
	};

	// extend jQuery
	$.fn.droplist = function(settings, callback){
		return this.each(function(){
			var obj = $(this);
			if (obj.data('droplist')) return; // return early if this obj already has a plugin instance
			var instance = new DropList(this, settings, callback);
			obj.data('droplist', instance);
		});
	};

})(jQuery);