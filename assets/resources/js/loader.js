var loader = {
	init: function(){
		if(!this.loadFromMemory('stages')){
			var stages = [];
			stages.push({'locked': false});
			stages.push({'locked': true});
			this.saveInMemory('stages', stages);
		}
	},
		
	loadScript: function(src, onLoad){
		var head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = src;
		script.onload = onLoad;
		head.appendChild(script);
	},
	
	loadFromMemory: function(key){
		return JSON.parse(localStorage.getItem(key));
	},
	
	saveInMemory: function(key, value){
		localStorage.setItem(key, JSON.stringify(value));
	}
};

