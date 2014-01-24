var spaces = [
  	new Space(1, [0, 2, 5, 0]),
  	new Space(2, [0, 3, 6, 1]),
  	new Space(3, [0, 4, 7, 2]),
  	new Space(4, [0, 0, 8, 3]),
  	new Space(5, [1, 6, 9, 0]),
  	new Space(6, [2, 7, 10, 5]),
  	new Space(7, [3, 8, 11, 6]),
  	new Space(8, [4, 0, 12, 7]),
  	new Space(9, [5, 10, 13, 0]),
  	new Space(10, [6, 11, 14, 9]),
  	new Space(11, [7, 12, 15, 10]),
  	new Space(12, [8, 0, 16, 11]),
  	new Space(13, [9, 14, 0, 0]),
  	new Space(14, [10, 15, 0, 13]),
  	new Space(15, [11, 16, 0, 14]),
  	new Space(16, [12, 0, 0, 15])
];


var elements = {
};

var gadgets = {
	6: new KeyGadget(),
	11: new LifeGadget(1),
	13: new BowTrapGadget()
};

var doors = [
    [5, 6],
    [14, 15]
];	
	