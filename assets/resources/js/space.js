function Space(id, position, walls, adiacents, free, exceptions, floorElement, scenicElement, gadget){
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.free = free;
	this.floorElement = floorElement;
	this.id = id;
	
	this.visited = false;
	this.exceptions = exceptions || [];
	
	gadget && this.setGadget(gadget);
	
	scenicElement && (this.scenicElement = scenicElement);
	!scenicElement && gadget && (this.scenicElement = gadget.name);
};

Space.prototype.setDOMSpaceElement = function($el){
	this.$el = $el;
};

Space.prototype.setGadget = function(gadget){
	this.gadget = gadget;
};

Space.prototype.getGadget = function(){
	return this.gadget;
};

Space.prototype.removeGadget = function(gadget){
	if(this.gadget && this.gadget.id == gadget.id){
		this.gadget = null;
	};
};

Space.prototype.isPlaceable = function(gadget){
	return this.free != (this.exceptions.indexOf(gadget) != -1);
};

Space.prototype.setSelectableForPlacing = function(selectable, callback){
	if(selectable === true){
		var self = this;
		this.$el.addClass('placingTarget').on('click', function(){
			callback(self);
		});
	} else {
		this.$el.removeClass('placingTarget').off('click');
	}
};

Space.prototype.setSelectableForMoving = function(selectable, callback){
	if(selectable === true){
		var self = this;
		this.$el.addClass('placingTarget').on('click', function(){
			callback(self);
		});
	} else {
		this.$el.removeClass('placingTarget').off('click');
	}
};

Space.prototype.setVisited = function(visited){
	this.$el.addClass('visited');
};

/******************************************************
 * 
 * 
 * EXIT SPACE
 * 
 * 
 ******************************************************/
function ExitSpace(id, position, walls, adiacents){
	Space.call(this, id, position, walls, adiacents, false, null, null, 'exit');
	this.setGadget(new ExitGadget());
}

ExitSpace.prototype = Object.create(Space.prototype);
ExitSpace.prototype.constructor = ExitSpace;