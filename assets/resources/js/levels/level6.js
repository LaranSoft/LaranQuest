var level6 = new Maze({
	size: [5, 4],
	spaces: [
		new Space(1, [1, 0], '0110', [0, 2, 5, 0]),
		new Space(2, [1, 1], '0111', [0, 3, 6, 1]),
		new Space(3, [1, 2], '0111', [0, 4, 7, 2], {free: false, gadget: new LifeGadget(1), doors: [4]}),
		new Space(4, [1, 3], '0011', [0, 0, 8, 3], {free: false, gadget: new KeyGadget(), doors: [3]}),
		new Space(5, [2, 0], '1110', [1, 6, 9, 0]),
		new Space(6, [2, 1], '1111', [2, 7, 10, 5]),
		new Space(7, [2, 2], '1111', [3, 8, 11, 6], {free: false, gadget: new SealGadget()}),
		new Space(8, [2, 3], '1011', [4, 0, 12, 7]),
		new Space(9, [3, 0], '1110', [5, 10, 13, 0]),
		new Space(10, [3, 1], '1111', [6, 11, 14, 9], {free: false, gadget: new LifeGadget(1)}),
		new Space(11, [3, 2], '1111', [7, 12, 15, 10]),
		new Space(12, [3, 3], '1011', [8, 0, 16, 11], {free: false, gadget: new SealGadget()}),
		new Space(13, [4, 0], '1100', [9, 14, 0, 0], {free: false, gadget: new DamageGadget(1)}),
		new Space(14, [4, 1], '1101', [10, 15, 0, 13]),
		new Space(15, [4, 2], '1101', [11, 16, 0, 14], {free: false, gadget: new SealGadget()}),
		new Space(16, [4, 3], '1001', [12, 0, 0, 15], {free: false, gadget: new DamageGadget(1)})
	],
	doors: [
	    [3, 4]
	],
    objects: [
  	    {gadget: new StartGadget(), position: [0, 0]},
  	    {gadget: new ExitGadget(), position: [0, 1]}
  	]
});