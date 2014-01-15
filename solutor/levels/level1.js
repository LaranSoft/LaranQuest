var spaces = [
	new Space(1, [0, 2, 4, 0]),
	new Space(2, [0, 1, 3, 5]),
	new Space(3, [0, 0, 2, 6]),
	new Space(4, [1, 5, 0, 0]),
	new Space(5, [2, 4, 0, 6]),
	new Space(6, [3, 0, 0, 5])
];

var elements = [
	new StartGadget()
];

var gadgets = {
	1: new SealGadget(),
	3: new SealGadget(),
	6: new ExitGadget()
};