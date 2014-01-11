var levelSelection = {
		
	stageCount: 2,
		
	render: function(container, lastStage){
		
		var containerW = container.width();
		var containerH = container.height();
		
		var max = containerW > containerH ? containerW : containerH;
		
		var padding = 10;
		var tilesPerLine = 5;
		var availableW = containerW - padding*(tilesPerLine+1);
		
		var tileDimension = Math.floor(availableW / tilesPerLine);
		
		var starDimension = tileDimension * 3 / 11;
		var starPadding = starDimension / 6;
		
		for(var i=0; i<this.stageCount; i++){
			
			var stage = $('<div id="stage' + (i+1) + '" class="stage" level="' + (i+1) + '">' + (i+1) + '</div>');
			
			stage.css({
				'height': tileDimension + 'px',
				'width': tileDimension + 'px',
				'border-radius': (tileDimension/5) + 'px',
				'font-size': (tileDimension) + 'px',
				'left': (padding + (i%(tilesPerLine)) * (tileDimension + padding)) + 'px',
				'top': (padding + Math.floor(i/tilesPerLine)  * (tileDimension + padding)) + 'px'
			});
			
			if(i >= lastStage){
				var lock = $('<img class="lock" src="resources/images/locked.png" draggable="false"></img>');
				lock.css({
					'bottom': (tileDimension / 10) + 'px',
					'left': (tileDimension / 10) + 'px',
					'height': (tileDimension * 4/5) + 'px',
					'width': (tileDimension * 4/5) + 'px'
				});
				stage.append(lock);
				
				if(i == lastStage){
					lock.attr('toUnlock', i);
					stage.attr('toActivate', '1');
				}
			} else {
				stage.addClass('active');
			}
			
			container.append(stage);
		}
		
		$('.stage').on('click', function(event){
			var $self = $(this);
			if($self.hasClass('active') && !$self.hasClass('visited')){
				$self.addClass('visited');
				var level = $self.attr('level');
				memory.save('levelSelected', level);
				$('#test').css({
					'left': '+=' + event.clientX + 'px',
					'top': '+=' + event.clientY + 'px',
					'z-index': 1000
				}).show().transition({
					'scale': 2,
					'rotate': 120
				}, 1200, 'linear', function(){
					$('#levelSelection').html('<div style="background-color: white;></div>"');
					$.mobile.changePage('level.html');
				});
			}
		});
		
		// calculate the max dimensions of the level-select animation div
		// TODO: this calculus can be done on the actual 'click' function to be more accurate
		$('#test').css({
			'width': (2*max) + 'px',
			'height': (2*max) + 'px',
			'border-radius': (2*max) + 'px'
		}).css({
			'left': (-max) + 'px',
			'top': (-max) + 'px'
		});
		
		$('#test .h').css({
			'width': (2/5*max) + 'px',
			'height': (12/5*max) + 'px',
		}).css({
			'left': (4/5*max) + 'px',
			'top': (-1/5*max) + 'px'
		});
		
		$('#test .v').css({
			'height': (2/5*max) + 'px',
			'width': (12/5*max) + 'px',
		}).css({
			'top': (4/5*max) + 'px',
			'left': (-1/5*max) + 'px'
		});
		
		var toUnlock = $('[toUnlock]');
		toUnlock.attr('src', 'resources/images/unlocked.png').transition({
			'scale': 3, 
			'opacity': 0, 
			'z-index': 100,
			'delay': 500
		}, 600, function(){
			toUnlock.remove();
			$('[toActivate=1]').addClass('active');
		});
	}	
};