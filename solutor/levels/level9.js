var spaces = [
	new Space(1, [0, 2, 4, 0]),
	new Space(2, [0, 3, 5, 1]),
	new Space(3, [0, 0, 6, 2]),
	new Space(4, [1, 5, 7, 0]),
	new Space(5, [2, 6, 8, 4]),
	new Space(6, [3, 0, 9, 5]),
	new Space(7, [4, 8, 0, 0]),
	new Space(8, [5, 9, 0, 7]),
	new Space(9, [6, 0, 0, 8])
];

var elements = [
	new ExitGadget(),
	new TeleportGadget(1, false),
	new TeleportSwitchGadget(1),
	new LifeGadget(1)
];

var gadgets = {
	1: new DamageGadget(),
	3: new TeleportGadget(1, false),
	4: new SealGadget(),
	5: new SealGadget(),
	8: new StartGadget()
};	