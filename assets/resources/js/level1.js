var level1 = new Maze({
	character: 'warrior',  
	size: [5, 6],
	start: 1, 
	end: 6, 
	spaces: [ 
	    new Space([2, 0], '11000111', [0, 2, 0, 0]),
	    new Space([2, 1], '01000100', [0, 3, 0, 1]),
	    new ExpSpace([2, 2], '01000100', [0, 4, 0, 2], 1),
	    new ExpSpace([2, 3], '01000100', [0, 5, 0, 3], 2),
	    new ExpSpace([2, 4], '01000100', [0, 6, 0, 4], 3),
	    new ExitSpace([2, 5], '01111100', [0, 0, 0, 5])
	],
	labels: [
	    new Label([0, 0], [2, 3], 'YouAreHere'),
	    new Label([0, 4], [2, 2], 'Exit'),
	    new Label([3, 0], [2, 6], 'SlideYourFingerToMove')
    ],
    statusModifier: {			
		characters: {warrior: {remainingMovements: NaN}}
    },
    GUISettings: {
    	showRemainingMovements: false,
    	showRemainingHealth: false
    }
});