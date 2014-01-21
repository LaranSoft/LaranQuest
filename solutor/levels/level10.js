var spaces = [
	new Space(1, [0, 2, 4, 0]),
	new Space(2, [0, 3, 5, 1]),
	new Space(3, [0, 0, 6, 2]),
	new Space(4, [1, 5, 7, 0]),
	new Space(5, [2, 6, 9, 4]),
	new Space(6, [3, 7, 10, 5]),
	new Space(7, [0, 0, 11, 6]),
	new Space(8, [4, 0, 0, 0]),
	new Space(9, [5, 10, 12, 8]),
	new Space(10, [6, 11, 13, 9]),
	new Space(11, [7, 0, 0, 10]),
	new Space(12, [9, 13, 0, 0]),
	new Space(13, [10, 0, 0, 12])
];

var elements = [
	new ExitGadget(),
	new StartGadget()
];

var gadgets = {
	1: new DamageGadget(),
	5: new LifeGadget(1),
	8: new SealGadget()
};	