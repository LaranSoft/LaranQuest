function Space(position, walls, adiacents, types){
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.types = types;
};

Space.prototype.setDOMSpaceElement = function($el){
	this.$el = $el;
};

Space.prototype.onEnter = function(status, direction){
	return {canEnter: true};
};

Space.prototype.onExit = function(status, direction){
	return {canExit: true};
};

Space.prototype.rollback = function(status, direction){};
Space.prototype.overpass = function(space, levelGUI){};

/******************************************************
 * 
 * 
 * EXP SPACE
 * 
 * 
 ******************************************************/

function ExpSpace(position, walls, adiacents, expIndex){
	this.expIndex = expIndex;
	Space.call(this, position, walls, adiacents, ['exp']);
}

ExpSpace.prototype = Object.create(Space.prototype);
ExpSpace.prototype.constructor = ExpSpace;

ExpSpace.prototype.onEnter = function(status, direction) {
	if(!this.overpassed){
		status.stars[this.expIndex] = true;
		status.starNumber++;
	}
	return Space.prototype.onEnter.apply(this, arguments);
};
ExpSpace.prototype.rollback = function(status, direction) {
	if(!this.overpassed){
		status.stars[this.expIndex] = false;
		status.starNumber--;
	}
	return Space.prototype.rollback.apply(this, arguments);
};
ExpSpace.prototype.overpass = function(space, levelGUI) {
	if(!this.overpassed){
		this.overpassed = true;
		levelGUI.addStar(this.expIndex); 
		space.$el.exp.transition({'scale': 3, 'opacity': 0, 'z-index': 100}, 600, function(){space.$el.exp.remove()});
	}
};

/******************************************************
 * 
 * 
 * EXIT SPACE
 * 
 * 
 ******************************************************/
function ExitSpace(position, walls, adiacents){
	Space.call(this, position, walls, adiacents);
}

ExitSpace.prototype = Object.create(Space.prototype);
ExitSpace.prototype.constructor = ExitSpace;

ExitSpace.prototype.overpass = function(space, levelGUI) {
	levelGUI.completeLevel();
};
