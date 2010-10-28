var samples = function () {

	if (typeof(console) != 'undefined')
		jQuery.error = console.error;
	else
		console = {log: function(s){} };

	// generic settings
	var settings = {
		autoresize: false,
		customScroll: true,
		height: 150
	};

	// by select
	var collect = jQuery('select.droplist-by-select').droplist(settings);
	//console.log(collect);
	
	// ly list
	jQuery('.droplist-by-list').droplist(settings, function() {
		var that = this;
		that.list.find('li a').closest('li').bind('click', function(e) {
			console.log(this);
			that.set(this);
			that.close();
			console.log(that);
			return false;
		});
	});
	
	// ly list - tabs
	jQuery('.droplist-by-list-tabs').droplist(settings, function() {
		this.tabs();
	});
	
	// by list - onchange
	jQuery('.droplist-by-list-change').droplist(settings, function() {
		var that = this;
		that.list.find('a').bind('click', function() {
			var item = jQuery(this).parent();
			that.set(item);
			that.close();
			return false;
		});
	}).bind('change.droplist', function() {
		var val = jQuery(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
	// by select - onchange
	jQuery('.droplist-by-select-change').droplist(settings).bind('change.droplist', function() {
		var val = jQuery(this).data('droplist').get();
		alert('changed to ' + val);
	});
	
	//droplist-by-select-autoresize
	jQuery('.droplist-by-select-autoresize').bind('click',function(e){alert('ok');});
	var single = jQuery('.droplist-by-select-autoresize').droplist({autoresize:true});
	//console.log(single);
	
};

jQuery(document).ready(samples);