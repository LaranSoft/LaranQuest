var adiacentsMap = {};
	
adiacentsMap[1] = [2, 4];
adiacentsMap[2] = [1, 3, 5];
adiacentsMap[3] = [2, 6]; //8
adiacentsMap[4] = [1, 5, 8];
adiacentsMap[5] = [2, 4, 6];
adiacentsMap[6] = [3, 5, 9];
adiacentsMap[7] = [8, 12]; //8
adiacentsMap[8] = [4, 7, 13];
adiacentsMap[9] = [6, 15]; //8
adiacentsMap[10] = [11, 16];
adiacentsMap[11] = [10, 12, 17];
adiacentsMap[12] = [7, 11, 13];
adiacentsMap[13] = [8, 12, 14, 18]; //8
adiacentsMap[14] = [13, 15, 19];
adiacentsMap[15] = [9, 14, 20];
adiacentsMap[16] = [10, 17, 21];
adiacentsMap[17] = [11, 16, 22];
adiacentsMap[18] = [13, 19, 24];
adiacentsMap[19] = [14, 18, 20, 25];
adiacentsMap[20] = [15, 19, 26];
adiacentsMap[21] = [16, 22];
adiacentsMap[22] = [17, 21, 23];
adiacentsMap[23] = [22, 24];
adiacentsMap[24] = [25];
adiacentsMap[25] = [19, 24, 26];
adiacentsMap[26] = [20, 25];

var spaces = [];
spaces.push({id: 1});
spaces.push({id: 2});
spaces.push({id: 3, star: true});
spaces.push({id: 4});
spaces.push({id: 5, star: true});
spaces.push({id: 6});
spaces.push({id: 7});
spaces.push({id: 8});
spaces.push({id: 9});
spaces.push({id: 10, star: true});
spaces.push({id: 11});
spaces.push({id: 12});
spaces.push({id: 13});
spaces.push({id: 14});
spaces.push({id: 15});
spaces.push({id: 16});
spaces.push({id: 17, star: true});
spaces.push({id: 18});
spaces.push({id: 19});
spaces.push({id: 20, end: true, star: true});
spaces.push({id: 21});
spaces.push({id: 22});
spaces.push({id: 23});
spaces.push({id: 24});
spaces.push({id: 25});
spaces.push({id: 26});

var elements = [{name: 'closedSpace', value: 'true'}];
	