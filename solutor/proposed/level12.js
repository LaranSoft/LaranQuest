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

var elements = {
	'C': [new ForceDirectionGadget(3)],
	'D': [new ForceDirectionGadget(0)],
	'E': [new ForceDirectionGadget(1), new ForceDirectionGadget(1)],
	'F': [new ForceDirectionGadget(2), new ForceDirectionGadget(2), new ForceDirectionGadget(2)]
};

var gadgets = {};
	