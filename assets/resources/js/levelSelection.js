var levelSelection = {
	render: function(container){
		
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
		
		var w = container.width();
		var h = container.width();
		
		var max = w > h ? w : h;
		
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