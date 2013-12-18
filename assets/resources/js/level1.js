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

var starIndex = 0;
var starStatus = {};
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