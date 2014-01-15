var adiacentsMap = {};
	
adiacentsMap[1] = [2, 6];
adiacentsMap[2] = [1, 3, 7];
adiacentsMap[3] = [2, 4]; //8
adiacentsMap[4] = [3, 5, 9];
adiacentsMap[5] = [4, 10];
adiacentsMap[6] = [1, 7, 11];
adiacentsMap[7] = [2, 6, 12]; //8
//adiacentsMap[8] = [3, 7, 9, 13];
adiacentsMap[9] = [4, 10, 14]; //8
adiacentsMap[10] = [5, 9, 15];
adiacentsMap[11] = [6, 12, 16];
adiacentsMap[12] = [7, 11, 13, 17];
adiacentsMap[13] = [12, 14, 18]; //8
adiacentsMap[14] = [9, 13, 15];
adiacentsMap[15] = [10, 14, 19];
adiacentsMap[16] = [11, 17, 20];
adiacentsMap[17] = [12, 16, 18, 21];
adiacentsMap[18] = [13, 17, 22];
adiacentsMap[19] = [15, 23];
adiacentsMap[20] = [16, 21];
adiacentsMap[21] = [17, 20, 22];
adiacentsMap[22] = [18, 21];
adiacentsMap[23] = [19];

var doubleTrap = function(status, enteringDirection, exitingDirection){
	if(status.trap1 == null){
		status.trap1 = 'disinnescata';
		status.lifePoints--;
	}
	if(status.trap2 == null){
		status.trap2 = 'disinnescata';
		status.lifePoints--;
	}
	return status.lifePoints > 0;
};

var trap1 = function(status, enteringDirection, exitingDirection){
	if(status.trap1 == null){
		status.trap1 = 'disinnescata';
		status.lifePoints--;
	}
	return status.lifePoints > 0;
};

var trap2 = function(status, enteringDirection, exitingDirection){
	if(status.trap2 == null){
		status.trap2 = 'disinnescata';
		status.lifePoints--;
	}
	return status.lifePoints > 0;
};

var spaces = [];
spaces.push({id: 1, star: true, onEnter: function(status, enteringDirection, exitingDirection){status.lifePoints++; return true;}});
spaces.push({id: 2, onEnter: doubleTrap});
spaces.push({id: 3});
spaces.push({id: 4});
spaces.push({id: 5});
spaces.push({id: 6});
spaces.push({id: 7, onEnter: doubleTrap});
//spaces.push({id: 8});
spaces.push({id: 9});
spaces.push({id: 10, star: true, onEnter: function(status, enteringDirection, exitingDirection){status.lifePoints++; return true;}});
spaces.push({id: 11, onEnter: trap1});
spaces.push({id: 12, star: true, onEnter: doubleTrap});
spaces.push({id: 13, onEnter: trap1});
spaces.push({id: 14, onEnter: trap1});
spaces.push({id: 15, onEnter: trap1});
spaces.push({id: 16});
spaces.push({id: 17, star: true, end: true, onEnter: doubleTrap});
spaces.push({id: 18});
spaces.push({id: 19});
spaces.push({id: 20, onEnter: trap2});
spaces.push({id: 21, star: true, onEnter: doubleTrap});
spaces.push({id: 22, onEnter: trap2});
spaces.push({id: 23});

var elements = [{name: 'teleport', value: 't1'}, {name: 'teleport', value: 't1'}];
	