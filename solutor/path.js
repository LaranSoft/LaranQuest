function Path(status, space){
	this.mPath = [];
	this.length = 0;
	this.last = null;
	this.status = status;
	
	if(space != null){
		space = Number(space);
		this.mPath.push(space);
		this.length = 1;
		this.last = space;
		this.status.visited[space] = true;
	}
};

Path.prototype.contains = function(space){
	return this.mPath.indexOf(space) != -1;
};

Path.prototype.goto = function(space){
	var newPath = new Path($.extend(true, {}, this.status));
	
	for(var i=0; i<this.mPath.length; i++){
		newPath.mPath.push(this.mPath[i]);
	}
	newPath.mPath.push(space);
	newPath.status.visited[space] = true;
	newPath.length = newPath.mPath.length;
	newPath.last = space;
	
	return newPath;
};

Path.prototype.get = function(index){
	return this.mPath[index];
};