var level1 = new Maze({
	size: [3, 3],
	spaces: [ 
	    new Space(1, [1, 0], '0110', [0, 2, 4, 0], false, null, 'seal'),
	    new Space(2, [1, 1], '0111', [0, 3, 5, 1], true, null),
	    new Space(3, [1, 2], '0011', [0, 0, 6, 2], false, null, 'seal'),
	    new Space(4, [2, 0], '1100', [1, 5, 0, 0], true, null),
	    new Space(5, [2, 1], '1101', [2, 6, 0, 4], true, null),
	    new ExitSpace(6, [2, 2], '1001', [3, 0, 0, 5])
	],
	objects: [
	    {gadget: new StartGadget(), position: [0, 1]}
	]
});