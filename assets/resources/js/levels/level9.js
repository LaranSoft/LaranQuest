var level9 = new Maze({
	size: [4, 5],
	spaces: [
	    new Space(1, [1, 1], '0110', [0, 2, 4, 0], {free: false, gadget: new DamageGadget()}),
		new Space(2, [1, 2], '0111', [0, 3, 5, 1]),
		new Space(3, [1, 3], '0011', [0, 0, 6, 2], {free: false, gadget: new TeleportGadget(1, false)}),
		new Space(4, [2, 1], '1110', [1, 5, 7, 0], {free: false, gadget: new SealGadget()}),
		new Space(5, [2, 2], '1111', [2, 6, 8, 4], {free: false, gadget: new SealGadget()}),
		new Space(6, [2, 3], '1011', [3, 0, 9, 5]),
		new Space(7, [3, 1], '1100', [4, 8, 0, 0]),
		new Space(8, [3, 2], '1101', [5, 9, 0, 7], {free: false, gadget: new StartGadget()}),
		new Space(9, [3, 3], '1001', [6, 0, 0, 8])
	],
    objects: [
  	    {gadget: new TeleportGadget(1, false), position: [0, 1]},
  	    {gadget: new TeleportSwitchGadget(1), position: [0, 2]},
  	    {gadget: new LifeGadget(), position: [0, 3]},
  	    {gadget: new ExitGadget(), position: [0, 4]}
  	]
});