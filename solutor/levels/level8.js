var spaces = [
	new Space(1, [0, 2, 5, 0]),
	new Space(2, [0, 3, 6, 1]),
	new Space(3, [0, 4, 7, 2]),
	new Space(4, [0, 0, 8, 3]),
	new Space(5, [1, 6, 9, 0]),
	new Space(6, [0, 7, 0, 0]),
	new Space(7, [3, 8, 11, 6]),
	new Space(8, [4, 0, 0, 7]),
	new Space(9, [5, 10, 0, 0]),
	new Space(10, [6, 11, 0, 9]),
	new Space(11, [7, 0, 0, 10])
];

var elements = [
	new StartGadget(),
	new ExitGadget()
];

var gadgets = {
	1: new SealGadget(),
	6: new SealGadget(), // forceDirection
	11: new SealGadget()
};	