var level1 = new Maze({
	size: [3, 3],
	spaces: [ 
	    new Space(1, [1, 0], '0110', [0, 2, 4, 0], false, 'seal'),
	    new Space(2, [1, 1], '0111', [0, 3, 5, 1], true),
	    new Space(3, [1, 2], '0011', [0, 0, 6, 2], false, 'seal'),
	    new Space(4, [2, 0], '1100', [1, 5, 0, 0], true),
	    new Space(5, [2, 1], '1101', [2, 6, 0, 4], true),
	    new ExitSpace(6, [2, 2], '1001', [3, 0, 0, 5])
	],
	objects: [
	    {gadget: new StartGadget(), position: [0, 1]}
	],
    tutorials: {
    	'stars': new Tutorial('threeStarsTutorial', 'stars', 'In each stage there are three stars. Try to collect them all.')
    },
    triggers: {
    	'start': function(data){
    		this.showTutorial(['stars']);
    	}
    }
});