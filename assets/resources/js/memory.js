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
		this.save('lastStage', 1);
		this.save('tutorials', {});
		
		this.save('inited', true);
	}
};

