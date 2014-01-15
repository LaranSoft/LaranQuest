var level5 = new Maze({
	size: [5, 3],
	spaces: [
	    new Space(1, [0, 2], '0010', [0, 0, 4, 0], {free: false, gadget: new ExitGadget()}),
	    new Space(2, [1, 0], '0110', [0, 3, 5, 0]),
	    new Space(3, [1, 1], '0111', [0, 4, 6, 2]),
	    new Space(4, [1, 2], '1011', [1, 0, 7, 3]),
	    new Space(5, [2, 0], '1110', [2, 6, 8, 0], {doors: [6]}),
	    new Space(6, [2, 1], '1111', [2, 7, 9, 5], {doors: [5, 9]}),
	    new Space(7, [2, 2], '1011', [4, 0, 10, 6]),
	    new Space(8, [3, 0], '1110', [5, 9, 11, 0]),
	    new Space(9, [3, 1], '1111', [6, 10, 12, 8], {free: false, gadget: new SealGadget(), doors: [6]}),
	    new Space(10, [3, 2], '1011', [7, 0, 13, 9], {free: false, gadget: new KeyGadget()}),
	    new Space(11, [4, 0], '1100', [8, 12, 0, 0], {free: false, gadget: new SealGadget()}),
	    new Space(12, [4, 1], '1101', [9, 13, 0, 11]),
	    new Space(13, [4, 2], '1001', [10, 0, 0, 12], {free: false, gadget: new SealGadget()})
	],
	doors: [
	    [5, 6],
	    [6, 9]
	],
    objects: [
  	    {gadget: new StartGadget(), position: [0, 0]}
  	]
});