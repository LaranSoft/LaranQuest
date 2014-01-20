var level7 = new Maze({
	size: [4, 4],
	spaces: [
		new Space(1, [1, 0], '0110', [0, 2, 5, 0], {free: false, gadget: new SealGadget()}),
		new Space(2, [1, 1], '0111', [0, 3, 6, 1]),
		new Space(3, [1, 2], '0111', [0, 4, 7, 2]),
		new Space(4, [1, 3], '0011', [0, 0, 8, 3]),
		new Space(5, [2, 0], '1110', [1, 6, 9, 0]),
		new Space(6, [2, 1], '1111', [2, 7, 10, 5], {free: false, gadget: new ForceDirectionGadget(1)}),
		new Space(7, [2, 2], '1111', [3, 8, 11, 6]),
		new Space(8, [2, 3], '1001', [4, 0, 0, 7]),
		new Space(9, [3, 0], '1100', [5, 10, 0, 0]),
		new Space(10, [3, 1], '1101', [6, 11, 0, 9]),
		new Space(11, [3, 2], '1001', [7, 0, 0, 10], {free: false, gadget: new SealGadget()})
	],
    objects: [
  	    {gadget: new StartGadget(), position: [0, 0]},
  	    {gadget: new ExitGadget(), position: [0, 1]}
  	]
});