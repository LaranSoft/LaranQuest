var adiacentsMap = {};
	
adiacentsMap[1] = [4];
adiacentsMap[2] = [3, 5];
adiacentsMap[3] = [2, 4, 6];
adiacentsMap[4] = [1, 3, 7];
adiacentsMap[5] = [2, 6, 8];
adiacentsMap[6] = [3, 5, 7, 9];
adiacentsMap[7] = [4, 6, 10];
adiacentsMap[8] = [5, 9, 11];
adiacentsMap[9] = [6, 8, 10, 12];
adiacentsMap[10] = [7, 9, 13];
adiacentsMap[11] = [8, 12];
adiacentsMap[12] = [9, 11, 13];
adiacentsMap[13] = [10, 12];

var spaces = [];
spaces.push({id: 1, star: true, end: true});
spaces.push({id: 2});
spaces.push({id: 3});
spaces.push({id: 4});
spaces.push({id: 5});
spaces.push({id: 6, onEnter: function(status, enteringDirection, exitingDirection){
		if(enteringDirection == 5 || enteringDirection == 9) {
			status.keys--;
		}
		if(exitingDirection == 5 || exitingDirection == 9){
			status.keys--;
		}
		return status.keys >= 0;
	}});
spaces.push({id: 7});
spaces.push({id: 8});
spaces.push({id: 9, star: true});
spaces.push({id: 10, onEnter: function(status, enteringDirection, exitingDirection){status.keys++; return true;}});
spaces.push({id: 11, star: true});
spaces.push({id: 12});
spaces.push({id: 13, star: true});

var elements = [];
	