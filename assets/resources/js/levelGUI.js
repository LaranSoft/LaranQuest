function LevelGUI(level){
	this.$remainingMovements = $('#remainingMovements'); 
	this.$star1 = $('#star1');
	this.$star2 = $('#star2');
	this.$star3 = $('#star3');
	this.$body = $('#level' + level);
	
	this.star1 = false;
	this.star2 = false;
	this.star3 = false;
};

LevelGUI.requestAnimationFrame = function(callback) {
    return  window.requestAnimationFrame        && window.requestAnimationFrame(callback)         ||
    window.webkitRequestAnimationFrame  && window.webkitRequestAnimationFrame(callback)   ||
    window.mozRequestAnimationFrame     && window.mozRequestAnimationFrame(callback)      ||
    window.oRequestAnimationFrame       && window.mozRequestAnimationFrame(callback)      ||
    window.msRequestAnimationFrame      && window.msRequestAnimationFrame(callback)       ||
    window.setTimeout(callback, 1000 / 60);
};

LevelGUI.prototype.setMaze = function(maze){
	this.maze = maze;
};

LevelGUI.prototype.starStatus = {};

LevelGUI.prototype.addStar = function(index){
	if(this['star' + index] === false){
		this['star' + index] = true;
		this['$star' + index].addClass('taken');
	}
};

LevelGUI.prototype.completeLevel = function(){
	
	var self = this;
	
	var blockMask = $('<div id="blockMask" class="absolute"></div>');
	
	this.$body.append(blockMask);
	$('.scenicElement').remove();
	blockMask.animate({
		'opacity': 0.9
	}, 600, function(){
		var availableH = self.$body.height();
		var availableW = self.$body.width();
		
		var padding = 10;
		
		availableH -= 2*padding;
		availableW -= 2*padding;
		
		var cellW = availableW / 4;
		var cellH = availableH / 5;
		
		var maxFitSquareSize = cellW > cellH ? cellH : cellW; 
		
		var tokenTop = padding + (cellH - maxFitSquareSize)/2;
		var tokenLeft = padding + (cellW - maxFitSquareSize)/2;
		var token = $('<img class="token levelSummaryElement" src="resources/images/' + self.maze.character + '.png" width="' + (maxFitSquareSize) + '" height="' + (maxFitSquareSize) + '" style="top: ' + tokenTop + 'px; left: ' + tokenLeft + 'px;"/>')
		self.$body.append(token);
		
		var levelLabelContainer = $('<div class="absolute levelSummaryElement" style="color: white; font-size: ' + (maxFitSquareSize/2) + 'px; top: ' + padding + 'px; left: ' + (padding + cellW) + 'px; width: ' + (3*cellW) + 'px; height: ' + (cellH) + 'px;"></div>');
		var levelLabel = $('<span class="absolute levelSummaryElement" style="height: ' + (maxFitSquareSize/2 + 20) + 'px; line-height: ' + (maxFitSquareSize/2 + 20) + 'px; top: ' + (cellH/2 - (maxFitSquareSize/4 + 10)) + 'px; left: 25px;">Level <span id="level" class="levelSummaryElement">1</span></span>');
		levelLabelContainer.append(levelLabel);
		self.$body.append(levelLabelContainer);
		
		var progressBarMaxValue = 20;
		var progressBarWidth = 4*cellW;
		var progressBarValue = 0;
		var progressBarStep = progressBarWidth / progressBarMaxValue;
		
		var progressBarContainer = $('<div class="absolute levelSummaryElement" style="top: ' + (padding + cellH) + 'px; left: ' + (padding) + 'px; width: ' + (4*cellW) + 'px; height: ' + (cellH) + 'px;"></div>');
		var progressBarWrapper = $('<div class="progressBarContainer absolute levelSummaryElement" style="width: ' + (progressBarWidth) + 'px; height: 24px; top: 25px; left: 0px;"></div>');
		var progressBar = $('<span class="progressBar absolute levelSummaryElement" style="width: 0px; left: 2px; top: 2px; height: 20px;"></span>');
		progressBarWrapper.append(progressBar);
		progressBarContainer.append(progressBarWrapper);
		self.$body.append(progressBarContainer);
		
		var star = $('<img class="absolute levelSummaryElement" src="resources/images/exp.png" width="' + (maxFitSquareSize) + '" height="' + (maxFitSquareSize) + '" style="top: ' + (tokenTop + 3*cellH) + 'px; left: ' + tokenLeft + 'px;"></img>');
		self.$body.append(star);
		
		var starPointsValue = self.maze.status.starNumber * 10;
		var starPointsContainer = $('<div class="absolute levelSummaryElement" style="color: white; font-size: ' + (maxFitSquareSize/2) + 'px; top: ' + (padding + 3*cellH) + 'px; left: ' + (padding + cellW) + 'px; width: ' + (3*cellW) + 'px; height: ' + (cellH) + 'px;"></div>');
		var starPoints = $('<span class="absolute levelSummaryElement" style="height: ' + (maxFitSquareSize/2 + 20) + 'px; line-height: ' + (maxFitSquareSize/2 + 20) + 'px; top: ' + (cellH/2 - (maxFitSquareSize/4 + 10)) + 'px; left: 25px;"> x ' + self.maze.status.starNumber + '  = <span id="starPoints" class="levelSummaryElement">' + (starPointsValue) + '</span></span>');
		starPointsContainer.append(starPoints);
		self.$body.append(starPointsContainer);

		// memory forse può essere passata come parametro
		var stages = memory.load('stages');
		if(isNaN(stages[0].stars) || stages[0].stars < self.maze.status.starNumber){
			stages[0].stars = self.maze.status.starNumber;
		}
		if(stages[1].locked === true){
			stages[1].toUnlock = true;
		}
		memory.save('stages', stages);
		
		var onLevelUp = function(){
			progressBarMaxValue = 30;
			progressBarStep = progressBarWidth / progressBarMaxValue;
			$('#level').text('2').css('color', 'green');
		};
		
		var progressBarRun = new TWEEN.Tween({x: starPointsValue})
			.to({x: 0}, 5000)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function(){
				var remainedStarPoints = Math.floor(this.x);
				var delta = starPointsValue - remainedStarPoints;
				$('#starPoints').text(remainedStarPoints);
				
				progressBarValue += delta;
				if(progressBarValue > progressBarMaxValue){
					onLevelUp();
					progressBarValue -= progressBarMaxValue;
				}
				progressBar.css('width', progressBarValue * progressBarStep);
	        })
	        .delay(500)
	        .onComplete(function(){
	        	var okButton = $('<a class="absolute levelSummaryElement" style="top: ' + (padding + 4*cellH) + 'px;" href="levelSelection.html" data-role="button" data-theme="a">Ok</a>');
				self.$body.append(okButton);
				okButton.button();
				okButton.css('left', (2*padding + 2*cellW - okButton.width()/2) + 'px');
	        })
	        .start();
		
		function animate(){
			LevelGUI.requestAnimationFrame(animate);
			TWEEN.update();
		};
		
		animate();
	});
};