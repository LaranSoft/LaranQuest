function Space(position, walls, adiacents, types, callbacks){
	
	var self = this;
	
	var cbk = $.extend({}, {
		onEnter: function( status, direction ){ return {canEnter: true}; },
		onExit: function( status, direction ){ return {canExit: true}; },
		overpass: function(){},
		rollback: function(){}
	}, callbacks);
	
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.types = types;
	
	this.$el;
	
	this.setDOMSpaceElement = function($el){
		self.$el = $el;
	};
	
	//0: sono entrato dal basso
	//1: sono entrato da sinistra
	//2: sono entrato dall'alto
	//3: sono entrato da destra
	this.onEnter = cbk.onEnter;
	
	//0: sto andando verso l'alto
	//1: sto andando verso destra
	//2: sto andando verso il basso
	//3: sto andando verso sinistra
	this.onExit = cbk.onExit;
	
	this.rollback = cbk.rollback;
	
	this.overpass = cbk.overpass;
};

var createExpSpace = function(position, walls, adiacents, expIndex){
	
	var space = new Space(position, walls, adiacents, ['exp'], {
		onEnter: function( status, direction ){
			if(!this.overpassed){
				status.stars[expIndex] = true;
			}
			return {canEnter: true};
		},
		rollback: function( status, direction ){
			if(!this.overpassed){
				status.stars[expIndex] = false;
			}
		},
		overpass: function(space){
			if(!this.overpassed){
				this.overpassed = true;
				addStar(expIndex); 
				space.$el.exp.transition({'scale': 3, 'opacity': 0, 'z-index': 100}, 600, function(){space.$el.exp.remove()});
			}
		}
	});
	
	return space;
};