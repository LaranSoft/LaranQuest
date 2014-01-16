var spaces = [
    new Space(1, [0, 2, 5, 0]),
	new Space(2, [0, 3, 6, 1]),
	new Space(3, [0, 4, 7, 2]),
	new Space(4, [0, 0, 8, 3]),
	new Space(5, [1, 6, 9, 0]),
	new Space(6, [2, 7, 10, 5]),
	new Space(7, [3, 8, 0, 6]),
	new Space(8, [4, 0, 11, 7]),
	new Space(9, [5, 10, 12, 0]),
	new Space(10, [6, 0, 13, 9]),
	new Space(11, [8, 0, 15, 0]),
	new Space(12, [9, 13, 0, 0]),
	new Space(13, [10, 14, 0, 12]),
	new Space(14, [0, 15, 0, 13]),
	new Space(15, [11, 0, 0, 14])
];

var elements = [
    new StartGadget()
];

var gadgets = {
	4: new TeleportGadget(1, false),
	5: new TeleportGadget(1, false),
	6: new TeleportSwitchGadget(1),
	9: new ExitGadget()
};
	