var adiacentsMap = {};
	
adiacentsMap[1] = [2, 4];
adiacentsMap[2] = [1, 3, 5];
adiacentsMap[3] = [2, 6];
adiacentsMap[4] = [1, 5, 8];
adiacentsMap[5] = [2, 4, 6, 9];
adiacentsMap[6] = [3, 5, 7, 10];
adiacentsMap[7] = [6, 11];
adiacentsMap[8] = [4];
adiacentsMap[9] = [5, 8, 10, 12];
adiacentsMap[10] = [6, 9, 11, 13];
adiacentsMap[11] = [7, 10];
adiacentsMap[12] = [9, 13, 14];
adiacentsMap[13] = [10, 12, 15];
adiacentsMap[14] = [12, 15];
adiacentsMap[15] = [13, 14];

var spaces = [];
spaces.push({id: 1, star: true, onEnter: function(status){status.lifePoints--; return status.lifePoints > 0;}});
spaces.push({id: 2});
spaces.push({id: 3});
spaces.push({id: 4});
spaces.push({id: 5, star: true, onEnter: function(status){status.lifePoints++; return status.lifePoints > 0;}});
spaces.push({id: 6});
spaces.push({id: 7});
spaces.push({id: 8, star: true});
spaces.push({id: 9});
spaces.push({id: 10});
spaces.push({id: 11});
spaces.push({id: 12});
spaces.push({id: 13});
spaces.push({id: 14});
spaces.push({id: 15});

var elements = [];
	