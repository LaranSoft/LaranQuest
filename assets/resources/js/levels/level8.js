var level8 = new Maze({
	size: [6, 5],
	spaces: [
	    new Space(1, [1, 0], '0110', [0, 2, 6, 0], {free: false, gadget: new LifeGadget(1)}),
		new Space(2, [1, 1], '0111',  [0, 3, 7, 1]),
		new Space(3, [1, 2], '0121',  [0, 4, 0, 2]),
		new Space(4, [1, 3], '0111',  [0, 5, 8, 3]),
		new Space(5, [1, 4], '0011',  [0, 0, 9, 4]),
		new Space(6, [2, 0], '1110',  [1, 7, 10, 0]),
		new Space(7, [2, 1], '1211',  [2, 0, 11, 6]),
		new Space(8, [2, 3], '1112',  [4, 9, 13, 0]),
		new Space(9, [2, 4], '1011',  [5, 0, 14, 8], {free: false, gadget: new LifeGadget(1)}),
		new Space(10, [3, 0], '1110',  [6, 11, 15, 0]),
		new Space(11, [3, 1], '1111',  [7, 12, 16, 10], {free: false, gadget: new BowTrapGadget()}),
		new Space(12, [3, 2], '2111',  [0, 13, 17, 11]),
		new Space(13, [3, 3], '1101',  [8, 14, 0, 12]),
		new Space(14, [3, 4], '1011',  [9, 0, 18, 13]),
		new Space(15, [4, 0], '1110',  [10, 16, 19, 0]),
		new Space(16, [4, 1], '1111',  [11, 17, 20, 15], {free: false, gadget: new ExitGadget()}),
		new Space(17, [4, 2], '1011',  [12, 0, 21, 16]),
		new Space(18, [4, 4], '1010',  [14, 0, 22, 0]),
		new Space(19, [5, 0], '1100',  [15, 20, 0, 0]),
		new Space(20, [5, 1], '1101',  [16, 21, 0, 19], {free: false, gadget: new BowTrapGadget()}),
		new Space(21, [5, 2], '1001',  [17, 0, 0, 20]),
		new Space(22, [5, 4], '1000',  [18, 0, 0, 0])
	],
    objects: [
  	    {gadget: new TeleportGadget(1), position: [0, 0]},
  	    {gadget: new TeleportGadget(1), position: [0, 1]},
  	    {gadget: new StartGadget(), position: [0, 2]},
  	]
});