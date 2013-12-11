var contextPath = 'file:///android_asset';
var isMobile = true;

var isValidEvent = function(event){return event.originalEvent.targetTouches && event.originalEvent.targetTouches.length == 1;};

var getClientCoord = function(event){
	return {
		x: event.originalEvent.targetTouches[0].pageX,
		y: event.originalEvent.targetTouches[0].pageY
	};
};