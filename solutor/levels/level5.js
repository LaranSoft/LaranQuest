var adiacentsMap = {};
	
adiacentsMap[1] = [2, 5];
adiacentsMap[2] = [1, 3, 6];
adiacentsMap[3] = [2, 4, 7];
adiacentsMap[4] = [3, 8];
adiacentsMap[5] = [1, 6, 9];
adiacentsMap[6] = [2, 5, 7, 10];
adiacentsMap[7] = [3, 6, 8];
adiacentsMap[8] = [4, 7, 12];
adiacentsMap[9] = [5, 10, 13];
adiacentsMap[10] = [6, 9, 14];
adiacentsMap[12] = [8, 16];
adiacentsMap[13] = [9, 14];
adiacentsMap[14] = [10, 13, 15];
adiacentsMap[15] = [14, 16];
adiacentsMap[16] = [12, 15];

var spaces = [];
spaces.push({id: 1});
spaces.push({id: 2});
spaces.push({id: 3});
spaces.push({id: 4, star: true});
spaces.push({id: 5});
spaces.push({id: 6});
spaces.push({id: 7});
spaces.push({id: 8});
spaces.push({id: 9});
spaces.push({id: 10});
spaces.push({id: 12, star: true});
spaces.push({id: 13, star: true});
spaces.push({id: 14});
spaces.push({id: 15, star: true});
spaces.push({id: 16});

var elements = [];
	