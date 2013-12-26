var memory = {
	init: function(){
		if(!this.load('inited')){
			this.reset();
		}
	},
	
	load: function(key){
		return JSON.parse(localStorage.getItem(key));
	},
	
	save: function(key, value){
		localStorage.setItem(key, JSON.stringify(value));
	},
	
	reset: function(){
		var stages = [];
		stages.push({'locked': false});
		stages.push({'locked': true});
		this.save('stages', stages);
		
		this.save('tutorials', {});
		
		this.save('inited', true);
	}
};

