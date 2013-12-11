var contextPath = './';
var isMobile = false;

var isValidEvent = function(event){return true;};

var getClientCoord = function(event){
	return {x: event.pageX, y: event.pageY};
};