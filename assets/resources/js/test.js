var maze = {
	character: 'warrior',
	start: 1,
	end: 6,
	size: [5, 6],
	'1': new Space([2, 0], '11000111', [0, 2, 0, 0]),
	'2': new Space([2, 1], '01000100', [0, 3, 0, 1]),
	'3': createExpSpace([2, 2], '01000100', [0, 4, 0, 2], 1),
	'4': createExpSpace([2, 3], '01000100', [0, 5, 0, 3], 2),
	'5': createExpSpace([2, 4], '01000100', [0, 6, 0, 4], 3),
	'6': new Space([2, 5], '01111100', [0, 0, 0, 5], null, {overpass: function(){completeLevel();}}),
	labels: [
	    new Label([0, 0], [2, 3], 'YouAreHere'),
	    new Label([0, 4], [2, 2], 'Exit'),
	    new Label([3, 0], [2, 6], 'SlideYourFingerToMove')
    ],
	positions: {
		'2-0': 1,
		'2-1': 2,
		'2-2': 3,
		'2-3': 4,
		'2-4': 5,
		'2-5': 6,
	},
	trigger: function(triggerName){
	},
	calculatePath: function(start, end){
		// retrieve the start and end coordinates (0 based)
		var startCoordinates = this[start].position;
		var endCoordinates = this[end].position;
		
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

var MAZE_UTIL = {
	getDirection: function(maze, start, end){
		return maze[start].adiacents.indexOf(end);
	},
	getPosition: function(maze, start, direction){
		return maze[start].adiacents[direction];
	}
};

var starIndex = 0;
var starStatus = {};
var isSimulationValid = false;
var addStar = function(index){
	if(!starStatus[index]){
		starStatus[index] = true;
		starIndex++;
		$('#star' + starIndex).addClass('taken');
	}
};

var progressBarMaxValue = 20;
var progressBarWidth = 0;
var progressBarValue = 0;
var progressBarStep = 0;

var onLevelUp = function(){
	progressBarValue = 0;
	progressBarMaxValue = 30;
	progressBarStep = progressBarWidth / progressBarMaxValue;
	$('#level').text('2').css('color', 'green');
};

var completeLevel = function(){
	var blockMask = $('<div id="blockMask" class="absolute"></div>');
	var body = $('#level1');
	body.append(blockMask);
	blockMask.animate({
		'opacity': 0.9
	}, 600, function(){
		var availableH = body.height();
		var availableW = body.width();
		
		var padding = 10;
		
		availableH -= 2*padding; // padding
		availableW -= 2*padding; // padding
		
		var cellW = availableW / 4;
		var cellH = availableH / 5;
		
		var maxFitSquareSize = cellW > cellH ? cellH : cellW; 
		
		var tokenTop = padding + (cellH - maxFitSquareSize)/2;
		var tokenLeft = padding + (cellW - maxFitSquareSize)/2;
		var token = $('<img class="token levelSummaryElement" src="resources/images/' + maze.character + '.png" width="' + (maxFitSquareSize) + '" height="' + (maxFitSquareSize) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>')
		body.append(token);
		
		var levelLabelContainer = $('<div class="absolute levelSummaryElement" style="color: white; font-size: ' + (maxFitSquareSize/2) + 'px; top: ' + padding + 'px; left: ' + (padding + cellW) + 'px; width: ' + (3*cellW) + 'px; height: ' + (cellH) + 'px;"></div>');
		var levelLabel = $('<span class="absolute levelSummaryElement" style="height: ' + (maxFitSquareSize/2 + 20) + 'px; line-height: ' + (maxFitSquareSize/2 + 20) + 'px; top: ' + (cellH/2 - (maxFitSquareSize/4 + 10)) + 'px; left: 25px;">Level <span id="level" class="levelSummaryElement">1</span></span>');
		levelLabelContainer.append(levelLabel);
		body.append(levelLabelContainer);
		
		progressBarMaxValue = 20;
		progressBarWidth = 4*cellW;
		progressBarValue = 0;
		progressBarStep = progressBarWidth / progressBarMaxValue;
		
		var progressBarContainer = $('<div class="absolute levelSummaryElement" style="top: ' + (padding + cellH) + 'px; left: ' + (padding) + 'px; width: ' + (4*cellW) + 'px; height: ' + (cellH) + 'px;"></div>');
		var progressBarWrapper = $('<div class="progressBarContainer absolute levelSummaryElement" style="width: ' + (progressBarWidth) + 'px; height: 24px; top: 25px; left: 0px;"></div>');
		var progressBar = $('<span class="progressBar absolute levelSummaryElement" style="width: 0px; left: 2px; top: 2px; height: 20px;"></span>');
		progressBarWrapper.append(progressBar);
		progressBarContainer.append(progressBarWrapper);
		body.append(progressBarContainer);
		
		var star = $('<img class="absolute levelSummaryElement" src="resources/images/exp.png" width="' + (maxFitSquareSize) + '" height="' + (maxFitSquareSize) + '" style="top: ' + (tokenTop + 3*cellH) + 'px; left: ' + tokenLeft + 'px;"></img>');
		body.append(star);
		
		var starPointsValue = starIndex*10;
		var starPointsContainer = $('<div class="absolute levelSummaryElement" style="color: white; font-size: ' + (maxFitSquareSize/2) + 'px; top: ' + (padding + 3*cellH) + 'px; left: ' + (padding + cellW) + 'px; width: ' + (3*cellW) + 'px; height: ' + (cellH) + 'px;"></div>');
		var starPoints = $('<span class="absolute levelSummaryElement" style="height: ' + (maxFitSquareSize/2 + 20) + 'px; line-height: ' + (maxFitSquareSize/2 + 20) + 'px; top: ' + (cellH/2 - (maxFitSquareSize/4 + 10)) + 'px; left: 25px;"> x ' + starIndex + '  = <span id="starPoints" class="levelSummaryElement">' + (starPointsValue) + '</span></span>');
		starPointsContainer.append(starPoints);
		body.append(starPointsContainer);

		var stages = loader.loadFromMemory('stages');
		if(isNaN(stages[0].stars) || stages[0].stars < starIndex){
			stages[0].stars = starIndex;
		}
		if(stages[1].locked === true){
			stages[1].toUnlock = true;
		}
		loader.saveInMemory('stages', stages);
		
		// TODO trasformare in requestAnimFrame
		var progressBarRun = function(){
			if(starPointsValue > 0){
				starPointsValue--;
				$('#starPoints').text(starPointsValue);
				progressBarValue ++;
				if(progressBarValue > progressBarMaxValue){
					onLevelUp();
				}
				progressBar.css('width', progressBarValue * progressBarStep);
				setTimeout(progressBarRun, 30);
			} else {
				var okButton = $('<a class="absolute levelSummaryElement" style="top: ' + (padding + 4*cellH) + 'px;" href="levelSelection.html" data-role="button" data-theme="a">Ok</a>');
				body.append(okButton);
				okButton.button();
				okButton.css('left', (2*padding + 2*cellW - okButton.width()/2) + 'px');
			}
		};
		setTimeout(progressBarRun, 500);
				
	});
};

var MAZE_STATUS = {
	position: maze.start,
	stars: {}
};
var MAZE_STATUS_CLONED;
var MOVEMENT_DESCRIPTOR;

var mazeRenderer = {
	render: function(container, maze){

		// calcolo le dimensioni della singola casella. La dimensione � il massimo numero intero per cui
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
							cas.exp = $('<img class="token exp scenicElement" src="resources/images/exp.png" style="width: ' + (caseSize*expTokenPadding) + 'px; height: ' + (caseSize*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
							mazeWrapper.append(cas.exp);
						}
					}
				}
			}
			
			caseIndex++;
		}
		
		for(var i=0; i<maze.labels.length; i++){
			var label = maze.labels[i];
			
			var labelTop = (label.position[0] * caseSize);
			var labelLeft = (label.position[1] * caseSize);
			var labelHeight = (label.size[0] * caseSize);
			var labelWidth = (label.size[1] * caseSize);
		
			var cas = $('<img class="absolute" src="resources/images/labels/' + label.fileName + '.png" style="width: ' + labelWidth + 'px; height: ' + labelHeight + 'px; top: ' + labelTop + 'px; left: ' + labelLeft + 'px;"></img>');
			mazeWrapper.append(cas);
		}
		
		var tokenTop = maze[maze.end].position[0] * caseSize + (caseSize * (1 - exitTokenPadding) / 2);
		var tokenLeft = maze[maze.end].position[1] * caseSize + (caseSize * (1 - exitTokenPadding) / 2);
		
		var exit = $('<img class="token scenicElement" src="resources/images/exit.png" width="' + (caseSize*exitTokenPadding) + '" height="' + (caseSize*exitTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
		mazeWrapper.append(exit);
		
		tokenTop = maze[maze.start].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
		tokenLeft = maze[maze.start].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
		
		var token = $('<img class="token scenicElement" src="resources/images/' + maze.character + '.png" width="' + (caseSize*characterTokenPadding) + '" height="' + (caseSize*characterTokenPadding) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
		mazeWrapper.append(token);
		
		var actualPosition = maze.start;
		var lastValidDragPosition = actualPosition;
		var actualDragPosition = actualPosition;
		
		console.log(JSON.stringify(mazeOffset));
		
		//var remainingMovements = 5;
		
		token.pep({
			shouldEase: false,
			useCSSTranslation: false,
			forceNonCSS3Movement: true,
			manageTouchOnlyEvents: isMobile,
			cssEaseDuration: 0,
			velocityMultiplier: 0,
			allowDragEventPropagation: false,
			initiate: function(){
				
				MAZE_STATUS_CLONED = $.extend(true, {}, MAZE_STATUS);
				
				MOVEMENT_DESCRIPTOR = {
					startPosition: MAZE_STATUS_CLONED.position,
					pathValidity: true,
					path: []
				};
				MOVEMENT_DESCRIPTOR.actualPosition = MOVEMENT_DESCRIPTOR.startPosition;
				MOVEMENT_DESCRIPTOR.path.push(MOVEMENT_DESCRIPTOR.startPosition);
				
				pathRenderer.render(MOVEMENT_DESCRIPTOR.path, maze, mazeWrapper, caseSize);
				
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
						var targetPosition = maze.positions[row + '-' + col];
						
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
								var pathMovements = maze.calculatePath(MOVEMENT_DESCRIPTOR.actualPosition, targetPosition);
								
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
										actualPosition = MAZE_UTIL.getPosition(maze, actualPosition, pathMovements[i]);
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
								
								maze[-pathVariation].rollback(MAZE_STATUS_CLONED);
								
								MOVEMENT_DESCRIPTOR.actualPosition = MOVEMENT_DESCRIPTOR.path[MOVEMENT_DESCRIPTOR.path.length-1];
								
							} else {
								var direction = MAZE_UTIL.getDirection(maze, MOVEMENT_DESCRIPTOR.actualPosition, pathVariation);
								
								var step = maze[MOVEMENT_DESCRIPTOR.actualPosition].onExit(MAZE_STATUS_CLONED, direction);
								if(step.canExit == true){
									//#LOG#console.log('entering in ' + targetPosition + ', direction: ' + enteringDirection);
									
									step = maze[pathVariation].onEnter(MAZE_STATUS_CLONED, direction);
									
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
						pathRenderer.render(MOVEMENT_DESCRIPTOR.path, maze, mazeWrapper, caseSize);
					}
					
					pathRenderer.setPathValid(MOVEMENT_DESCRIPTOR.pathValidity);
				}
			},
			stop: function(event){
				
				if(MOVEMENT_DESCRIPTOR.pathValidity == false){
					
					pathRenderer.destroyPath();
					MOVEMENT_DESCRIPTOR.actualPosition = MOVEMENT_DESCRIPTOR.startPosition;
					
				} else {
				
					MAZE_STATUS = MAZE_STATUS_CLONED;
					
					MAZE_STATUS.position = MOVEMENT_DESCRIPTOR.actualPosition;

					pathRenderer.resolvePath(MOVEMENT_DESCRIPTOR.path, maze, caseSize);
					
				}
				
				var tokenTop = maze[MOVEMENT_DESCRIPTOR.actualPosition].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
				var tokenLeft = maze[MOVEMENT_DESCRIPTOR.actualPosition].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
				
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
		
		maze.trigger('start');
	}
}

var pathRenderer = {
	
	css: {
		'background-image': '-webkit-linear-gradient(#f1a165, #f36d0a)',
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
			var position = maze[path[0]].position;
			
			// calculate the segment offset
			var segmentDimensions = {
				'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'border-radius': 2 * caseSize * this.startRadiusPercentage / 100,
				'height': 2 * caseSize * this.startRadiusPercentage / 100,
				'width': 2 * caseSize * this.startRadiusPercentage / 100
			};
			
			// construct the segment
			var segment = $('<div class="absolute"></div>');
			
			// apply the css rules
			segment.css(this.css);
			segment.css(segmentDimensions);
			
			// store the segment for future deletion
			this.segments.push(segment);
			
			// append the segment to the container
			container.append(segment);
		} else {
			var segmentLength = 0;
			var direction = -1;
			var startIndex = 0;
			var endIndex = 0;
			for(var i=0; i<path.length-1; i++){
				var newDirection = MAZE_UTIL.getDirection(maze, path[i], path[i+1]);
				if(direction == -1 || newDirection == direction) {
					endIndex = i+1;
					direction = newDirection;
					segmentLength++;
					continue;
				}
				
				var index = startIndex;
				if(direction == 3){
					index = endIndex;
				}
				
				var position = maze[path[index]].position;
				
				var segmentDimensions = {
					'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
					'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
					'border-radius': caseSize * this.startRadiusPercentage / 100,
					'height': 2 * caseSize * this.startRadiusPercentage / 100,
					'width': segmentLength * caseSize
				};
				
				var segment = $('<div class="absolute" w="' + segmentDimensions['width'] + '" d="' + direction + '"></div>');
				
				segment.css(this.css);
				segment.css(segmentDimensions);
				
				this.segments.push(segment);
				
				container.append(segment);
				
				segmentLength = 0;
				direction = newDirection;
			}
			
			var index = startIndex;
			if(direction == 3){
				index = path.length - 1;
			}
			
			var position = maze[path[index]].position;
			
			var segmentDimensions = {
				'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'border-radius': caseSize * this.startRadiusPercentage / 100,
				'height': 2 * caseSize * this.startRadiusPercentage / 100,
				'width': segmentLength * caseSize + (2 * caseSize * this.startRadiusPercentage / 100)
			};
			
			var segment = $('<div class="absolute" w="' + segmentDimensions['width'] + '" d="' + direction + '"></div>');
			
			segment.css(this.css);
			segment.css(segmentDimensions);
			
			this.segments.push(segment);
			
			container.append(segment);
			
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
		lastSegmentDescriptor['width'] = lastSegmentDescriptor.segment.attr('w');
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
				lastSegmentDescriptor['width'] = lastSegmentDescriptor.segment.attr('w');
				lastSegmentDescriptor['direction'] = lastSegmentDescriptor.segment.attr('d');
			}
			
			var now = new Date().getTime();
			var delta = now - lastTimestamp;
			var pixel = delta / 1000 * pixelPerSecond;
			lastTimestamp = now; 
			lastSegmentDescriptor.width -= pixel;
			
			if(isNaN(lastSegmentDescriptor.width) || lastSegmentDescriptor.width <= 0){
				lastSegmentDescriptor.width = 0;
				lastSegmentIndex++;
			}

			var newCss = {
				'width': lastSegmentDescriptor.width
			};
			
			if(lastSegmentDescriptor.direction == 1){
				newCss['left'] = '+=' + pixel
			}
			lastSegmentDescriptor.segment.css(newCss);
			
			var spaces = Math.ceil((now - begin) / 1000 * self.pathResolutionVel);
			
			if(lastSegmentDescriptor.spaces < spaces){
				for(var i=lastSegmentDescriptor.spaces; i<spaces; i++){
					maze[path[i]].overpass(maze[path[i]]);
				}
				lastSegmentDescriptor.spaces = spaces;
			}
            
            self.requestAnimationFrame(resolveLoop);
        })(lastTimestamp);
		
	},
	
	requestAnimationFrame: function(callback) {
	    return  window.requestAnimationFrame        && window.requestAnimationFrame(callback)         ||
	            window.webkitRequestAnimationFrame  && window.webkitRequestAnimationFrame(callback)   ||
	            window.mozRequestAnimationFrame     && window.mozRequestAnimationFrame(callback)      ||
	            window.oRequestAnimationFrame       && window.mozRequestAnimationFrame(callback)      ||
	            window.msRequestAnimationFrame      && window.msRequestAnimationFrame(callback)       ||
	            window.setTimeout(callback, 1000 / 60);
	}
};