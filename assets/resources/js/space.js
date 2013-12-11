function Space(position, walls, adiacents, types, callbacks){
	
	var self = this;
	
	this.callbacks = $.extend({}, {
		onEnter: function(){},
		onExit: function(){}
	}, callbacks);
	
	var repaint = function($space){
		var pathValidity, pathType, pathDirection1, pathDirection2;
		pathValidity = $space.attr('pathValidity') || 'ok';
		pathType = $space.attr('pathType') || '';
		pathDirection1 = $space.attr('pathDirection1') || ''; 
		pathDirection2 = $space.attr('pathDirection2') || '';
		
		var spaceWalls = $space.attr('spaceWalls');
		
		var imagePath = pathValidity + pathType + pathDirection1 + pathDirection2;
		if(imagePath != pathValidity){
			imagePath = 'url(' + contextPath + '/resources/images/' + imagePath + '.png), ';
		} else imagePath = '';
		$space.css({'background-image': imagePath + 'url(' + contextPath + '/resources/images/' + spaceWalls + '.png)'});
	};

	this.simulatedStart = false;
	this.position = position;
	this.walls = walls;
	this.adiacents = adiacents;
	this.types = types;
	
	this.$el;
	this.enteringDirection = -1;
	
	this.setDOMSpaceElement = function($el){
		self.$el = $el;
		self.$el.attr('spaceWalls', self.walls);
	};
	
	//0: sono entrato dal basso
	//1: sono entrato da sinistra
	//2: sono entrato dall'alto
	//3: sono entrato da destra
	this.onSimulatedEnter = function(direction){
		
		// a normal Space will always permit the enter
		var retVal = {canEnter: true};
		
		// check if the entering direction correspond with the exiting direction (if exist)
		if(self.exitingDirection != -1 && (self.exitingDirection - direction) % 2 == 0 && self.exitingDirection != direction){
			
			// if so, cancel the exiting direction in the DOM and in the js
			self.$el.removeAttr('pathDirection2');
			self.exitingDirection = -1;
			
		} else {

			// update the entering direction in the DOM and in the js
			self.$el.attr('pathDirection1', direction+1);
			self.enteringDirection = direction;
		}

		// repaint the space
		repaint(self.$el);
		
		return retVal;
	};
	
	//0: sto andando verso l'alto
	//1: sto andando verso destra
	//2: sto andando verso il basso
	//3: sto andando verso sinistra
	this.onSimulatedExit = function(direction){
		
		// a normal Space will always permit the exit
	    var retVal = {canExit: true};
	    
		// check if the exiting direction correspond with the entering direction (if exist)
		if(!self.simulatedStart && (self.enteringDirection - direction) % 2 == 0 && self.enteringDirection != direction){
			
			// if so, update the DOM and the js accordingly
		    self.$el.removeAttr('pathType pathValidity pathDirection1 pathDirection2');
			self.enteringDirection = -1;
		} else {
			// update the DOM and the js
			self.$el.attr('pathDirection2', direction+1);
			self.exitingDirection = direction;
		}
		
		// repaint the space
		repaint(self.$el);
		return retVal;
	};
	
	this.startSimulation = function(){
		self.simulatedStart = true;
		self.$el.attr('pathType', 's').attr('pathValidity', 'ok');
		repaint(self.$el);
	};
	
	this.onSimulatedEnd = function(){
		self.$el.removeAttr('pathType pathValidity pathDirection1 pathDirection2');
		if(self.simulatedStart == true){
			repaint(self.$el);
		}
		self.simulatedStart = false;
		self.enteringDirection = -1;
		self.exitingDirection = -1;
	};
	
	this.setSimulationInvalid = function(){
		var pathValidity = self.$el.attr('pathValidity');
		if(pathValidity != 'ko'){
			self.$el.attr('pathValidity', 'ko');
			repaint(self.$el);
		}
	};
	
	this.setSimulationValid = function(){
		var pathValidity = self.$el.attr('pathValidity');
		if(pathValidity != 'ok'){
			self.$el.attr('pathValidity', 'ok');
			repaint(self.$el);
		}
	};
	
	this.onEnter = function(maze, path, index, duration){
		self.$el.removeAttr('pathType pathValidity pathDirection1 pathDirection2');
		repaint(self.$el);
		self.callbacks.onEnter(self);
		if(path[index+1]){
			setTimeout(function(){
				self.onExit(maze, path, index, duration);
			}, duration);
		}
	};
	
	this.onExit = function(maze, path, index, duration){
		self.callbacks.onExit();
		setTimeout(function(){
			maze[path[index+1]].onEnter(maze, path, index+1, duration);
		}, duration);
	};
};