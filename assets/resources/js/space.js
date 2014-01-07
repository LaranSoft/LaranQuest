function Space(id, position, walls, adiacents, blocked, scenicElement){
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.blocked = blocked;
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
 * EXIT SPACE
 * 
 * 
 ******************************************************/
function ExitSpace(id, position, walls, adiacents){
	Space.call(this, id, position, walls, adiacents, false, 'exit');
}

ExitSpace.prototype = Object.create(Space.prototype);
ExitSpace.prototype.constructor = ExitSpace;

ExitSpace.prototype.context = function(context) {
	//context.levelGUI.completeLevel(); TODO
};
