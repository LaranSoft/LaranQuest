function Space(id, position, walls, adiacents, types){
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.types = types;
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

Space.prototype.onExit = function(status, direction, levelGUI){
	var activeCharacter = status.characters[status.activeCharacter];
	return {canExit: isNaN(activeCharacter.remainingMovements) || activeCharacter.remainingMovements > 0};
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

ExpSpace.prototype.onEnter = function(status, direction, levelGUI) {
	var localStorage = this.localStorage(status);
	if(!localStorage.overpassed){
		status.stars[this.expIndex] = true;
		status.starNumber++;
	}
	return Space.prototype.onEnter.apply(this, arguments);
};
ExpSpace.prototype.rollback = function(status, levelGUI) {
	var localStorage = this.localStorage(status);
	if(!localStorage.overpassed){
		status.stars[this.expIndex] = false;
		status.starNumber--;
	}
	return Space.prototype.rollback.apply(this, arguments);
};
ExpSpace.prototype.overpass = function(context) {
	Space.prototype.overpass.apply(this, arguments);
	var localStorage = this.localStorage(context.status);
	if(!localStorage.overpassed){
		localStorage.overpassed = true;
		context.levelGUI.addStar(this.expIndex); 
		context.space.$el.exp.transition({'scale': 3, 'opacity': 0, 'z-index': 100}, 600, function(){context.space.$el.exp.remove()});
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

ExitSpace.prototype.overpass = function(context) {
	context.levelGUI.completeLevel();
};
