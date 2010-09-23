var samples = function () {

	// generic settings
	var settings = {
		customScroll: true,
		height: 150
	};

	// by list
	jQuery('.droplist-by-list').droplist(settings, function () {
		var that = this;
		that.list.find('li').bind('click', function () {
			that.set(this);
			that.close();
			return false;
		});
	});
	
	// ly list - tabs
	jQuery('.droplist-by-list-tabs').droplist(settings, function () {
		this.tabs();
	});
	
	// by list - onchange
	jQuery('.droplist-by-list-change').droplist(settings, function () {
		var that = this;
		that.list.find('a').bind('click', function () {
			var item = jQuery(this).parent();
			that.set(item);
			that.close();
			return false;
		});
	}).bind('change.droplist', function () {
		var val = jQuery(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
	// by select
	jQuery('.droplist-by-select').droplist(settings);
	
	// by select - onchange
	jQuery('.droplist-by-select-change').droplist(settings).bind('change.droplist', function () {
		var val = jQuery(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
};

jQuery(document).ready(samples);