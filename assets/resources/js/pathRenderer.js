var pathRenderer = {
		
	css: {
		'background-color': '#f36d0a',
		'border-style': 'solid',
		'border-width': '0px',
		'z-index': 400,
		'opacity': 1
	},
		
	startRadiusPercentage: 10,
	lastDirection: -1,
	
	segments: [],
	activeSegment: null,
	
	destroyPath: function(){
		for(var i=0; i<this.segments.length; i++){
			this.segments[i].remove();
		}
		this.segments.splice(0, this.segments.length);
		
		this.activeSegment = null;
	},
		
	render: function(path, maze, container, caseSize){
		
		if(path.length == 1){
			// destroy the old path
			this.destroyPath();
			
			var position = maze.spaces[path[0]].position;
			
			this._beginSegment(position, caseSize, container);
			
		} else {
		
			var direction = maze.getDirection(path[path.length-2], path[path.length-1]);
			
			if(direction == -1){
				
				var position = maze.spaces[path[path.length-2]].position;
				this._beginSegment(position, caseSize, container);
				
			} else {
			
				// check if this is the very first step or a step that changes direction
				if(this.lastDirection != -1 && direction != this.lastDirection){
					var position = maze.spaces[path[path.length-2]].position;
					this._beginSegment(position, caseSize, container);
				}
			
				var isBackwardStep = direction == 0 || direction == 3;
				var isVerticalStep = direction == 0 || direction == 2;
				
				var firstValue = 0, secondValue = 0, segmentChanges = {};
				if(isVerticalStep){
					firstValue = caseSize; 
				} else {
					secondValue = caseSize;
				}
				
				if(isBackwardStep){
					segmentChanges['top'] = '-=' + firstValue + 'px';
					segmentChanges['left'] = '-=' + secondValue + 'px';
				}
				segmentChanges['height'] = '+=' + firstValue + 'px';
				segmentChanges['width'] = '+=' + secondValue + 'px';
				
				this.activeSegment.css(segmentChanges);
				
				this.lastDirection = direction;
			}
		}
	},
	
	_beginSegment: function(position, caseSize, container){
		
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
		
		// store the newly created segment as the active segment 
		this.activeSegment = segment;
		
		// update the lastDirection
		this.lastDirection = -1;
		
		// append the segment to the container
		container.append(segment);
	}
};