function Space(id, position, walls, adiacents, options){
	
	this.id = id;
	this.position = position;
	this.walls = walls;
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

Space.prototype.reset = function(){
	this.removableGadget = null;
};

Space.prototype.setDOMSpaceElement = function($el){
	this.$el = $el;
};

Space.prototype.setGadget = function(gadget){
	this.removableGadget = gadget;
};

Space.prototype.getGadget = function(){
	return this.removableGadget || this.fixedGadget;
};

Space.prototype.removeGadget = function(gadget){
	if(this.removableGadget && this.removableGadget.id == gadget.id){
		this.removableGadget = null;
	};
};

Space.prototype.isPlaceable = function(gadget){
	return (this.free != (this.exceptions.indexOf(gadget) != -1)) && !this.fixedGadget && !this.removableGadget;
};

Space.prototype.setSelectable = function(selectable, callback){
	if(selectable === true){
		var self = this;
		
		this.$el.placingTarget.show();
		this.$el.placingTarget.plate.show().on('click', function(){
			callback(self);
		});
	} else {
		this.$el.placingTarget.hide();
		this.$el.placingTarget.plate.hide().off('click');
	}
};