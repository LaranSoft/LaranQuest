function Space(id, adiacents, options){
	this.id = id;
	this.adiacents = adiacents;
	
	options = $.extend({}, Space.defaultOptions, options);
	
	this.free = options.free;
	this.exceptions = options.exceptions;
	this.fixedGadget = options.gadget;
};

Space.defaultOptions = {
	'free': true, 
	'exceptions': [], 
	'gadget': null 
};

Space.prototype.isPlaceable = function(gadget){
	return this.exceptions.indexOf(gadget) == -1;
};