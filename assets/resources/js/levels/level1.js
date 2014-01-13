var level1 = new Maze({
	size: [3, 3],
	spaces: [ 
	    new Space(1, [1, 0], '0110', [0, 2, 4, 0], {free: false, gadget: new SealGadget()}),
	    new Space(2, [1, 1], '0111', [0, 3, 5, 1]),
	    new Space(3, [1, 2], '0011', [0, 0, 6, 2], {free: false, gadget: new SealGadget()}),
	    new Space(4, [2, 0], '1100', [1, 5, 0, 0]),
	    new Space(5, [2, 1], '1101', [2, 6, 0, 4]),
	    new Space(6, [2, 2], '1001', [3, 0, 0, 5], {free: false, gadget: new ExitGadget()})
	],
	objects: [
	    {gadget: new StartGadget(), position: [0, 1]}
	]
});