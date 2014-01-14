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

	this.reset();
};

LevelGUI.prototype.reset = function(){};

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

LevelGUI.prototype.animate = function(status) {
	var self = this;
	if(status.completed === false){
		LevelGUI.requestAnimationFrame(function(){self.animate(status);});
        TWEEN.update();
	}
};


LevelGUI.prototype.setGadgetSelected = function(gadget, selected){
	if(!gadget) return;
	
	var self = this;
	
	var start = {x: 0.7};
	var target = {x: 1};
	var customStatus = {completed: false};
	var tween = new TWEEN.Tween(start).to(target, 300);
	
	if(selected === true){
		if(gadget.attr('on') != '1'){
			gadget.attr('on', '1');
			
			tween.easing(TWEEN.Easing.Back.Out).onUpdate(function(){
				gadget.css({'-webkit-transform': 'scale(' + start.x + ')'});
			}).onComplete(function(){
				customStatus.completed = true;
				gadget.css({'-webkit-transform': 'scale(1)'});
			});
			tween.start();
			self.animate(customStatus);
		}
	} else {
		if(gadget.attr('on') == '1'){
			gadget.attr('on', '0');
			
			tween.easing(TWEEN.Easing.Back.Out).onUpdate(function(){
				gadget.css({'-webkit-transform': 'scale(' + (1.7-start.x) + ')'});
			}).onComplete(function(){
				customStatus.completed = true;
				gadget.css({'-webkit-transform': 'scale(0.7)'});
			});
			tween.start();
			self.animate(customStatus);
		}
	}
	
}

LevelGUI.prototype.setPlayButtonVisible = function(visible){
	var self = this;
	
	var start = {x: 0};
	var target = {x: 1};
	var customStatus = {completed: false};
	var tween = new TWEEN.Tween(start).to(target, 300);
	
	if(visible){
		if(self.playButton.attr('on') != '1'){
			self.playButton.attr('on', '1');
			
			tween.easing(TWEEN.Easing.Back.Out).onUpdate(function(){
				self.playButton.css({'-webkit-transform': 'scale(' + start.x + ')'});
			}).onComplete(function(){
				customStatus.completed = true;
				self.playButton.css({'-webkit-transform': 'scale(1)'});
			});
			tween.start();
			self.animate(customStatus);
		}
	} else {
		if(self.playButton.attr('on') == '1'){
			self.playButton.attr('on', '0');
			
			tween.easing(TWEEN.Easing.Back.In).onUpdate(function(){
				self.playButton.css({'-webkit-transform': 'scale(' + (1-start.x) + ')'});
			}).onComplete(function(){
				customStatus.completed = true;
				self.playButton.css({'-webkit-transform': 'scale(0)'});
			});
			tween.start();
			self.animate(customStatus);
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