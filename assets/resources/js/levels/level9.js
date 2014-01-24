var level9 = new Maze({
	size: [5, 3],
	spaces: [
	    new Space(1, [2, 0], '0110', [0, 2, 4, 0], {free: false, gadget: new DamageGadget()}),
		new Space(2, [2, 1], '0111', [0, 3, 5, 1]),
		new Space(3, [2, 2], '0011', [0, 0, 6, 2], {free: false, gadget: new TeleportGadget(1, false)}),
		new Space(4, [3, 0], '1110', [1, 5, 7, 0], {free: false, gadget: new SealGadget()}),
		new Space(5, [3, 1], '1111', [2, 6, 8, 4], {free: false, gadget: new SealGadget()}),
		new Space(6, [3, 2], '1011', [3, 0, 9, 5]),
		new Space(7, [4, 0], '1100', [4, 8, 0, 0]),
		new Space(8, [4, 1], '1101', [5, 9, 0, 7], {free: false, gadget: new StartGadget()}),
		new Space(9, [4, 2], '1001', [6, 0, 0, 8])
	],
    objects: [
  	    {gadget: new TeleportGadget(1, false), position: [1, 0]},
  	    {gadget: new TeleportSwitchGadget(1), position: [1, 1]},
  	    {gadget: new LifeGadget(), position: [1, 2]},
  	    {gadget: new ExitGadget(), position: [0, 1]}
  	]
});