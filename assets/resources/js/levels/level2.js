var level2 = new Maze({
	size: [4, 3],
	spaces: [
	    new Space(1, [1, 0], '0110', [0, 2, 4, 0]),
	    new Space(2, [1, 1], '0111', [0, 3, 5, 1], {free: true, exceptions: ['teleport1']}),
	    new Space(3, [1, 2], '0011', [0, 0, 6, 2]),
	    new Space(4, [2, 0], '1110', [1, 5, 7, 0], {free: false, gadget: new SealGadget()}),
	    new Space(5, [2, 1], '1121', [2, 6, 0, 4], {free: false, gadget: new TeleportGadget(1)}),
	    new Space(6, [2, 2], '1011', [3, 0, 9, 5], {free: false, gadget: new SealGadget()}),
	    new Space(7, [3, 0], '1100', [4, 8, 0, 0]),
	    new Space(8, [3, 1], '2101', [0, 9, 0, 7], {free: false, gadget: new SealGadget()}),
	    new Space(9, [3, 2], '1001', [8, 0, 0, 7], {free: false, gadget: new ExitGadget()})
	],
//	labels: [
// 	    new Label([0, 5], [1, 2], 'stop here')
//    ],
//    images: [
//  	    new Image([1, 4], [1, 1], 'Arrow_BL')
//    ],
    objects: [
  	    {gadget: new TeleportGadget(1), position: [0, 1]},
  	    {gadget: new StartGadget(), position: [0, 0]}
  	]
});