var adiacentsMap = {};
	
adiacentsMap[1] = [2, 5];
adiacentsMap[2] = [1, 3, 6];
adiacentsMap[3] = [2, 4, 7];
adiacentsMap[4] = [3, 8];
adiacentsMap[5] = [1, 6, 9];
adiacentsMap[6] = [7];
adiacentsMap[7] = [3, 6, 8, 11];
adiacentsMap[8] = [4, 7];
adiacentsMap[9] = [5, 10];
adiacentsMap[10] = [6, 9, 11];
adiacentsMap[11] = [7, 10];

var spaces = [];
spaces.push({id: 1, star: true});
spaces.push({id: 2});
spaces.push({id: 3});
spaces.push({id: 4});
spaces.push({id: 5});
spaces.push({id: 6, star: true});
spaces.push({id: 7});
spaces.push({id: 8});
spaces.push({id: 9});
spaces.push({id: 10});
spaces.push({id: 11, star: true});

var elements = [];
	