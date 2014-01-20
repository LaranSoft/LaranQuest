function Item(name){
	this.id = Item.nextId++;
	this.name = name;
};

Item.nextId = 0;