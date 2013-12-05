function Space(position, walls, adiacents, types){
	
	var self = this;
	
	var setOver = function($space){
	    $space.attr('path', 's');
	};
	var setOut = function($space){
	    $space.removeAttr('path');
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
	};
	
	//0: sono entrato dal basso
	//1: sono entrato da sinistra
	//2: sono entrato dall'alto
	//3: sono entrato da destra
	this.onSimulatedEnter = function(direction){
		var retVal = {canEnter: true};
		if(self.enteringDirection == -1 && !self.simulatedStart){
			self.enteringDirection = direction;
			setOver(self.$el);
		}
		return retVal;
	};
	
	//0: sto andando verso l'alto
	//1: sto andando verso destra
	//2: sto andando verso il basso
	//3: sto andando verso sinistra
	this.onSimulatedExit = function(direction){
	    var retVal = {canExit: true};
		// controllo se sto uscendo dalla stessa direzione da cui sono entrato
		if(!self.simulatedStart && (self.enteringDirection - direction) % 2 == 0 && self.enteringDirection != direction){
		    setOut(self.$el);
			self.enteringDirection = -1;
		}
		return retVal;
	};
	
	this.startSimulation = function(){
		self.simulatedStart = true;
		setOver(self.$el);
	};
	
	this.onSimulatedEnd = function(){
		if(self.simulatedStart == true){
			self.$el.removeAttr('path');
		}
		self.simulatedStart = false;
		self.enteringDirection = -1;
	};
	
	this.setSimulationInvalid = function(){
		self.$el.attr('path', 'i');
	};
	
	this.setSimulationValid = function(){
		self.$el.attr('path', 's');
	};
	
	this.onEnter = function(maze, path, index, duration){
		self.$el.removeAttr('path');
		if(path[index+1]){
			setTimeout(function(){
				self.onExit(maze, path, index, duration);
			}, duration);
		}
	};
	
	this.onExit = function(maze, path, index, duration){
		setTimeout(function(){
			maze[path[index+1]].onEnter(maze, path, index+1, duration);
		}, duration);
	};
};

var maze = {
	character: 'warrior',
	start: 1,
	end: 6,
	size: [1, 6],
	'1': new Space([0, 0], '11101111', [0, 2, 0, 0]),
	'2': new Space([0, 1], '11101110', [0, 3, 0, 1]),
	'3': new Space([0, 2], '11101110', [0, 4, 0, 2], ['exp']),
	'4': new Space([0, 3], '11101110', [0, 5, 0, 3], ['exp']),
	'5': new Space([0, 4], '11101110', [0, 6, 0, 4], ['exp']),
	'6': new Space([0, 5], '11111110', [0, 0, 0, 5]),
	positions: {
		'0-0': 1,
		'0-1': 2,
		'0-2': 3,
		'0-3': 4,
		'0-4': 5,
		'0-5': 6,
	}
};

var mazeRenderer = {
	render: function(container, maze){

		// calcolo le dimensioni della singola casella. La dimensione è il massimo numero intero per cui
		// il container contiene il labirinto, considerando un padding di 5px
		var caseSize = 0;
		
		var padding = 5;
		
		var expTokenPadding = 20;
		var exitTokenPadding = 10;
		var characterTokenPadding = 10;
		
		var containerW = container.width();
		var containerH = container.height();
		var availableW = containerW - (2*padding);
		var availableH = containerH - (2*padding);
		
		var maxCaseW = Math.floor(availableW / maze.size[1]);
		
		if(maxCaseW * maze.size[0] <= availableH){
			caseSize = maxCaseW;
		} else {
			caseSize = Math.floor(availableH / maze.size[0]);
		}
		
		if(caseSize > availableH / 1.1){
			caseSize = Math.floor(availableH / 1.1);
		}
		if(caseSize > availableW / 3){
			caseSize = Math.floor(availableW / 3);
		}
		
		var mazeW = (caseSize * maze.size[1]);
		var mazeH = (caseSize * maze.size[0]);
		var mazeTop = Math.floor((containerH - mazeH) / 2);
		var mazeLeft = Math.floor((containerW - mazeW) / 2);
		
		var mazeWrapper = $('<div id="mazeWrapper" style="width: ' + mazeW + 'px; height: ' + mazeH + 'px; top: ' + mazeTop + 'px; left: ' + mazeLeft + 'px;"></div>');

		container.append(mazeWrapper);
		
		var offset = mazeWrapper.offset();
		var mazeOffset = {
			left: offset.left,
			top: offset.top,
			right: offset.left + mazeW,
			bottom: offset.top + mazeH
		};
		
		var caseIndex = 1;
		while(maze[caseIndex]){
			var caseDescription = maze[caseIndex];
			var caseTop = (caseDescription.position[0] * caseSize);
			var caseLeft = (caseDescription.position[1] * caseSize);
		
			var cas = $('<div class="case w' + caseDescription.walls + '" style="width: ' + (caseSize) + 'px; height: ' + (caseSize) + 'px; top: ' + caseTop + 'px; left: ' + caseLeft + 'px;"></div>');
			mazeWrapper.append(cas);
			
			caseDescription.setDOMSpaceElement(cas);
			
			if(caseDescription.types){
				for(var typeIndex = 0; typeIndex < caseDescription.types.length; typeIndex++){
					var type = caseDescription.types[typeIndex];
					switch(type){
						case 'exp': {
							var tokenTop = caseTop + expTokenPadding;
							var tokenLeft = caseLeft + expTokenPadding;
							mazeWrapper.append($('<img class="token" src="resources/images/exp.png" style="width: ' + (caseSize-2*expTokenPadding) + 'px; height: ' + (caseSize-2*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>'));
						}
					}
				}
			}
			
			caseIndex++;
		}
		
		var tokenTop = maze[maze.end].position[0] * caseSize + exitTokenPadding;
		var tokenLeft = maze[maze.end].position[1] * caseSize + exitTokenPadding;
		
		var exit = $('<img class="token" src="resources/images/exit.png" width="' + (caseSize-2*exitTokenPadding) + '" height="' + (caseSize-2*exitTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
		mazeWrapper.append(exit);
		
		tokenTop = maze[maze.start].position[0] * caseSize + characterTokenPadding;
		tokenLeft = maze[maze.start].position[1] * caseSize + characterTokenPadding;
		
		var token = $('<img class="token" src="resources/images/' + maze.character + '.png" width="' + (caseSize-2*characterTokenPadding) + '" height="' + (caseSize-2*characterTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
		mazeWrapper.append(token);
		
		var actualPosition = maze.start;
		var lastValidDragPosition = actualPosition;
		var actualDragPosition = actualPosition;
		
		console.log(mazeOffset);
		
		var path = [];
		
		token.pep({
			cssEaseDuration: 0,
			//shouldEase: false,
			velocityMultiplier: 0,
			useCSSTranslation: false,
			allowDragEventPropagation: false,
			debug: true,
			initiate: function(){
				var start = maze[actualPosition].startSimulation();
				path = [actualPosition];
				lastValidDragPosition = actualPosition;
				actualDragPosition = actualPosition;
			},
			drag: function(event){
				if(event.originalEvent.targetTouches && event.originalEvent.targetTouches.length == 1){
					var clientX = event.originalEvent.targetTouches[0].pageX;
					var clientY = event.originalEvent.targetTouches[0].pageY;
					
					var isOver = mazeOffset.left < clientX && clientX < mazeOffset.right;
					var isOnSide = mazeOffset.top < clientY && clientY < mazeOffset.bottom;
					console.log(JSON.stringify(mazeOffset));
					console.log('x: ' + clientX + ' y: ' + clientY);
					console.log('isOver: ' + isOver + ' isOnSide:' + isOnSide);
					
					if(isOver && isOnSide){
						
						var col = Math.floor((clientX - mazeOffset.left) / caseSize);
						var row = Math.floor((clientY - mazeOffset.top) / caseSize);
						var targetPosition = maze.positions[row + '-' + col];
						if(targetPosition && targetPosition != lastValidDragPosition){
							// controllo che la targetPosition sia adiacente alla lastValidDragPosition
							var enteringDirection = maze[lastValidDragPosition].adiacents.indexOf(targetPosition);
							if(enteringDirection != -1){
								console.log('exiting from ' + lastValidDragPosition + ', direction: ' + enteringDirection);
								var step = maze[lastValidDragPosition].onSimulatedExit(enteringDirection);
								if(step.canExit == true){
									console.log('entering in ' + targetPosition + ', direction: ' + enteringDirection);
									step = maze[targetPosition].onSimulatedEnter(enteringDirection);
									
									if(step.canEnter == true){
										lastValidDragPosition = targetPosition;
										actualDragPosition = lastValidDragPosition;
										
										var pathIndex = path.indexOf(actualDragPosition);
										if(pathIndex != -1){
											path = path.slice(0, pathIndex);
										}
										path.push(actualDragPosition);
										
										console.log('actual path is ' + JSON.stringify(path));
									}
								}
							}
						}
					} else {
						actualDragPosition = 0;
					}
					
					if(actualDragPosition == 0){ // il giocatore sta draggando il token in una posizione non valida
						for(var i=0; i<path.length; i++){
							maze[path[i]].setSimulationInvalid();
						}
					} else { // il giocatore sta draggando il token in una posizione valida
						for(var i=0; i<path.length; i++){
							maze[path[i]].setSimulationValid();
						}
					}
				}
			},
			rest: function(event){
				for(var i=0; i<path.length; i++){
					maze[path[i]].onSimulatedEnd();
				}
				
				if(actualDragPosition != 0){
					actualPosition = actualDragPosition;
				}
				var tokenTop = maze[actualPosition].position[0] * caseSize + characterTokenPadding;
				var tokenLeft = maze[actualPosition].position[1] * caseSize + characterTokenPadding;
				
				token.css({left: tokenLeft, top: tokenTop});
				
				if(path.length > 1){
					maze[path[0]].onExit(maze, path, 0, Math.floor(200 / path.length));
				}
				
			}
		});
		
		// token.on('touchstart', function(event){
			// event = event.originalEvent;
			// console.log('start: ' + event.targetTouches[0].pageX + ' ' + event.targetTouches[0].pageY);
			// if (event.targetTouches.length == 1) {
				// var touch = event.targetTouches[0];
				// // Place element where the finger is
				// dragToken.show().css({'left': (touch.pageX - caseSize) + 'px', 'top': (touch.pageY - caseSize) + 'px'});
			// }
		// });
		
		// token.on('touchmove', function(event){
			// event = event.originalEvent;
			// if (event.targetTouches.length == 1) {
				// var touch = event.targetTouches[0];
				
				// var isOver = mazeOffset.left < touch.pageX && touch.pageX < mazeOffset.right;
				// var isOnSide = mazeOffset.top < touch.pageY && touch.pageY < mazeOffset.bottom;
				// if(isOver){
					// dragToken.css('left', (touch.pageX - caseSize) + 'px');
				// }
				// if(isOnSide) {
					// dragToken.css('top', (touch.pageY - caseSize) + 'px');
				// }
				// if(isOver && isOnSide){
					// var col = Math.floor((touch.pageX - mazeOffset.left) / caseSize);
					// var row = Math.floor((touch.pageY - mazeOffset.top) / caseSize);
					// var targetPosition = maze.positions[row + '-' + col];
					// if(targetPosition && targetPosition != actualPosition){
						// maze[actualPosition].onDragExit && maze[actualPosition].onDragExit(targetPosition);
						// maze[targetPosition].onDragEnter && maze[targetPosition].onDragEnter(actualPosition);
						// actualPosition = targetPosition;
					// }
					// console.log('col: ' + col + ', row: ' + row);
				// }
			// }
		// });
		
		// token.on('touchend', function(event){
			// dragToken.hide();
		// })
	}
}