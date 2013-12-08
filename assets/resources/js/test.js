function Space(position, walls, adiacents, types){
	
	var self = this;
	
	var repaint = function($space){
		var pathValidity = $space.attr('pathValidity');
		pathValidity = pathValidity || 'ok';
		var pathType = $space.attr('pathType');
		pathType = pathType || '';
		var pathDirection1 = $space.attr('pathDirection1');
		pathDirection1 = pathDirection1 || ''; 
		var pathDirection2 = $space.attr('pathDirection2');
		pathDirection2 = pathDirection2 || '';
		var spaceWalls = $space.attr('spaceWalls');
		var imagePath = pathValidity + pathType + pathDirection1 + pathDirection2;
		console.log(imagePath + '.png');
		if(imagePath != 'ok'){
			imagePath = 'url(file:///android_asset/resources/images/' + imagePath + '.png), ';
		} else imagePath = '';
		$space.css({'background-image': imagePath + 'url(file:///android_asset/resources/images/' + spaceWalls + '.png)'});
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
		var retVal = {canEnter: true};
		if(self.enteringDirection == -1 && !self.simulatedStart){
			self.enteringDirection = direction;
			self.$el.attr('pathDirection1', direction+1);
			repaint(self.$el);
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
		    self.$el.removeAttr('pathType pathValidity pathDirection1 pathDirection2');
			self.enteringDirection = -1;
		} else {
			self.$el.attr('pathDirection2', direction+1);
		}
		repaint(self.$el);
		return retVal;
	};
	
	this.startSimulation = function(){
		self.simulatedStart = true;
		self.$el.attr('pathType', 's');
		self.$el.attr('pathValidity', 'ok');
	};
	
	this.onSimulatedEnd = function(){
		self.$el.removeAttr('pathType pathValidity pathDirection1 pathDirection2');
		if(self.simulatedStart == true){
			repaint(self.$el);
		}
		self.simulatedStart = false;
		self.enteringDirection = -1;
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
	'1': new Space([0, 0], '11000111', [0, 2, 0, 0]),
	'2': new Space([0, 1], '01000100', [0, 3, 0, 1]),
	'3': new Space([0, 2], '01000100', [0, 4, 0, 2], ['exp']),
	'4': new Space([0, 3], '01000100', [0, 5, 0, 3], ['exp']),
	'5': new Space([0, 4], '01000100', [0, 6, 0, 4], ['exp']),
	'6': new Space([0, 5], '01111100', [0, 0, 0, 5]),
	positions: {
		'0-0': 1,
		'0-1': 2,
		'0-2': 3,
		'0-3': 4,
		'0-4': 5,
		'0-5': 6,
	},
	calculatePath: function(start, end){
		// retrieve the start and end coordinates (0 based)
		var startCoordinates = this[start].position;
		var endCoordinates = this[end].position;
		
		// calculate the delta coordinates.
		var dCoord = [endCoordinates[0] - startCoordinates[0], endCoordinates[1] - startCoordinates[1]];
		
		// this variable hold the return value
		var path = [];
		
		var xMovement = dCoord[0] > 0 ? 3 : 1;
		var yMovement = dCoord[1] > 0 ? 2 : 4;
		
		var baseX = Math.abs(dCoord[0]);
		var baseY = Math.abs(dCoord[1]);
		
		// verify if x direction is 0
		if(dCoord[0] === 0){
			for(var i=0; i<baseY; i++){
				path.push(yMovement);
			}
			
		// verify if y direction is 0
		} else if(dCoord[1] === 0){
			for(var i=0; i<baseX; i++){
				path.push(xMovement);
			}
			
		// x and y directions are both non-zero
		} else {
			var xPath = baseX;
			var yPath = baseY;
			
			var actualPosition = start;
			var secondChoiceMovement = baseY >= baseX ? xMovement : yMovement;
			
			while(path.length < baseX + baseY){
				if(xPath > yPath) {
					actualPosition = this[actualPosition].adiacents[xMovement-1];
					path.push(xMovement);
					yPath += 2*baseY;
				} else if(xPath < yPath) {
					actualPosition = this[actualPosition].adiacents[yMovement-1];
					path.push(yMovement);
					xPath += 2*baseX;
				} else {
					var preferredMovement = baseY >= baseX ? yMovement : xMovement;
					actualPosition = this[actualPosition].adiacents[preferredMovement-1];
					if(actualPosition != 0){
						path.push(preferredMovement);
						baseY >= baseX ? xPath += 2*baseX : yPath += 2*baseY;  
					} else {
						preferredMovement = baseY >= baseX ? xMovement : yMovement;
						actualPosition = this[actualPosition].adiacents[preferredMovement-1];
						if(actualPosition != 0){
							path.push(preferredMovement);
							baseY >= baseX ? xPath += 2*baseX : yPath += 2*baseY;  
						}
					}
				}
				
				if(actualPosition == 0){
					path = []; 
					break;
				}
			}
		}
		
		return path;
	}
};

var mazeRenderer = {
	render: function(container, maze){

		// calcolo le dimensioni della singola casella. La dimensione è il massimo numero intero per cui
		// il container contiene il labirinto, considerando un padding di 5px
		var caseSize = 0;
		
		var padding = 5;
		
		var expTokenPadding = 0.6;
		var exitTokenPadding = 0.8;
		var characterTokenPadding = 0.8;
		
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
							var tokenTop = caseTop + (caseSize * (1 - expTokenPadding) / 2);
							var tokenLeft = caseLeft + (caseSize * (1 - expTokenPadding) / 2);
							mazeWrapper.append($('<img class="token" src="resources/images/exp.png" style="width: ' + (caseSize*expTokenPadding) + 'px; height: ' + (caseSize*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>'));
						}
					}
				}
			}
			
			caseIndex++;
		}
		
		var tokenTop = maze[maze.end].position[0] * caseSize + (caseSize * (1 - exitTokenPadding) / 2);
		var tokenLeft = maze[maze.end].position[1] * caseSize + (caseSize * (1 - exitTokenPadding) / 2);
		
		var exit = $('<img class="token" src="resources/images/exit.png" width="' + (caseSize*exitTokenPadding) + '" height="' + (caseSize*exitTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
		mazeWrapper.append(exit);
		
		tokenTop = maze[maze.start].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
		tokenLeft = maze[maze.start].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
		
		var token = $('<img class="token" src="resources/images/' + maze.character + '.png" width="' + (caseSize*characterTokenPadding) + '" height="' + (caseSize*characterTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
		mazeWrapper.append(token);
		
		var actualPosition = maze.start;
		var lastValidDragPosition = actualPosition;
		var actualDragPosition = actualPosition;
		
		console.log(JSON.stringify(mazeOffset));
		
		var path = [];
		//var remainingMovements = 5;
		
		token.pep({
			shouldEase: false,
			useCSSTranslation: false,
			forceNonCSS3Movement: true,
			manageTouchOnlyEvents: true,
			cssEaseDuration: 0,
			velocityMultiplier: 0,
			allowDragEventPropagation: false,
			initiate: function(){
				var start = maze[actualPosition].startSimulation();
				path = [actualPosition];
				lastValidDragPosition = actualPosition;
				actualDragPosition = actualPosition;
				token.css({
					'height': '+=' + (1.5*caseSize*characterTokenPadding),
					'width': '+=' + (1.5*caseSize*characterTokenPadding),
					'top': '-=' + (0.75*caseSize*characterTokenPadding),
					'left': '-=' + (0.75*caseSize*characterTokenPadding),
					opacity: 0.7
				});
			},
			drag: function(event){
				// manage only effective touches event
				if(event.originalEvent.targetTouches && event.originalEvent.targetTouches.length == 1){
					
					// get the x and y coordinates of the event
					var clientX = event.originalEvent.targetTouches[0].pageX;
					var clientY = event.originalEvent.targetTouches[0].pageY;
					
					
					// verify if the user is in the maze area
					if(mazeOffset.left > clientX || clientX > mazeOffset.right || mazeOffset.top > clientY || clientY > mazeOffset.bottom){
						
						console.log('out of maze: clientX:' + clientX + ' clientY:' + clientY);
						
						// the user is out of the maze area
						actualDragPosition = 0;
						
					} else {
						// the user is in the maze area.
						// But this doesn't mean that he is over a space
						// so let's calculate the actual row and column coordinates (0 based)
						var col = Math.floor((clientX - mazeOffset.left) / caseSize);
						var row = Math.floor((clientY - mazeOffset.top) / caseSize);
						
						// retrieve the space corrispondent to the (row, col) coordinates
						var targetPosition = maze.positions[row + '-' + col];
						
						// verify if the user is over a space different from the space over which was the last time
						if(targetPosition && targetPosition != lastValidDragPosition){
							
							// calculate the path from the actual position and the target position
							var localPath = maze.calculatePath(lastValidDragPosition, targetPosition);
							
							// check if such path exist
							if(localPath.length > 0){
								for(var i=0; i<localPath.length; i++){
									var enteringDirection = localPath[i] - 1;
									
									console.log('exiting from ' + lastValidDragPosition + ', direction: ' + enteringDirection);
									
									var step = maze[lastValidDragPosition].onSimulatedExit(enteringDirection);
									if(step.canExit == true){
										
										targetPosition = maze[lastValidDragPosition].adiacents[enteringDirection];
										
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
											
											//$('#remainingMovements').text(remainingMovements - (path.length - 1));
										}
									}
								}
							}
						}
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
			stop: function(event){
				console.log('path:' + JSON.stringify(path));
				for(var i=0; i<path.length; i++){
					maze[path[i]].onSimulatedEnd();
				}
				
				if(actualDragPosition != 0){
					actualPosition = actualDragPosition;
				}
				var tokenTop = maze[actualPosition].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
				var tokenLeft = maze[actualPosition].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
				
				if(path.length > 1){
					//remainingMovements -= (path.length - 1);
					maze[path[0]].onExit(maze, path, 0, Math.floor(200 / path.length));
				}
				
				console.log('resetting');
				setTimeout(function(){
					
					token.css({
						left: tokenLeft, 
						top: tokenTop, 
						'height': (caseSize*characterTokenPadding),
						'width': (caseSize*characterTokenPadding),
						opacity: 1
					});
				}, 0);
				
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