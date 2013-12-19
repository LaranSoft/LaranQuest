var levelSelection = {
		
	stageCount: 2,
		
	render: function(container, model){
		
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
			
			var stageStatus = model[i];
			
			var stage = $('<div id="stage' + (i+1) + '" class="stage active" level="' + (i+1) + '">' + (i+1) + '</div>');
			
			var stars = []; 
			
			for(var j=0; j<3; j++){
				var src = 'starVoid.png';
				if(stageStatus.stars > j){
					src = 'exp.png';
				}
				stars.push($('<img class="star" src="resources/images/' + src + '" draggable="false"></img>'));
			}
			
			stage.css({
				'height': tileDimension + 'px',
				'width': tileDimension + 'px',
				'border-radius': (tileDimension/5) + 'px',
				'font-size': (tileDimension*7/10) + 'px',
				'left': (padding + (i%(tilesPerLine)) * (tileDimension + padding)) + 'px',
				'top': (padding + Math.floor(i/tilesPerLine)  * (tileDimension + padding)) + 'px'
			});
			
			for(var j=0; j<stars.length; j++){
				var star = stars[j];
				star.css({
					'height': starDimension + 'px',
					'width': starDimension + 'px',
					'left': starPadding + j*(starDimension + starPadding) + 'px'
				});
				stage.append(star);
			}

			if(stageStatus.locked === true){
				var lock = $('<img class="lock" src="resources/images/locked.png" draggable="false"></img>');
				lock.css({
					'bottom': (tileDimension / 10) + 'px',
					'left': (tileDimension / 10) + 'px',
					'height': (tileDimension * 4/5) + 'px',
					'width': (tileDimension * 4/5) + 'px'
				});
				stage.append(lock);
				
				if(stageStatus.toUnlock === true){
					// TODO trasformare in requestAnimFrame e stare attenti alle variabili
					setTimeout(function(){
						lock.attr('src', 'resources/images/unlocked.png').transition({
							'scale': 3, 
							'opacity': 0, 
							'z-index': 100
						}, 600, function(){
							lock.remove();
							stage.addClass('active');
							stageStatus.locked = false;
							delete stageStatus.toUnlock;
							memory.save('stages', model);
						});
					}, 1000);
				}
			}
			
			container.append(stage);
		}
		
		$('.stage').on('click', function(event){
			var $self = $(this);
			if($self.hasClass('active')){
				$self.addClass('visited');
				$('#test').css({
					'left': '+=' + event.clientX + 'px',
					'top': '+=' + event.clientY + 'px',
					'z-index': 1000
				}).show().transition({
					'scale': 2,
					'rotate': 120
				}, 1200, 'linear', function(){
					var level = $self.attr('level');
					$.mobile.changePage('level' + level + '.html');
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
	
//			$('#stage2lock').attr('src', 'resources/images/unlocked.png').transition({
//				'scale': 3, 
//				'opacity': 0, 
//				'z-index': 100
//			}, 600, function(){
//				$('#stage2lock').remove();
//				$('#stage2').addClass('active');
//			});
		
	}	
};