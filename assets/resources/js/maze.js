function Maze(options){
	var defaultOptions = {
		'size': [0, 0], 
		'spaces': {}, 
		'triggers': {}, 
		'tutorials': []
	};
	
	options = $.extend({}, defaultOptions, options);
	
	this.size = options.size;
	this.triggers = options.triggers;
	this.tutorials = options.tutorials;
	
	this.spaces = {};
	this.positions = {};
	for(var i=0; i<options.spaces.length; i++){
		this.spaces[(i+1)] = options.spaces[i];
		var spacePosition = options.spaces[i].position;
		this.positions[spacePosition[0] + '-' + spacePosition[1]] = i+1;
	}
};

Maze.prototype.baseTriggers = {
	'reload': function(data){
		var self = this;
		$('#level').effect('fade', 200, function(){
			$('#level').show();
			self.$container.html('');
			self.render(self.$container, self.statusModifier);
			self.levelGUI.reset();
		});
	}
};

Maze.prototype.setLevelGUI = function(levelGUI){
	this.levelGUI = levelGUI;
	levelGUI.setMaze(this);
};

Maze.prototype.trigger = function(triggerName, data){
	if(this.baseTriggers[triggerName]){
		this.baseTriggers[triggerName].call(this, data);
	}
	if(this.triggers[triggerName]){
		this.triggers[triggerName].call(this, data);
	}
};

Maze.prototype.getDirection = function(start, end){
	return this.spaces[start].adiacents.indexOf(end);
};
Maze.prototype.getPosition = function(start, direction){
	return this.spaces[start].adiacents[direction];
};

Maze.prototype.showTutorial = function(tutorialNames, index){
	index = index || 0;
	var self = this;
	if(index < tutorialNames.length){
		var tutorial = self.tutorials[tutorialNames[index]];
		if(!tutorial.isAlreadySeen()){
			this.levelGUI.showTutorial(tutorial, function(){
				tutorial.setAlreadySeen();
				self.showTutorial(tutorialNames, ++index);
			});
		} else {
			self.showTutorial(tutorialNames, ++index);
		}
	}
};

Maze.prototype.render = function(container){

	var self = this;
	
	this.$container = container;
	
	var caseSize = 0;
	
	var padding = 5;
	
	var expTokenPadding = 0.6;
	var exitTokenPadding = 0.8;
	var characterTokenPadding = 0.8;
	
	var containerW = container.width();
	var containerH = container.height();
	var availableW = containerW - (2*padding);
	var availableH = containerH - (2*padding);
	
	var maxCaseW = Math.floor(availableW / self.size[1]);
	
	if(maxCaseW * self.size[0] <= availableH){
		caseSize = maxCaseW;
	} else {
		caseSize = Math.floor(availableH / self.size[0]);
	}
	
	if(caseSize > availableH / 1.1){
		caseSize = Math.floor(availableH / 1.1);
	}
	if(caseSize > availableW / 3){
		caseSize = Math.floor(availableW / 3);
	}
	
	var mazeW = (caseSize * self.size[1]);
	var mazeH = (caseSize * self.size[0]);
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
	while(self.spaces[caseIndex]){
		var caseDescription = self.spaces[caseIndex];
		var caseTop = (caseDescription.position[0] * caseSize);
		var caseLeft = (caseDescription.position[1] * caseSize);
	
		var cas = $('<div class="case w' + caseDescription.walls + '" style="width: ' + (caseSize) + 'px; height: ' + (caseSize) + 'px; top: ' + caseTop + 'px; left: ' + caseLeft + 'px;"></div>');
		mazeWrapper.append(cas);
		
		caseDescription.setDOMSpaceElement(cas);
		
		if(caseDescription.blocked === true){
			var tokenTop = caseTop + (caseSize * (1 - expTokenPadding) / 2);
			var tokenLeft = caseLeft + (caseSize * (1 - expTokenPadding) / 2);
			cas.floor = $('<img class="floorElement" src="resources/images/blocked.png" style="width: ' + (caseSize*expTokenPadding) + 'px; height: ' + (caseSize*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
			mazeWrapper.append(cas.floor);
		}
		
		if(caseDescription.scenicElement){
			var tokenTop = caseTop + (caseSize * (1 - expTokenPadding) / 2);
			var tokenLeft = caseLeft + (caseSize * (1 - expTokenPadding) / 2);
			cas.scenicElement = $('<img class="scenicElement" src="resources/images/' + caseDescription.scenicElement + '.png" style="width: ' + (caseSize*expTokenPadding) + 'px; height: ' + (caseSize*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
			mazeWrapper.append(cas.scenicElement);
		}
		
		caseIndex++;
	}
	
	//#LOG#console.log(JSON.stringify(mazeOffset));
	
	self.trigger('start', this.statusModifier);
};

/**
token.pep({
		shouldEase: false,
		useCSSTranslation: false,
		forceNonCSS3Movement: true,
		manageTouchOnlyEvents: isMobile,
		cssEaseDuration: 0,
		velocityMultiplier: 0,
		allowDragEventPropagation: false,
		initiate: function(){
			
			MAZE_STATUS_CLONED = $.extend(true, {}, self.status);
			MAZE_STATUS_CLONED.activeCharacter = token.attr('character');

			self.trigger('select', {character: MAZE_STATUS_CLONED.activeCharacter});
			
			MOVEMENT_DESCRIPTOR = {
				startPosition: MAZE_STATUS_CLONED.position,
				pathValidity: true,
				path: []
			};
			MOVEMENT_DESCRIPTOR.actualPosition = MOVEMENT_DESCRIPTOR.startPosition;
			MOVEMENT_DESCRIPTOR.path.push(MOVEMENT_DESCRIPTOR.startPosition);
			
			pathRenderer.render(MOVEMENT_DESCRIPTOR.path, self, mazeWrapper, caseSize);
			
			token.css({
				'height': '+=' + (1.5*caseSize*characterTokenPadding),
				'width': '+=' + (1.5*caseSize*characterTokenPadding),
				'top': '-=' + (0.75*caseSize*characterTokenPadding),
				'left': '-=' + (0.75*caseSize*characterTokenPadding),
				'z-index': '100',
				opacity: 0.7
			});
		},
		drag: function(event){
			// manage only effective touches event
			if(isValidEvent(event)){
				
				// get the x and y coordinates of the event
				var clientCoord = getClientCoord(event);
				var clientX = clientCoord.x;
				var clientY = clientCoord.y;
				
				// only 5 possibilities:
				// 1) we are out of Maze Area
				// 2) we are in the Maze Area, but not over a space
				// 3) we are in the Maze Area, over a space that already is in the path
				// 4) we are in the Maze Area, over a space that isn't in the path and isn't reachable by actual position
				// 5) we are in the Maze Area, over a space that isn't in the path and is reachable by actual position 
				
				// verify if the user is in the maze area
				if(mazeOffset.left > clientX || clientX > mazeOffset.right || mazeOffset.top > clientY || clientY > mazeOffset.bottom){
					//#LOG#console.log('out of maze: clientX:' + clientX + ' clientY:' + clientY);
					
					// case 1) 
					// the path is flagged as invalid
					MOVEMENT_DESCRIPTOR.pathValidity = false;
				} else {
					
					// calculate the actual row and column coordinates (0 based)
					var col = Math.floor((clientX - mazeOffset.left) / caseSize);
					var row = Math.floor((clientY - mazeOffset.top) / caseSize);
					
					// retrieve the space corrispondent to the (row, col) coordinates
					var targetPosition = self.positions[row + '-' + col];
					
					// verify if the user is over a space
					if(!targetPosition){
						
						// case 2) 
						// the path is flagged as invalid
						MOVEMENT_DESCRIPTOR.pathValidity = false;
					} else {
						
						// verify if the overed space is already in the path
						var pathIndexOfTargetPosition = MOVEMENT_DESCRIPTOR.path.indexOf(targetPosition);
						if(pathIndexOfTargetPosition != -1){
							
							// case 3)
							// calculate the path variation
							MOVEMENT_DESCRIPTOR.pathVariation = [];
							
							for(var i=MOVEMENT_DESCRIPTOR.path.length-1; i>pathIndexOfTargetPosition; i--){
								MOVEMENT_DESCRIPTOR.pathVariation.push(-MOVEMENT_DESCRIPTOR.path[i]);
							}
							
							MOVEMENT_DESCRIPTOR.pathValidity = true;
							
						} else {
							
							// calculate the path from the actual position and the target position
							var pathMovements = self.calculatePath(MOVEMENT_DESCRIPTOR.actualPosition, targetPosition);
							
							// check if such path exist
							if(pathMovements.length == 0){
								
								// case 4)
								// the path is flagged as invalid
								MOVEMENT_DESCRIPTOR.pathValidity = false;
							} else {
								
								// case 5)
								// calculate the path variation
								MOVEMENT_DESCRIPTOR.pathVariation = [];
								var actualPosition = MOVEMENT_DESCRIPTOR.actualPosition;
								var minPathIndexOfNewPosition = -1;
								var maxMovementIndex = 0;
								var pathPositions = [];
								
								for(var i=0; i<pathMovements.length; i++){
									actualPosition = self.getPosition(actualPosition, pathMovements[i]);
									pathPositions.push(actualPosition);
									
									var pathIndexOfNewPosition = MOVEMENT_DESCRIPTOR.path.indexOf(actualPosition);
									if(pathIndexOfNewPosition != -1 && (minPathIndexOfNewPosition == -1 || pathIndexOfNewPosition < minPathIndexOfNewPosition)){
										maxMovementIndex = i+1;
										minPathIndexOfNewPosition = pathIndexOfNewPosition; 
									}
								}
								
								if(minPathIndexOfNewPosition != -1){
								
									var slicedPath = MOVEMENT_DESCRIPTOR.path.slice(minPathIndexOfNewPosition + 1);
											
									for(var i=slicedPath.length-1; i>=0; i--){
										MOVEMENT_DESCRIPTOR.pathVariation.push(-slicedPath[i]);
									}
								}
								
								for(var i=maxMovementIndex; i<pathPositions.length; i++){
									MOVEMENT_DESCRIPTOR.pathVariation.push(pathPositions[i]);
								}
								MOVEMENT_DESCRIPTOR.pathValidity = true;
							}
						}
					} 
				}
				
				MOVEMENT_DESCRIPTOR.dirty = false;
				
				if(MOVEMENT_DESCRIPTOR.pathValidity == true){
					for(var i=0; i<MOVEMENT_DESCRIPTOR.pathVariation.length; i++){
						
						var pathVariation = MOVEMENT_DESCRIPTOR.pathVariation[i];
						
						if(pathVariation < 0){
							var positionRollback = MOVEMENT_DESCRIPTOR.path.pop();
							MOVEMENT_DESCRIPTOR.dirty = true;
							if(positionRollback != -pathVariation){
								throw 'invalid path variation';
							} 
							
							self.spaces[-pathVariation].rollback(MAZE_STATUS_CLONED, self.levelGUI);
							
							MOVEMENT_DESCRIPTOR.actualPosition = MOVEMENT_DESCRIPTOR.path[MOVEMENT_DESCRIPTOR.path.length-1];
							
						} else {
							var direction = self.getDirection(MOVEMENT_DESCRIPTOR.actualPosition, pathVariation);
							
							var step = self.spaces[MOVEMENT_DESCRIPTOR.actualPosition].onExit(MAZE_STATUS_CLONED, direction, self.levelGUI);
							if(step.canExit == true){
								//#LOG#console.log('entering in ' + targetPosition + ', direction: ' + enteringDirection);
								
								step = self.spaces[pathVariation].onEnter(MAZE_STATUS_CLONED, direction, self.levelGUI);
								
								if(step.canEnter == true){
									MOVEMENT_DESCRIPTOR.actualPosition = pathVariation;
									
									MOVEMENT_DESCRIPTOR.path.push(pathVariation);
									MOVEMENT_DESCRIPTOR.dirty = true;
								}
							}
						}
					}
				}
				if(MOVEMENT_DESCRIPTOR.dirty == true){
					pathRenderer.render(MOVEMENT_DESCRIPTOR.path, self, mazeWrapper, caseSize);
				}
				
				pathRenderer.setPathValid(MOVEMENT_DESCRIPTOR.pathValidity);
			}
		},
		stop: function(event){
			
			if(MOVEMENT_DESCRIPTOR.pathValidity == false){
				
				pathRenderer.destroyPath();
				MOVEMENT_DESCRIPTOR.actualPosition = MOVEMENT_DESCRIPTOR.startPosition;
				self.trigger('select', {character: MAZE_STATUS_CLONED.activeCharacter});
			} else {
			
				self.status = MAZE_STATUS_CLONED;
				self.status.position = MOVEMENT_DESCRIPTOR.actualPosition;

				pathRenderer.resolvePath(MOVEMENT_DESCRIPTOR.path, self, caseSize);
			}
			
			var tokenTop = self.spaces[MOVEMENT_DESCRIPTOR.actualPosition].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
			var tokenLeft = self.spaces[MOVEMENT_DESCRIPTOR.actualPosition].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
			
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
*/