function LevelGUI(options){
	
	var self = this;
	
	var defaultOptions = {};
	
	options = $.extend({}, defaultOptions, options);
	
	this.$body = $('#level');
	this.playButton = $('#playButton');
	this.playButton.on('click', function(){
		if(self.playButton.attr('on') == '1'){
			self.setPlayButtonVisible(false);
			self.maze.trigger('startPath');
		}
	});
	
	$('#mainMenuBtn').on('click', function(){
		if(!$('#mainMenuBtn').hasClass('clicked')){
			$('#mainMenuBtn').addClass('clicked');
			$.mobile.changePage('levelSelection.html');
		}
	});
	
	$('#resetBtn').on('click', function(){
		if(!$('#resetBtn').hasClass('clicked')){
			$('#resetBtn').addClass('clicked');
			self.maze.trigger('reload');
		}
	});

	this.reset();
};

LevelGUI.prototype.reset = function(){
	$('#resetBtn').removeClass('clicked');
};

LevelGUI.requestAnimationFrame = function(callback) {
    return  window.requestAnimationFrame && window.requestAnimationFrame(callback)         ||
    window.webkitRequestAnimationFrame   && window.webkitRequestAnimationFrame(callback)   ||
    window.mozRequestAnimationFrame      && window.mozRequestAnimationFrame(callback)      ||
    window.oRequestAnimationFrame        && window.mozRequestAnimationFrame(callback)      ||
    window.msRequestAnimationFrame       && window.msRequestAnimationFrame(callback)       ||
    window.setTimeout(callback, 1000 / 60);
};

LevelGUI.prototype.setMaze = function(maze){
	this.maze = maze;
};


LevelGUI.prototype.setGadgetSelected = function(gadget, selected){
	if(!gadget) return;
	
	var self = this;
	
	if(selected === true){
		if(gadget.attr('on') != '1'){
			gadget.attr('on', '1').removeClass('unselected').addClass('selected');
		}
	} else {
		if(gadget.attr('on') == '1'){
			gadget.attr('on', '0').removeClass('selected').addClass('unselected');
		}
	}
	
}

LevelGUI.prototype.setPlayButtonVisible = function(visible){
	var self = this;
	
	if(visible){
		if(self.playButton.attr('on') != '1'){
			self.playButton.attr('on', '1').removeClass('animateHide').addClass('animateShow');
		}
	} else {
		if(self.playButton.attr('on') == '1'){
			self.playButton.attr('on', '0').removeClass('animateShow').addClass('animateHide');
		}
	}
};

LevelGUI.prototype.showTutorial = function(tutorial, callback){
	var self = this;
	
	var blockMask = $('<div id="blockMask" class="absolute tutorialContainer"></div>');
	
	this.$body.append(blockMask);
	$('.scenicElement').each(function(index, element){
		$(element).attr('oldZIndex', $(element).css('z-index')).css('z-index', 'auto');
	});
	blockMask.transition({
		'opacity': 0.9
	}, 600, function(){
		
		var availableW = self.$body.width();
		
		var padding = 10;
		availableW -= 2*padding;
		
		var imageW = availableW / 3;
		
		var paragraph = $('<p class="tutorialParagraph" style="font-size: ' + (imageW / 3) + 'px;"></p>');
		
		var image = $('<img class="tutorialImage" src="resources/images/tutorials/' + tutorial.image + '.png" width="' + imageW + '" height="' + imageW + '"/>');
		paragraph.append(image);
		paragraph.append(tutorial.text);
		blockMask.append(paragraph);
		
		var okButton = $('<button data-role="button" data-theme="a">I got it</button>');
		blockMask.append(okButton);
		okButton.button();
		
		okButton.on('click', function(){
			blockMask.transition({
				'opacity': 0
			}, 600, function(){
				blockMask.remove();
				$('.scenicElement').each(function(index, element){
					$(element).css('z-index', $(element).attr('oldZIndex')).removeAttr('oldZIndex');
				});
				callback();
			});
		})
	});
};

LevelGUI.prototype.completeLevel = function(){
	
	var self = this;
	
	var lastStage = Number(memory.load('lastStage'));
	var levelSelected = Number(memory.load('levelSelected'));
	
	if(levelSelected - lastStage == 1){
		memory.save('lastStage', lastStage+1);
	}
	
	self.playButton.hide();
	
	//$.mobile.changePage('levelSelection.html');
	//window['level' + levelSelected] = null;
	//loader.unloadScript('resources/js/levels/level' + levelSelected + '.js');
	
	var okButton = $('<a id="nextLevelBtn" class="levelSummaryElement" href="levelSelection.html" data-role="button" data-theme="a">Next</a>');
	$('#bottom').append(okButton);
	okButton.button();
};

LevelGUI.setRect = function($el, top, left, width, height){
	$el.css({
		'top': Math.floor(top),
		'left': Math.floor(left),
		'width': Math.floor(width),
		'height': Math.floor(height)
	});
};