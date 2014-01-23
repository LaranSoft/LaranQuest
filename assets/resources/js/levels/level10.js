var level10 = new Maze({
	size: [5, 4],
	spaces: [
	    new Space(1, [1, 0], '0110', [0, 2, 4, 0], {free: false, gadget: new DamageGadget(1)}),
		new Space(2, [1, 1], '0111', [0, 3, 5, 1]),
		new Space(3, [1, 2], '0011', [0, 0, 6, 2]),
		new Space(4, [2, 0], '1110', [1, 5, 8, 0]),
		new Space(5, [2, 1], '1111', [2, 6, 9, 4], {free: false, gadget: new LifeGadget(1)}),
		new Space(6, [2, 2], '1111', [3, 7, 10, 5]),
		new Space(7, [2, 3], '0011', [0, 0, 11, 6]),
		new Space(8, [3, 0], '1100', [4, 9, 0, 0], {free: false, gadget: new ForceDirectionGadget(0)}),
		new Space(9, [3, 1], '1111', [5, 10, 12, 8]),
		new Space(10, [3, 2], '1111', [6, 11, 13, 9]),
	    new Space(11, [3, 3], '1001', [7, 0, 0, 10]),
	    new Space(12, [4, 1], '1100', [9, 13, 0, 0]),
	    new Space(13, [4, 2], '1001', [10, 0, 0, 12])
	],
    objects: [
  	    {gadget: new StartGadget(), position: [0, 0]},
  	    {gadget: new ExitGadget(), position: [0, 1]}
  	]
});