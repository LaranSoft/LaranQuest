var loader = {
	loadScript: function(src, onLoad){
		var head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = src;
		script.onload = onLoad;
		head.appendChild(script);
	}
};

