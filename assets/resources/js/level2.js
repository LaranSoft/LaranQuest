var level2 = new Maze({
	character: 'warrior',  
	size: [3, 7],
	start: 1, 
	end: 7, 
	spaces: [
	    new Space([0, 1], '11000111', [0, 2, 0, 0]),
	    new Space([0, 2], '01000100', [0, 3, 0, 1]),
	    new ExpSpace([0, 3], '01110010', [0, 0, 4, 2], 1),
	    new ExpSpace([1, 3], '00010001', [3, 0, 5, 0], 2),
	    new ExpSpace([2, 3], '00100111', [4, 6, 0, 0], 3),
	    new Space([2, 4], '01000100', [0, 7, 0, 5]),
	    new ExitSpace([2, 5], '01111100', [0, 0, 0, 6])
	],
	labels: [
 	    new Label([0, 5], [1, 2], 'stop here')
    ],
    images: [
  	    new Image([1, 4], [1, 1], 'Arrow_BL')
    ],
	triggers: {
    	'start': function(data){
    		this.trigger('startTurn');
    		this.trigger('select', {character: 'warrior'});
    		this.showTutorial(['actionPoint']);
    	},
    	'startTurn': function(data){
    		if(this.status.turn == 2){
    			this.showTutorial(['lives']);
    		}
    	}
    },
    tutorials: {
    	'actionPoint': new Tutorial('actionPointTutorial', 'actionPoints', 'Each turn you can do a limited number of moves only'),
    	'lives': new Tutorial('livesTutorial', 'lifePoints', 'Your character will take 1 damage at the end of each turn. When life points reaches 0, your character will die.')
    }
});