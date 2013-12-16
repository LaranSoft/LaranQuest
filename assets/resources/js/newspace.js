function Space(position, walls, adiacents, types, callbacks){
	
	var self = this;
	
	this.callbacks = $.extend({}, {
		onEnter: function(){},
		onExit: function(){}
	}, callbacks);
	
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.types = types;
	
	this.$el;
	
	this.setDOMSpaceElement = function($el){
		self.$el = $el;
		self.$el.attr('spaceWalls', self.walls);
	};
	
	//0: sono entrato dal basso
	//1: sono entrato da sinistra
	//2: sono entrato dall'alto
	//3: sono entrato da destra
	this.onEnter = function(status, direction){
		// a normal Space will always permit the enter
		return {canEnter: true};
	};
	
	//0: sto andando verso l'alto
	//1: sto andando verso destra
	//2: sto andando verso il basso
	//3: sto andando verso sinistra
	this.onExit = function(status, direction){
		// a normal Space will always permit the exit
	    return {canExit: true};
	};
	
	this.rollback = function(status){
		// a normal Space won't rollback anything
	}
};