var maze = {
	character: 'warrior',
	start: 1,
	end: 6,
	size: [5, 6],
	'1': new Space([2, 0], '11000111', [0, 2, 0, 0]),
	'2': new Space([2, 1], '01000100', [0, 3, 0, 1]),
	'3': new Space([2, 2], '01000100', [0, 4, 0, 2], ['exp'], {onEnter: function(space){addStar(1); space.$el.exp.transition({'scale': 3, 'opacity': 0, 'z-index': 100}, 600, function(){space.$el.exp.remove();})}}),
	'4': new Space([2, 3], '01000100', [0, 5, 0, 3], ['exp'], {onEnter: function(space){addStar(2); space.$el.exp.transition({'scale': 3, 'opacity': 0, 'z-index': 100}, 600, function(){space.$el.exp.remove();})}}),
	'5': new Space([2, 4], '01000100', [0, 6, 0, 4], ['exp'], {onEnter: function(space){addStar(3); space.$el.exp.transition({'scale': 3, 'opacity': 0, 'z-index': 100}, 600, function(){space.$el.exp.remove();})}}),
	'6': new Space([2, 5], '01111100', [0, 0, 0, 5], null, {onEnter: function(){completeLevel();}}),
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
				var okButton = $('<a class="absolute levelSummaryElement" style="top: ' + (padding + 4*cellH) + 'px;" href="#tutorialPage" data-role="button" data-theme="a">Ok</a>');
				body.append(okButton);
				okButton.button();
				okButton.css('left', (2*padding + 2*cellW - okButton.width()/2) + 'px');
			}
		};
		setTimeout(progressBarRun, 500);
				
	});
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
							cas.exp = $('<img class="token exp" src="resources/images/exp.png" style="width: ' + (caseSize*expTokenPadding) + 'px; height: ' + (caseSize*expTokenPadding) + 'px; top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>');
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
			manageTouchOnlyEvents: isMobile,
			cssEaseDuration: 0,
			velocityMultiplier: 0,
			allowDragEventPropagation: false,
			initiate: function(){
				var start = maze[actualPosition].startSimulation();
				path = [actualPosition];
				lastValidDragPosition = actualPosition;
				actualDragPosition = actualPosition;
				isSimulationValid = true;
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
				if(isValidEvent(event)){
					
					// get the x and y coordinates of the event
					var clientCoord = getClientCoord(event);
					var clientX = clientCoord.x;
					var clientY = clientCoord.y;
					
					// verify if the user is in the maze area
					if(mazeOffset.left > clientX || clientX > mazeOffset.right || mazeOffset.top > clientY || clientY > mazeOffset.bottom){
						
						//#LOG#console.log('out of maze: clientX:' + clientX + ' clientY:' + clientY);
						
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
						
						// verify if the user is over a space
						if(targetPosition){
							
							// verify if the overed space different from the space over which was the last time
							if(targetPosition != lastValidDragPosition){
								// calculate the path from the actual position and the target position
								var localPath = maze.calculatePath(lastValidDragPosition, targetPosition);
								
								// check if such path exist
								if(localPath.length > 0){
									for(var i=0; i<localPath.length; i++){
										var enteringDirection = localPath[i] - 1;
										
										//#LOG#console.log('exiting from ' + lastValidDragPosition + ', direction: ' + enteringDirection);
										
										var step = maze[lastValidDragPosition].onSimulatedExit(enteringDirection);
										if(step.canExit == true){
											
											targetPosition = maze[lastValidDragPosition].adiacents[enteringDirection];
											
											//#LOG#console.log('entering in ' + targetPosition + ', direction: ' + enteringDirection);
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
							} else {
								// the user is over the same space over which was the last time
								// in this case we need an update only if the path was invalid
								if(actualDragPosition == 0) {
									actualDragPosition = lastValidDragPosition;
								}
							}
						} else {
							// the user is in the maze area but he is not over a space
							actualDragPosition = 0;
						}
					}
					
					if(actualDragPosition == 0){ // il giocatore sta draggando il token in una posizione non valida
						for(var i=0; i<path.length; i++){
							maze[path[i]].setSimulationInvalid();
						}
						isSimulationValid = false;
					} else { // il giocatore sta draggando il token in una posizione valida
						for(var i=0; i<path.length; i++){
							maze[path[i]].setSimulationValid();
						}
						isSimulationValid = true;
					}
				}
			},
			stop: function(event){
				for(var i=0; i<path.length; i++){
					maze[path[i]].onSimulatedEnd(isSimulationValid);
				}
				
				if(actualDragPosition != 0){
					actualPosition = actualDragPosition;
				}
				var tokenTop = maze[actualPosition].position[0] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
				var tokenLeft = maze[actualPosition].position[1] * caseSize + (caseSize * (1 - characterTokenPadding) / 2);
				
				if(isSimulationValid){
					//remainingMovements -= (path.length - 1);
					maze[path[0]].onExit(maze, path, 0, 30);
				}
				
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
		maze.trigger('start');
	}
}