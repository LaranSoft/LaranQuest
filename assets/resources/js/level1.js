var level1 = new Maze({
	size: [2, 3],
	spaces: [ 
	    new Space(1, [0, 0], '0110', [0, 2, 4, 0], false),
	    new Space(2, [0, 1], '0111', [0, 3, 0, 1], false),
	    new Space(3, [0, 2], '0011', [0, 4, 0, 2], true),
	    new Space(4, [1, 0], '1100', [0, 5, 0, 3], true),
	    new Space(5, [1, 1], '1101', [0, 6, 0, 4], false),
	    new ExitSpace(6, [1, 2], '1001', [0, 0, 0, 5])
	],
	objects: {
	    'start': {name: 'start', value: true}
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