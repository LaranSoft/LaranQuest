function Space(id, position, walls, adiacents, free, floorElement, scenicElement){
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.free = free;
	this.floorElement = floorElement;
	this.scenicElement = scenicElement;
	this.id = id;
	
	this.visited = false;
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
	return this.free === true;
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
	this.$el.scenicElement && this.$el.scenicElement.hide();
};

/******************************************************
 * 
 * 
 * EXIT SPACE
 * 
 * 
 ******************************************************/
function ExitSpace(id, position, walls, adiacents){
	Space.call(this, id, position, walls, adiacents, false, null, 'exit');
	this.setGadget(new ExitGadget());
}

ExitSpace.prototype = Object.create(Space.prototype);
ExitSpace.prototype.constructor = ExitSpace;