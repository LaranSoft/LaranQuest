var pathRenderer = {
		
	css: {
		//'background-image': '-webkit-linear-gradient(#f1a165, #f36d0a)',
		'background-color': '#f36d0a',
		'border-style': 'solid',
		'border-width': '0px',
		'z-index': 400,
		'opacity': 1
	},
		
	segments: [],
		
	startRadiusPercentage: 10,
	pathResolutionVel: 20, // spaces per second
		
	render: function(path, maze, container, caseSize){
		
		this.destroyPath();
		
		// check if path consist of a single space
		if(path.length == 1){
			
			// if so, simply render a circle over the space
			var position = maze.spaces[path[0]].position;
			
			// calculate the segment offset
			var segmentDimensions = {
				'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
				'border-radius': 2 * caseSize * this.startRadiusPercentage / 100,
				'height': 2 * caseSize * this.startRadiusPercentage / 100,
				'width': 2 * caseSize * this.startRadiusPercentage / 100
			};
			
			// construct the segment
			var segment = $('<div class="absolute" pd="width" pdv="' + segmentDimensions['width'] + '"></div>');
			
			// apply the css rules
			segment.css(this.css);
			segment.css(segmentDimensions);
			
			// store the segment for future deletion
			this.segments.push(segment);
			
			// append the segment to the container
			container.append(segment);
		} else {
			var directions = [];
			for(var i=0; i<path.length-1; i++){
				directions.push(maze.getDirection(path[i], path[i+1]));
			}
			
			var index = 0;
			while(index < directions.length){
				var direction = directions[index];
				
				if(direction == -1) {
					index++;
					continue;
				}
				
				for(i=index+1; i<directions.length; i++){
					if(directions[i] != direction) break;
				}
				
				var segmentLength = i - index;

				var startSegment = (direction == 0 || direction == 3) ? i : index;
				var position = maze.spaces[path[startSegment]].position;
				var isVerticalSegment = direction == 0 || direction == 2;
				
				var segmentDimensions = {
					'top': (position[0] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
					'left': (position[1] * caseSize) + (caseSize / 2) - (caseSize * this.startRadiusPercentage / 100),
					'border-radius': caseSize * this.startRadiusPercentage / 100,
					'height': 2 * caseSize * this.startRadiusPercentage / 100,
					'width': segmentLength * caseSize + (2 * caseSize * this.startRadiusPercentage / 100)
				};

				var principalDimension = 'width'; 
				var principalDimensionValue = segmentDimensions[principalDimension];
				
				if(isVerticalSegment){
					principalDimension = 'height';
					var swap = segmentDimensions['height'];
					segmentDimensions['height'] = segmentDimensions['width'];
					segmentDimensions['width'] = swap;
					principalDimensionValue = segmentDimensions[principalDimension];
				}
				
				var segment = $('<div class="absolute" pd="' + principalDimension + '" pdv="' + principalDimensionValue + '" d="' + direction + '"></div>');
				
				segment.css(this.css);
				segment.css(segmentDimensions);
				
				this.segments.push(segment);
				
				container.append(segment);
				
				index = i;
			}
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
		lastSegmentDescriptor['pd'] = lastSegmentDescriptor.segment.attr('pd');
		lastSegmentDescriptor['pdv'] = lastSegmentDescriptor.segment.attr('pdv');
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
				lastSegmentDescriptor['pd'] = lastSegmentDescriptor.segment.attr('pd');
				lastSegmentDescriptor['pdv'] = lastSegmentDescriptor.segment.attr('pdv');
				lastSegmentDescriptor['direction'] = lastSegmentDescriptor.segment.attr('d');
			}
			
			var now = new Date().getTime();
			var delta = now - lastTimestamp;
			var pixel = delta / 1000 * pixelPerSecond;
			lastTimestamp = now; 
			lastSegmentDescriptor.pdv -= pixel;
			
			if(isNaN(lastSegmentDescriptor.pdv) || lastSegmentDescriptor.pdv <= 0){
				lastSegmentDescriptor.pdv = 0;
				lastSegmentIndex++;
			}

			var newCss = {};
			newCss[lastSegmentDescriptor['pd']] = lastSegmentDescriptor.pdv;
			
			if(lastSegmentDescriptor.direction == 1){
				newCss['left'] = '+=' + pixel
			} else if(lastSegmentDescriptor.direction == 2){
				newCss['top'] = '+=' + pixel
			}
			lastSegmentDescriptor.segment.css(newCss);
			
			var spaces = Math.ceil((now - begin) / 1000 * self.pathResolutionVel);
			
			if(spaces > path.length) spaces = path.length;
			
			if(lastSegmentDescriptor.spaces < spaces){
				for(var i=lastSegmentDescriptor.spaces; i<spaces; i++){
					maze.spaces[path[i]].overpass({
						maze: maze,
						status: maze.status,
						space: maze.spaces[path[i]], 
						levelGUI: maze.levelGUI
					});
				}
				lastSegmentDescriptor.spaces = spaces;
			}
            
            LevelGUI.requestAnimationFrame(resolveLoop);
        })(lastTimestamp);
	}
};