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
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
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
			if(mazeDescriptor.gadgets[i].teleportId == this.teleportId){
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
	var self = this;
	mazeDescriptor.status.lifePoints = 1;
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		status.lifePoints+=self.value;
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
	var self = this;
	mazeDescriptor.status.lifePoints = 1;
	
	mazeDescriptor[spaceId].enterFunctions.push(function(status){
		status.lifePoints-=self.value;
		status.sbe.push(function(s){
			if(s.lifePoints <= 0) return -1;
			return 0;
		});
	});
};
