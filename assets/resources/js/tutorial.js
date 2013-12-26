function Tutorial(name, image, text){
	this.name = name;
	this.image = image;
	this.text = text;
};

Tutorial.prototype.setAlreadySeen = function(){
	var tutorials = memory.load('tutorials');
	tutorials[this.name] = true;
	memory.save('tutorials', tutorials);
};

Tutorial.prototype.isAlreadySeen = function(){
	var tutorials = memory.load('tutorials');
	return tutorials[this.name] != null;
};

