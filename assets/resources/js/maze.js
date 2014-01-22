function Maze(options){
	var defaultOptions = {
		'size': [0, 0], 
		'spaces': {}, 
		'triggers': {}, 
		'tutorials': [],
		'objects': [],
		'doors': []
	};
	
	options = $.extend({}, defaultOptions, options);
	
	this.size = options.size;
	this.triggers = options.triggers;
	this.tutorials = options.tutorials;
	this.objects = options.objects;
	this.doors = options.doors;
	
	this.spaces = {};
	this.positions = {};
	for(var i=0; i<options.spaces.length; i++){
		this.spaces[options.spaces[i].id] = options.spaces[i];
		var spacePosition = options.spaces[i].position;
		this.positions[spacePosition[0] + '-' + spacePosition[1]] = i+1;
	}
};

Maze.prototype.baseTriggers = {
	'start': function(data){
		this.state = 'positioning';
	},
	'startPath': function(data){
		this.state = 'resolving';
		this.token = $('#gadgetstart');
		var mazeDescriptor = {
			status: {
				sbe: [], 
				eots: [], 
				visited: {}, 
				path: [], 
				sack: [],
				usedObjects: []
			},
			adiacents: {}
		};
		for(var spaceId in this.spaces){
			mazeDescriptor[spaceId] = {enterFunctions: []};
			mazeDescriptor.adiacents[spaceId] = this.spaces[spaceId].adiacents;
			mazeDescriptor.status.visited[spaceId] = false;
		}
		this.evaluateGadgets(mazeDescriptor);
		this.evaluateDoors(mazeDescriptor);
		
		var startSpace = this.spaces[mazeDescriptor.start];
		this.manageMovement(startSpace, mazeDescriptor);
	},
	'reload': function(data){
		var self = this;
		$('#level').effect('fade', 200, function(){
			$('#level').show();
			self.$container.empty();
			for(var spaceId in self.spaces) self.spaces[spaceId].reset();
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
	this.mazeWrapper = mazeWrapper;
	
	for(var spaceId in self.spaces){
		var caseDescription = self.spaces[spaceId];
		
		var caseTop = (caseDescription.position[0] * caseSize);
		var caseLeft = (caseDescription.position[1] * caseSize);
	
		var cas = $('<div class="case w' + caseDescription.walls + '"></div>');
		
		LevelGUI.setRect(cas, caseTop, caseLeft, caseSize, caseSize);
		
		mazeWrapper.append(cas);
		
		var placingTarget = $('<div class="placingTarget"></div>');
		cas.append(placingTarget);
		placingTarget.hide();
		cas.placingTarget = placingTarget;
		
		var placingTargetPlate = $('<div class="placingTargetPlate"></div>');
		cas.append(placingTargetPlate);
		placingTargetPlate.hide();
		cas.placingTarget.plate = placingTargetPlate;
		
		caseDescription.setDOMSpaceElement(cas);
		
		var gadget = caseDescription.getGadget();
		if(gadget){
			var gadgetTop = caseTop + (caseSize * (1 - expTokenPadding) / 2);
			var gadgetLeft = caseLeft + (caseSize * (1 - expTokenPadding) / 2);
			var $gadget = $('<img id="gadget' + gadget.name + '" class="scenicElement" src="resources/images/' + gadget.name + '.png"/>');
			LevelGUI.setRect($gadget, gadgetTop, gadgetLeft, caseSize*expTokenPadding, caseSize*expTokenPadding);
			
			caseDescription.setDOMGadget($gadget, true);
			
			mazeWrapper.append($gadget);
		}
	}
	
	for(var i=0; i<self.doors.length; i++){
		var spaceA = self.spaces[self.doors[i][0]];
		var idSpaceB = self.doors[i][1];
		
		var direction = spaceA.adiacents.indexOf(idSpaceB);
		var directionPrefix = direction % 2 == 0 ? 'h' : 'v';
		
		var doorDOM = $('<img id="door' + i + '" class="scenicElement" src="resources/images/' + directionPrefix + 'Door.png"/>');
		
		var doorTop = (spaceA.position[0] * caseSize);
		var doorLeft = (spaceA.position[1] * caseSize);
		
		directionPrefix == 'h' && (doorLeft += caseSize/10);
		directionPrefix == 'v' && (doorTop += caseSize/10);
		
		direction == 1 && (doorLeft += (caseSize * 15/16));
		direction == 2 && (doorTop += (caseSize * 15/16));
		
		var doorW = direction % 2 == 0 ? caseSize * 4/5 : caseSize * 1/8;
		var doorH = direction % 2 != 0 ? caseSize * 4/5 : caseSize * 1/8;
		
		LevelGUI.setRect(doorDOM, doorTop, doorLeft, doorW, doorH);
		
		mazeWrapper.append(doorDOM);
	}
	
	self.unplacedGadgets = {total: 0};
	
	for(var i=0; i<self.objects.length; i++){
		var object = self.objects[i];
		
		var objectTop = (object.position[0] * caseSize);
		var objectLeft = (object.position[1] * caseSize);
		
		var objectDOM = $('<div id="gadget' + object.gadget.name + '" class="positionableGadgetContainer scenicElement"/>');
		LevelGUI.setRect(objectDOM, objectTop, objectLeft, caseSize, caseSize);
		
		objectDOM.on('click', function(){
			var $elContainer = $(this);
			var $el = $elContainer.children('.positionableGadget');
			self.state == 'positioning' && self.showValidTargetsFor(self.objects[$el.attr('index')].gadget, $elContainer, $el);
		});

		var gadgetDOM = $('<img index="' + i + '" class="positionableGadget" src="resources/images/' + object.gadget.name + '.png"></img>');
		objectDOM.append(gadgetDOM);
		objectDOM.gadgetDOM = gadgetDOM;
		
		self.unplacedGadgets.total++;
		self.unplacedGadgets[object.gadget.id] = true;
		
		mazeWrapper.append(objectDOM);
	}
	
	self.caseSize = caseSize;
	//#LOG#console.log(JSON.stringify(mazeOffset));
	
	self.trigger('start', this.statusModifier);
};

Maze.prototype.showValidTargetsFor = function(gadget, $elContainer, $el){
	
	var self = this;
	
	if(self.selectedGadget && self.selectedGadget.id == gadget.id){
		self.levelGUI.setGadgetSelected(self.selectedDOMGadget, false);
		self.levelGUI.setPlayButtonVisible(self.unplacedGadgets.total <= 0);
		self.selectedGadgetContainer.removeClass('positioning');
		self.selectedGadget = null;
		self.selectedDOMGadget = null;
		self.selectedGadgetContainer = null;
		for(var i in this.spaces){
			this.spaces[i].setSelectable(false);
			self.oldGadgetSpace === i && (this.spaces[i].setGadget(gadget));
		}
	} else {
		
		self.levelGUI.setGadgetSelected(self.selectedDOMGadget, false);
		self.levelGUI.setPlayButtonVisible(false);
		
		self.selectedGadget = gadget;
		self.selectedDOMGadget = $el;
		self.selectedGadgetContainer = $elContainer;
		self.selectedGadgetContainer.addClass('positioning');
		
		for(var i in self.spaces){
			self.spaces[i].removeGadget(gadget) && (self.oldGadgetSpace = i);
		}
		
		var callback = function(space){
			for(var i in self.spaces){
				self.spaces[i].setSelectable(false);
				self.spaces[i].removeGadget(gadget);
			}
			
			self.levelGUI.setGadgetSelected(self.selectedDOMGadget, false);
			
			self.selectedGadgetContainer.removeClass('positioning').css({
				top: (space.position[0] * self.caseSize) + 'px',
				left: (space.position[1] * self.caseSize) + 'px'
			});
			
			space.setGadget(gadget);
			space.setDOMGadget($el, false);
			
			if(self.unplacedGadgets[gadget.id] == true){
				self.unplacedGadgets.total--;
				self.unplacedGadgets[gadget.id] = false;
			}
			self.levelGUI.setPlayButtonVisible(self.unplacedGadgets.total <= 0);
			
			self.selectedGadget = null;
			self.selectedDOMGadget = null;
			self.selectedGadgetContainer = null;
			self.oldGadgetSpace = null;
		};
		
		self.levelGUI.setGadgetSelected(self.selectedDOMGadget, true);
		
		for(var i in this.spaces){
			this.spaces[i].setSelectable(this.spaces[i].isPlaceable(gadget, self), callback);
		}
	}
};

Maze.prototype.evaluateGadgets = function(mazeDescriptor){
	var self = this;
	
	for(var i in self.spaces){
		var gadget = self.spaces[i].getGadget();
		gadget && gadget.applyTo(self.spaces[i], self, mazeDescriptor);
	}
};

Maze.prototype.getDirection = function(start, end){
	return this.spaces[start].adiacents.indexOf(end);
};

Maze.prototype.getPosition = function(start, direction){
	return this.spaces[start].adiacents[direction];
};

Maze.prototype.manageMovement = function(space, mazeDescriptor){
	var self = this;
	
	mazeDescriptor.status.visited[space.id] = true;
	mazeDescriptor.status.path.push(space.id);
	pathRenderer.render(mazeDescriptor.status.path, self, self.mazeWrapper, self.caseSize);
	
	for(var i in this.spaces){
		this.spaces[i].setSelectable(false);
	}
	
	var enterFunctions = mazeDescriptor[space.id].enterFunctions;
	for(var i=0; i<enterFunctions.length; i++){
		enterFunctions[i](mazeDescriptor.status);
	}
	
	var imDead = false;
	var levelCompleted = false;
	for(var i=0; i<mazeDescriptor.status.sbe.length; i++){
		var sbeOutcome = mazeDescriptor.status.sbe[i](mazeDescriptor.status);
		if(sbeOutcome < 0){
			imDead = true;
		} else if(sbeOutcome > 0){
			levelCompleted = true;
		}
	}
	mazeDescriptor.status.sbe = [];
	
	for(var i=0; i<mazeDescriptor.status.eots.length; i++){
		mazeDescriptor.status.eots[i](mazeDescriptor.status);
	}
	mazeDescriptor.status.eots = [];
	
	for(var i=0; i<mazeDescriptor.status.sack.length; i++){
		var item = mazeDescriptor.status.sack[i];
		var itemDOM = $('<img item="' + item.name + '" class="sackItem" src="resources/images/' + item.name + '.png"></img>');
		$('#bottom').append(itemDOM);
	}
	mazeDescriptor.status.sack = [];
	
	for(var i=0; i<mazeDescriptor.status.usedObjects.length; i++){
		var item = mazeDescriptor.status.usedObjects[i];
		$('[item=' + item + ']').filter(':first').remove();
	}
	mazeDescriptor.status.usedObjects = [];
	
	if(imDead && levelCompleted) levelCompleted = false;
	
	if(levelCompleted){
		self.levelGUI.completeLevel();
	} else if(!imDead){
	
		var redirect = mazeDescriptor.status.redirect;
		mazeDescriptor.status.redirect = null;
		if(redirect){
			self.moveIn(redirect, mazeDescriptor, 'fade');
		} else {
			self.showAdiacentsFor(space, mazeDescriptor);
		}
		
	} else {
		self.token.toggle('explode', function(){
			self.trigger('reload');
		});
	}
};

Maze.prototype.moveIn = function(space, mazeDescriptor, effect){
	var self = this;
	
	var w = self.token.width();
	var h = self.token.height();
	
	if(!effect){
		self.token.transition({
			top: ((space.position[0] * self.caseSize) + ((self.caseSize - w) / 2)) + 'px',
			left: ((space.position[1] * self.caseSize) + ((self.caseSize - h) / 2)) + 'px'
		}, 100, 'linear', function(){
			self.manageMovement(space, mazeDescriptor);
		});
	} else {
		self.token.fadeOut(300, function(){
			self.token.css({
				top: ((space.position[0] * self.caseSize) + ((self.caseSize - w) / 2)) + 'px',
				left: ((space.position[1] * self.caseSize) + ((self.caseSize - h) / 2)) + 'px'
			}).fadeIn(300, function(){
				self.manageMovement(space, mazeDescriptor);
			});
		});
	}
};

Maze.prototype.showAdiacentsFor = function(space, mazeDescriptor){
	var self = this;
	var pathClosed = true;
	var adiacents = space.getAdiacents(mazeDescriptor);
	for(var i=0; i<adiacents.length; i++){
		var adiacentId = adiacents[i];
		if(adiacentId != 0 && !mazeDescriptor.status.visited[adiacentId]){
			pathClosed = false;
			this.spaces[adiacents[i]].setSelectable(true, function(space){
				self.moveIn(space, mazeDescriptor);
			});
		}
	}
	imDead = pathClosed;
	
	if(imDead){
		self.token.toggle('explode', function(){
			self.trigger('reload');
		});
	}
};

Maze.prototype.evaluateDoors = function(mazeDescriptor){
	var self = this;
	
	var enterFunction = function(status){
		if(status.path.length >= 2){
			var spaceId = status.path[status.path.length-1];
			var lastSpaceId = status.path[status.path.length-2];
			
			for(var j=0; j<self.doors.length; j++){
				if((self.doors[j][0] == spaceId && self.doors[j][1] == lastSpaceId) ||
						(self.doors[j][1] == spaceId && self.doors[j][0] == lastSpaceId)){
					$('#door' + j).addClass('scaleAway');
					status.usedObjects.push('key');
					status.keys--;
					break;
				}
			}
		}
	};
	
	for(var i=0; i<this.doors.length; i++){
		var idSpaceA = this.doors[i][0];
		var idSpaceB = this.doors[i][1];
		
		mazeDescriptor[idSpaceA].enterFunctions.push(enterFunction);
		mazeDescriptor[idSpaceB].enterFunctions.push(enterFunction);
	}
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