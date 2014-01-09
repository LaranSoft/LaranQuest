function Space(id, position, walls, adiacents, free, floorElement, scenicElement){
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.free = free;
	this.floorElement = floorElement;
	this.scenicElement = scenicElement;
	this.id = id;
};

Space.prototype.setDOMSpaceElement = function($el){
	this.$el = $el;
};

Space.prototype.localStorage = function(status){
	status.spaces[this.id] || (status.spaces[this.id] = {});
	return status.spaces[this.id];
};

Space.prototype.onEnter = function(status, direction, levelGUI){
	var activeCharacter = status.characters[status.activeCharacter];
	activeCharacter.remainingMovements --;
	levelGUI.setRemainingMovements(activeCharacter.remainingMovements);
	var localStorage = this.localStorage(status);
	localStorage.isEndTurnSpace = activeCharacter.remainingMovements <= 0;
	return {canEnter: true};
};

Space.prototype.setGadget = function(name, gadget){
	this.gadgetName = name;
	this.gadget = gadget;
};

Space.prototype.removeGadget = function(name, gadget){
	if(this.gadgetName === name){
		this.gadget = null;
		this.gadgetName = null;
	};
};

Space.prototype.isPlaceable = function(symbol){
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

Space.prototype.rollback = function(status, levelGUI){
	var activeCharacter = status.characters[status.activeCharacter];
	activeCharacter.remainingMovements++;
	var localStorage = this.localStorage(status);
	localStorage.isEndTurnSpace = false;
	levelGUI.setRemainingMovements(activeCharacter.remainingMovements);
};
Space.prototype.overpass = function(context){
	var localStorage = this.localStorage(context.status);
	if(localStorage.isEndTurnSpace === true){
		context.maze.trigger('endTurn', {character: context.status.activeCharacter});
	}
	localStorage.isEndTurnSpace = false;
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
	this.setGadget('exit', {name: 'exit', value: true});
}

ExitSpace.prototype = Object.create(Space.prototype);
ExitSpace.prototype.constructor = ExitSpace;

ExitSpace.prototype.context = function(context) {
	//context.levelGUI.completeLevel(); TODO
};
