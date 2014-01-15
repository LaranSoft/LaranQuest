var level3 = new Maze({
	size: [5, 4],
	spaces: [
	    new Space(1, [1, 0], '0110', [0, 2, 5, 0]),
	    new Space(2, [1, 1], '0111', [0, 3, 6, 1]),
	    new Space(3, [1, 2], '0111', [0, 4, 7, 2]),
	    new Space(4, [1, 3], '0011', [0, 0, 8, 3], {free: false, gadget: new TeleportGadget(1, false)}),
	    new Space(5, [2, 0], '1110', [1, 6, 9, 0], {free: false, gadget: new TeleportGadget(1, false)}),
	    new Space(6, [2, 1], '1111', [2, 7, 10, 5], {free: false, gadget: new TeleportSwitchGadget(1)}),
	    new Space(7, [2, 2], '1121', [3, 8, 0, 6]),
	    new Space(8, [2, 3], '1011', [4, 0, 11, 7]),
	    new Space(9, [3, 0], '1110', [5, 10, 12, 0], {free: false, gadget: new ExitGadget()}),
	    new Space(10, [3, 1], '1211', [6, 0, 13, 9]),
	    new Space(11, [3, 3], '1012', [8, 0, 15, 0]),
	    new Space(12, [4, 0], '1100', [9, 13, 0, 0]),
	    new Space(13, [4, 1], '1101', [10, 14, 0, 12]),
	    new Space(14, [4, 2], '2101', [0, 15, 0, 13]),
	    new Space(15, [4, 3], '1001', [11, 0, 0, 14])
	],
    objects: [
  	    {gadget: new StartGadget(), position: [0, 0]}
  	]
});