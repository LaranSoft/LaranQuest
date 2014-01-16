var spaces = [
	new Space(1, [0, 0, 4, 0]),
	new Space(2, [0, 3, 5, 0]),
	new Space(3, [0, 4, 6, 2]),
	new Space(4, [1, 0, 7, 3]),
	new Space(5, [2, 6, 8, 0]),
	new Space(6, [2, 7, 9, 5]),
	new Space(7, [4, 0, 10, 6]),
	new Space(8, [5, 9, 11, 0]),
	new Space(9, [6, 10, 12, 8]),
	new Space(10, [7, 0, 13, 9]),
	new Space(11, [8, 12, 0, 0]),
	new Space(12, [9, 13, 0, 11]),
	new Space(13, [10, 0, 0, 12])
];

var elements = [
    new StartGadget()
];

var gadgets = {
	1: new ExitGadget(),
	9: new SealGadget(),
	10: new KeyGadget(),
	11: new SealGadget(),
	13: new SealGadget()
};

var doors = [
    [5, 6],
    [6, 9]
];
	