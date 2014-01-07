var level1 = new Maze({
	size: [2, 3],
	spaces: [ 
	    new Space(1, [0, 0], '11000111', [0, 2, 0, 0]),
	    new Space(2, [0, 1], '01000100', [0, 3, 0, 1]),
	    new ExpSpace(3, [0, 2], '01000100', [0, 4, 0, 2], 1),
	    new ExpSpace(4, [1, 0], '01000100', [0, 5, 0, 3], 2),
	    new ExpSpace(5, [1, 1], '01000100', [0, 6, 0, 4], 3),
	    new ExitSpace(6, [1, 2], '01111100', [0, 0, 0, 5])
	],
	objects: {
	    'start': {}
	},
    tutorials: {
    	'stars': new Tutorial('threeStarsTutorial', 'stars', 'In each stage there are three stars. Try to collect them all.')
    },
    triggers: {
    	'start': function(data){
    		this.showTutorial(['stars']);
    	}
    }
});