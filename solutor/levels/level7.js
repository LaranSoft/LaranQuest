var spaces = [
	new Space(1, [0, 2, 6, 0]),
	new Space(2, [0, 3, 7, 1]),
	new Space(3, [0, 4, 0, 2]),
	new Space(4, [0, 5, 8, 3]),
	new Space(5, [0, 9, 4, 0]),
	new Space(6, [1, 7, 10, 0]),
	new Space(7, [2, 0, 11, 6]),
	new Space(8, [4, 9, 13, 0]),
	new Space(9, [5, 0, 14, 8]),
	new Space(10, [6, 11, 15, 0]),
	new Space(11, [7, 12, 16, 10]),
	new Space(12, [0, 13, 17, 11]),
	new Space(13, [8, 14, 0, 12]),
	new Space(14, [9, 0, 18, 13]),
	new Space(15, [10, 16, 19, 0]),
	new Space(16, [11, 17, 20, 15]),
	new Space(17, [12, 0, 21, 16]),
	new Space(18, [14, 0, 22, 0]),
	new Space(19, [15, 20, 0, 0]),
	new Space(20, [16, 21, 0, 19]),
	new Space(21, [17, 0, 0, 20]),
	new Space(22, [18, 0, 0, 0])
];

var elements = [
    new TeleportGadget(1),
	new TeleportGadget(1),
	new StartGadget()
];

var gadgets = {
	1: new LifeGadget(1),
	9: new LifeGadget(1),
	11: new BowTrapGadget(),
	16: new ExitGadget(),
	20: new BowTrapGadget()	
};