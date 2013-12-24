function Maze(options){
	var defaultOptions = {
		'character': '', 
		'size': [0, 0], 
		'start': 0, 
		'end': 0, 
		'spaces': {}, 
		'labels': [], 
		'triggers': {}, 
		'statusModifier': {},
		'GUISettings': {}
	};
	
	options = $.extend({}, defaultOptions, options);
	
	this.character = options.character;
	this.size = options.size;
	this.start = options.start;
	this.end = options.end;
	this.spaces = {};
	this.labels = options.labels;
	this.positions = {};
	this.triggers = options.triggers;
	this.statusModifier = options.statusModifier;
	this.GUISettings = options.GUISettings;
	
	for(var i=0; i<options.spaces.length; i++){
		this.spaces[(i+1)] = options.spaces[i];
		var spacePosition = options.spaces[i].position;
		this.positions[spacePosition[0] + '-' + spacePosition[1]] = i+1;
	}
};

Maze.prototype.baseTriggers = {
	'start': function(data){
		var statusModifier = data || {};
		this.status = $.extend({}, {
			stars: {},
			starNumber: 0,
			spaces: {}, 
			position: this.start,
			characters: { 
				'warrior': {
					remainingHealth: 2     // TODO in realtà questo valore sarà completamente preso dal salvataggio
				}
			}
		}, statusModifier);
	},
	'select': function(data){
		this.levelGUI.setRemainingMovements(this.status.characters[data.character].remainingMovements);
		this.levelGUI.setRemainingHealth(this.status.characters[data.character].remainingHealth);
	},
	'startTurn': function(data){
		this.status.characters.warrior.remainingMovements = 5; // TODO in realtà questo valore sarà completamente preso dal salvataggio
		this.activableCharacters = {'warrior': true}; // ovviamente il valore non è hardcoded
	},
	'endTurn': function(data){
		delete this.activableCharacters[data.character];
		var self = this;
		if($.isEmptyObject(this.activableCharacters)){
			//TODO in realtà bisogna ciclare su tutti i personaggi per fare l'animazione della perdita del punto vita
			this.levelGUI.damage(data.character, 1, function(){ //WARN: magic number
				if(--self.status.characters[data.character].remainingHealth <= 0){
					self.levelGUI.kill(data.character, function(){
						self.trigger('reload');
					});
				} else {
					self.trigger('startTurn');
					self.trigger('select', {character: data.character});
				}
			});
			
		}
	},
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

Maze.prototype.calculatePath = function(start, end){
	// retrieve the start and end coordinates (0 based)
	var startCoordinates = this.spaces[start].position;
	var endCoordinates = this.spaces[end].position;
	
	// calculate the delta coordinates.
	var dCoord = [endCoordinates[0] - startCoordinates[0], endCoordinates[1] - startCoordinates[1]];
	
	// this variable hold the return value
	var path = [];
	
	var xMovement = dCoord[0] > 0 ? 2 : 0;
	var yMovement = dCoord[1] > 0 ? 1 : 3;
	
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
				actualPosition = this.spaces[actualPosition].adiacents[xMovement];
				path.push(xMovement);
				yPath += 2*baseY;
			} else if(xPath < yPath) {
				actualPosition = this.spaces[actualPosition].adiacents[yMovement];
				path.push(yMovement);
				xPath += 2*baseX;
			} else {
				var preferredMovement = baseY >= baseX ? yMovement : xMovement;
				var futurePosition = this.spaces[actualPosition].adiacents[preferredMovement];
				if(futurePosition != 0){
					path.push(preferredMovement);
					baseY >= baseX ? xPath += 2*baseX : yPath += 2*baseY;  
				} else {
					preferredMovement = baseY >= baseX ? xMovement : yMovement;
					futurePosition = this.spaces[actualPosition].adiacents[preferredMovement];
					if(futurePosition != 0){
						path.push(preferredMovement);
						baseY >= baseX ? yPath += 2*baseY : xPath += 2*baseX;  
					}
				}
				actualPosition = futurePosition;
			}
			
			if(actualPosition == 0){
				path = []; 
				break;
			}
		}
	}
	return path;
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
		
		if(caseDescription.types){
			for(var typeIndex = 0; typeIndex < caseDescription.types.length; typeIndex++){
				var type = caseDescription.types[typeIndex];
				switch(type){
					case 'exp': {
						var tokenTop = caseTop + (caseSize * (1 - expTokenPadding) / 2);
						var tokenLeft = caseLeft + (caseSize * (1 - expTokenPadding) / 2);
						cas.exp = $('<img class="token exp scenicElement" src="resources/images/exp.png" style="width: ' + (caseSize*expTokenPadding) + 'px; height: ' + (caseSize*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
						mazeWrapper.append(cas.exp);
					}
				}
			}
		}
		
		caseIndex++;
	}
	
	for(var i=0; i<self.labels.length; i++){
		var label = self.labels[i];
		
		var labelTop = (label.position[0] * caseSize);
		var labelLeft = (label.position[1] * caseSize);
		var labelHeight = (label.size[0] * caseSize);
		var labelWidth = (label.size[1] * caseSize);
	
		var cas = $('<img class="absolute" src="resources/images/labels/' + label.fileName + '.png" style="width: ' + labelWidth + 'px; height: ' + labelHeight + 'px; top: ' + labelTop + 'px; left: ' + labelLeft + 'px;"></img>');
		mazeWrapper.append(cas);
	}
	
	var tokenTop = self.spaces[self.end].position[0] * caseSize + (caseSize * (1 - exitTokenPadding) / 2);
	var tokenLeft = self.spaces[self.end].position[1] * caseSize + (caseSize * (1 - exitTokenPadding) / 2);
	
	var exit = $('<img class="token scenicElement" src="resources/images/exit.png" width="' + (caseSize*exitTokenPadding) + '" height="' + (caseSize*exitTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
	mazeWrapper.append(exit);
	
	tokenTop = self.spaces[self.start].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
	tokenLeft = self.spaces[self.start].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
	
	var token = $('<img class="token scenicElement" character="' + self.character + '" src="resources/images/' + self.character + '.png" width="' + (caseSize*characterTokenPadding) + '" height="' + (caseSize*characterTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
	mazeWrapper.append(token);
	
	var actualPosition = self.start;
	var lastValidDragPosition = actualPosition;
	var actualDragPosition = actualPosition;
	
	//#LOG#console.log(JSON.stringify(mazeOffset));
	
	var MAZE_STATUS_CLONED;
	var MOVEMENT_DESCRIPTOR;
	
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
	
	self.trigger('start', this.statusModifier);
};


var pathRenderer = {
		
	css: {
		//'background-image': '-webkit-linear-gradient(#f1a165, #f36d0a)',
		'background-color': '#f36d0a',
		'border-style': 'solid',
		'border-width': '0px'
	},
		
	segments: [],
		
	startRadiusPercentage: 20,
	pathResolutionVel: 20, // spaces per second
		
	render: function(path, maze, container, caseSize){
		
		this.destroyPath();
		
		// check if path consist of a single space
		if(path.length == 1){
			
			// if so, simply render a circle over the space
			var position = maze.spaces[path[0]].position;
			
			// calculate the segment offset
			var segmentDimensions = {
				'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'border-radius': 2 * caseSize * this.startRadiusPercentage / 100,
				'height': 2 * caseSize * this.startRadiusPercentage / 100,
				'width': 2 * caseSize * this.startRadiusPercentage / 100
			};
			
			// construct the segment
			var segment = $('<div class="absolute" pd="width" pdv="' + segmentDimensions['width'] + '"></div>');
			
			// apply the css rules
			segment.css(this.css);
			segment.css(segmentDimensions);
			
			// store the segment for future deletion
			this.segments.push(segment);
			
			// append the segment to the container
			container.append(segment);
		} else {
			var directions = [];
			for(var i=0; i<path.length-1; i++){
				directions.push(maze.getDirection(path[i], path[i+1]));
			}
			
			var index = 0;
			while(index < directions.length){
				var direction = directions[index];
				
				for(i=index+1; i<directions.length; i++){
					if(directions[i] != direction) break;
				}
				
				var segmentLength = i - index;

				var startSegment = (direction == 0 || direction == 3) ? i : index;
				var position = maze.spaces[path[startSegment]].position;
				var isVerticalSegment = direction == 0 || direction == 2;
				
				var segmentDimensions = {
					'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
					'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
					'border-radius': caseSize * this.startRadiusPercentage / 100,
					'height': 2 * caseSize * this.startRadiusPercentage / 100,
					'width': segmentLength * caseSize + (2 * caseSize * this.startRadiusPercentage / 100)
				};

				var principalDimension = 'width'; 
				var principalDimensionValue = segmentDimensions[principalDimension];
				
				if(isVerticalSegment){
					principalDimension = 'height';
					var swap = segmentDimensions['height'];
					segmentDimensions['height'] = segmentDimensions['width'];
					segmentDimensions['width'] = swap;
					principalDimensionValue = segmentDimensions[principalDimension];
				}
				
				var segment = $('<div class="absolute" pd="' + principalDimension + '" pdv="' + principalDimensionValue + '" d="' + direction + '"></div>');
				
				segment.css(this.css);
				segment.css(segmentDimensions);
				
				this.segments.push(segment);
				
				container.append(segment);
				
				index = i;
			}
		}
	},
	
	destroyPath: function(){
		for(var i=0; i<this.segments.length; i++){
			this.segments[i].remove();
		}
		
		this.segments.splice(0, this.segments.length);
	},
	
	setPathValid: function(validity){
		for(var i=0; i<this.segments.length; i++){
			this.segments[i].css('opacity', validity ? '1' : '0.3');
		}
	},
	
	resolvePath: function(path, maze, caseSize){
		
		var self = this;
		
		var pixelPerSecond = this.pathResolutionVel * caseSize;
		
		var lastTimestamp = new Date().getTime();
		var begin = lastTimestamp;
		var lastSegmentIndex = 0;
		var lastSegmentDescriptor = {
			index: lastSegmentIndex,
			segment: self.segments[lastSegmentIndex],
			spaces: 0
		};
		lastSegmentDescriptor['pd'] = lastSegmentDescriptor.segment.attr('pd');
		lastSegmentDescriptor['pdv'] = lastSegmentDescriptor.segment.attr('pdv');
		lastSegmentDescriptor['direction'] = lastSegmentDescriptor.segment.attr('d');
		
		(function resolveLoop(time){
			
			if(lastSegmentIndex >= self.segments.length) return;
			
			if(lastSegmentIndex != lastSegmentDescriptor.index){
				// refresh the descriptor
				lastSegmentDescriptor = {
					index: lastSegmentIndex,
					segment: self.segments[lastSegmentIndex],
					spaces: lastSegmentDescriptor.spaces
				};
				lastSegmentDescriptor['pd'] = lastSegmentDescriptor.segment.attr('pd');
				lastSegmentDescriptor['pdv'] = lastSegmentDescriptor.segment.attr('pdv');
				lastSegmentDescriptor['direction'] = lastSegmentDescriptor.segment.attr('d');
			}
			
			var now = new Date().getTime();
			var delta = now - lastTimestamp;
			var pixel = delta / 1000 * pixelPerSecond;
			lastTimestamp = now; 
			lastSegmentDescriptor.pdv -= pixel;
			
			if(isNaN(lastSegmentDescriptor.pdv) || lastSegmentDescriptor.pdv <= 0){
				lastSegmentDescriptor.pdv = 0;
				lastSegmentIndex++;
			}

			var newCss = {};
			newCss[lastSegmentDescriptor['pd']] = lastSegmentDescriptor.pdv;
			
			if(lastSegmentDescriptor.direction == 1){
				newCss['left'] = '+=' + pixel
			} else if(lastSegmentDescriptor.direction == 2){
				newCss['top'] = '+=' + pixel
			}
			lastSegmentDescriptor.segment.css(newCss);
			
			var spaces = Math.ceil((now - begin) / 1000 * self.pathResolutionVel);
			
			if(spaces > path.length) spaces = path.length;
			
			if(lastSegmentDescriptor.spaces < spaces){
				for(var i=lastSegmentDescriptor.spaces; i<spaces; i++){
					maze.spaces[path[i]].overpass({
						maze: maze,
						status: maze.status,
						space: maze.spaces[path[i]], 
						levelGUI: maze.levelGUI
					});
				}
				lastSegmentDescriptor.spaces = spaces;
			}
            
            LevelGUI.requestAnimationFrame(resolveLoop);
        })(lastTimestamp);
	}
};