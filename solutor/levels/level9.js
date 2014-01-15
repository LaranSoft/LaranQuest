var adiacentsMap = {};
	
adiacentsMap[1] = [2, 4];
adiacentsMap[2] = [1, 3, 5];
adiacentsMap[3] = [2, 6];
adiacentsMap[4] = [1, 5, 7];
adiacentsMap[5] = [2, 4, 6, 8];
adiacentsMap[6] = [3, 5, 9];
adiacentsMap[7] = [4, 8];
adiacentsMap[8] = [5, 7, 9];
adiacentsMap[9] = [6, 8];

var spaces = [];
spaces.push({id: 1, star: true, onEnter: function(status){status.lifePoints--; return status.lifePoints > 0;}});
spaces.push({id: 2});
spaces.push({id: 3, star: true, teleport: 't1'});
spaces.push({id: 4, star: true});
spaces.push({id: 5, star: true});
spaces.push({id: 6});
spaces.push({id: 7});
spaces.push({id: 8, star: true, start: true});
spaces.push({id: 9});

var elements = [
	{name: 'onEnter', value: function(status, enD, exD, path, index){
			for(var i=0; i<index; i++){
				if(path.get(i) == 3) return false;
			}
			return true;
		}
	},
	{name: 'teleport', value: 't1'}, 
	{name: 'life', value: 1}
];