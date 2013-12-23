var level2 = new Maze({
	character: 'warrior',  
	size: [3, 5],
	start: 1, 
	end: 7, 
	spaces: [
	    new Space([0, 0], '11000111', [0, 2, 0, 0]),
	    new Space([0, 1], '01000100', [0, 3, 0, 1]),
	    new ExpSpace([0, 2], '01110010', [0, 0, 4, 2], 1),
	    new ExpSpace([1, 2], '00010001', [3, 0, 5, 0], 2),
	    new ExpSpace([2, 2], '00100111', [4, 6, 0, 0], 3),
	    new Space([2, 3], '01000100', [0, 7, 0, 5]),
	    new ExitSpace([2, 4], '01111100', [0, 0, 0, 6])
	],
	triggers: {
    	'start': function(data){
    		this.trigger('startTurn');
    		this.trigger('select', {character: 'warrior'});
    	}
    }
});