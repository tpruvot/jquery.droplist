jQuery(document).ready(samples);

function samples() {

	var undef;

	if (console != undef)
		jQuery.error = console.error;

	// GENERIC CONFIGURATION
	var settings = {
		autoresize: false,
		customScroll: true,
		height: 150
	}

	// BY SELECT
	jQuery('select.droplist-by-select').droplist(settings);
	
	// BY LIST
	jQuery('.droplist-by-list').droplist(settings, function() {
		var that = this;
		that.list.find('li a').closest('li').bind('click', function(e) {
			(console != undef) && console.log(this);
			that.set(this);
			(console != undef) && console.log(that);
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
	
	// BY SELECT - COMBOBOXCHANGE
	jQuery('.droplist-by-select-onchange').droplist(settings).bind('droplistchange', function() {
		var val = $(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
	//droplist-by-select-autoresize
	jQuery('.droplist-by-select-autoresize').droplist({autoresize:true});
	
};