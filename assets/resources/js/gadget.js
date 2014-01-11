function Gadget(name){
	this.id = Gadget.nextId++;
	this.name = name;
};

Gadget.nextId = 0;

Gadget.prototype.applyTo = function(space, maze, mazeDescriptor) {}



/******************************************************
 * 
 * 
 * START GADGET
 * 
 * 
 ******************************************************/
function StartGadget(){
	Gadget.call(this, 'start');
}

StartGadget.prototype = Object.create(Gadget.prototype);
StartGadget.prototype.constructor = StartGadget;

StartGadget.prototype.applyTo = function(space, maze, mazeDescriptor) {
	mazeDescriptor.start = space.id;
};

/******************************************************
 * 
 * 
 * EXIT GADGET
 * 
 * 
 ******************************************************/
function ExitGadget(){
	Gadget.call(this, 'exit');
}

ExitGadget.prototype = Object.create(Gadget.prototype);
ExitGadget.prototype.constructor = ExitGadget;

ExitGadget.prototype.applyTo = function(space, maze, mazeDescriptor) {
	mazeDescriptor[space.id].enterFunctions.push(function(status){
		status.sbe.push(function(s){
			for(var i in s.visited){
				if(!s.visited[i]){
					return -1;
				}
			}
			return 1;
		});
	});
};

/******************************************************
 * 
 * 
 * TELEPORT GADGET
 * 
 * 
 ******************************************************/
function TeleportGadget(teleportId){
	Gadget.call(this, 'teleport' + teleportId);
	this.teleportId = teleportId;
}

TeleportGadget.prototype = Object.create(Gadget.prototype);
TeleportGadget.prototype.constructor = TeleportGadget;

TeleportGadget.prototype.applyTo = function(space, maze, mazeDescriptor) {
	var self = this;
	
	// trovo la casella con l'altra placca di teletrasporto
	var destinationIndex = 0;
	for(var i in maze.spaces){
		if(i != space.id){
			var gadget = maze.spaces[i].getGadget();
			if(gadget && (gadget.teleportId == this.teleportId)){
				destinationIndex = i; break;
			}
		}
	}
	
	mazeDescriptor[space.id].enterFunctions.push(function(status){
		if(!status.teleports) status.teleports = [];
		if(!status.teleports[self.teleportId]){
			status.teleports[self.teleportId] = true;
			status.redirect = maze.spaces[destinationIndex];
		}
	});
};