function Gadget(name){
	this.id = Gadget.nextId++;
	this.name = name;
};

Gadget.nextId = 0;

Gadget.prototype.applyTo = function(spaceId, mazeDescriptor) {}



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

StartGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	mazeDescriptor.start = spaceId;
};


/******************************************************
 * 
 * 
 * SEAL GADGET
 * 
 * 
 ******************************************************/
function SealGadget(){
	Gadget.call(this, 'seal');
}

SealGadget.prototype = Object.create(Gadget.prototype);
SealGadget.prototype.constructor = SealGadget;

SealGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {};


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

ExitGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	mazeDescriptor.end = spaceId;
};

/******************************************************
 * 
 * 
 * TELEPORT GADGET
 * 
 * 
 ******************************************************/
function TeleportGadget(teleportId, enabled){
	Gadget.call(this, 'teleport' + teleportId);
	this.teleportId = teleportId;
	if(enabled != null){
		this.enabled = enabled;
	} else {
		this.enabled = true;
	}
}

TeleportGadget.prototype = Object.create(Gadget.prototype);
TeleportGadget.prototype.constructor = TeleportGadget;

TeleportGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	var self = this;
	
	// trovo la casella con l'altra placca di teletrasporto
	var destinationId = 0;
	for(var i in mazeDescriptor.gadgets){
		if(i != spaceId){
			if(mazeDescriptor.gadgets[i].name == 'teleport' + this.teleportId){
				destinationId = i; break;
			}
		}
	}
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		if(self.enabled === false && (!status.teleportsSwitch || !status.teleportsSwitch[self.teleportId])){
			status.sbe.push(function(s){
				return -1;
			});
		} else {
			if(!status.teleports) status.teleports = [];
			if(!status.teleports[self.teleportId]){
				status.teleports[self.teleportId] = true;
				status.redirect = [Number(destinationId)];
			}
		}
	});
};

/******************************************************
 * 
 * 
 * TELEPORT SWITCH GADGET
 * 
 * 
 ******************************************************/
function TeleportSwitchGadget(teleportId){
	Gadget.call(this, 'teleportSwitch' + teleportId);
	this.teleportId = teleportId;
}

TeleportSwitchGadget.prototype = Object.create(Gadget.prototype);
TeleportSwitchGadget.prototype.constructor = TeleportSwitchGadget;

TeleportSwitchGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	var self = this;
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		if(!status.teleportsSwitch) status.teleportsSwitch = [];
		status.teleportsSwitch[self.teleportId] = true;
	});
};

/******************************************************
 * 
 * 
 * KEY GADGET
 * 
 * 
 ******************************************************/
function KeyGadget(){
	Gadget.call(this, 'key');
}

KeyGadget.prototype = Object.create(Gadget.prototype);
KeyGadget.prototype.constructor = KeyGadget;

KeyGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	
	mazeDescriptor.status.keys = 0;
	mazeDescriptor.status.futureKeys = 0;
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		status.futureKeys++;
		
		status.eots.push(function(s){
			s.keys += s.futureKeys;
			s.futureKeys = 0;
		});
	});
};

/******************************************************
 * 
 * 
 * FORCE DIRECTION GADGET
 * 
 * 
 ******************************************************/
function ForceDirectionGadget(direction){
	Gadget.call(this, 'forceDirection' + direction);
	this.direction = direction;
}

ForceDirectionGadget.prototype = Object.create(Gadget.prototype);
ForceDirectionGadget.prototype.constructor = ForceDirectionGadget;

ForceDirectionGadget.prototype.applyTo = function(spaceId, mazeDescriptor, maze) {
	var self = this;
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		status.redirect = [maze[spaceId].adiacents[self.direction]];
	});
};

/******************************************************
 * 
 * 
 * LIFE GADGET
 * 
 * 
 ******************************************************/
function LifeGadget(value){
	Gadget.call(this, 'life');
	this.value = value;
}

LifeGadget.prototype = Object.create(Gadget.prototype);
LifeGadget.prototype.constructor = LifeGadget;

LifeGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	mazeDescriptor.status.lifePoints = 1;
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		status.lifePoints++;
	});
};

/******************************************************
 * 
 * 
 * DAMAGE GADGET
 * 
 * 
 ******************************************************/
function DamageGadget(value){
	Gadget.call(this, 'damage');
	this.value = value;
}

DamageGadget.prototype = Object.create(Gadget.prototype);
DamageGadget.prototype.constructor = DamageGadget;

DamageGadget.prototype.applyTo = function(spaceId, mazeDescriptor) {
	
	mazeDescriptor.status.lifePoints = 1;
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		status.lifePoints--;
		status.sbe.push(function(s){
			if(s.lifePoints <= 0) return -1;
			return 0;
		});
	});
};

/******************************************************
 * 
 * 
 * BOW TRAP GADGET
 * 
 * 
 ******************************************************/
function BowTrapGadget(){
	Gadget.call(this, 'bowTrap');
}

BowTrapGadget.prototype = Object.create(Gadget.prototype);
BowTrapGadget.prototype.constructor = BowTrapGadget;

BowTrapGadget.prototype.applyTo = function(spaceId, mazeDescriptor, maze) {
	var self = this;
	mazeDescriptor.status.lifePoints = 1;
	mazeDescriptor.status['bowTrap' + this.id] = true;
	
	var f = function(status){
		if(status['bowTrap' + self.id] === true){
			status['bowTrap' + self.id] = false;
			status.lifePoints--;
			status.sbe.push(function(s){
				if(s.lifePoints <= 0) return -1;
				return 0;
			});
		}
	};
	
	var originalAdiacents = maze[spaceId].adiacents;
	for(var i=0; i<4; i++){
		var adiacents = originalAdiacents;
		while(adiacents[i] != 0){
			mazeDescriptor[adiacents[i]].enterFunctions.push(f);
			adiacents = maze[adiacents[i]].adiacents;
		}
	}
};
