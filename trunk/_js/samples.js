jQuery(document).ready(samples);

function samples() {

	if (typeof(console) != 'undefined')
		jQuery.error = console.error;
	else
		console = {log: function(s){} };

	// GENERIC CONFIGURATION
	var settings = {
		autoresize: false,
		customScroll: true,
		height: 150
	}

	// BY SELECT
	var collect = jQuery('select.droplist-by-select').droplist(settings);
	//console.log(collect);
	
	// BY LIST
	jQuery('.droplist-by-list').droplist(settings, function() {
		var that = this;
		that.list.find('li a').closest('li').bind('click', function(e) {
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
	
	// BY SELECT - COMBOBOXCHANGE
	jQuery('.droplist-by-select-onchange').droplist(settings).bind('droplistchange', function() {
		var val = $(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
	//droplist-by-select-autoresize
	jQuery('.droplist-by-select-autoresize').bind('click',function(e){alert('ok');});
	var single = jQuery('.droplist-by-select-autoresize').droplist({autoresize:true});
	//console.log(single);
	
};