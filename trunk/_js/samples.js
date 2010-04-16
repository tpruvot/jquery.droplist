jQuery(document).ready(samples);

function samples() {

	// GENERIC CONFIGURATION
	var settings = {
		customScroll: true,
		height: 150
	}

	// BY LIST
	jQuery('.droplist-by-list').droplist(settings, function() {
		var that = this;
		that.list.find('li').bind('click', function() {
			console.log(this);
			that.set(this);
			console.log(that);
			return false;
		});
	});
	
	// BY LIST -  TABS
	jQuery('.droplist-by-list-tabs').droplist(settings, function() {
		this.tabs();
	});
	
	// BY LIST - DROPLISTCHANGE
	jQuery('.droplist-by-list-onchange').droplist(settings, function() {
		var that = this;
		that.list.find('a').bind('click', function() {
			var item = $(this).parent();
			that.set(item);
			return false;
		});
	}).bind('droplistchange', function() {
		var val = $(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
	// BY SELECT
	jQuery('.droplist-by-select').droplist(settings);
	
	// BY SELECT - COMBOBOXCHANGE
	jQuery('.droplist-by-select-onchange').droplist(settings).bind('droplistchange', function() {
		var val = $(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
};