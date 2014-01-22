var loader = {
	loadScript: function(src, onLoad){
		var head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.id = 'script_' + src.replace(/\W/g, '_');
		script.type = 'text/javascript';
		script.src = src;
		script.onload = onLoad;
		head.appendChild(script);
	},
	unloadScript: function(src){
		$('#script_' + src.replace(/\W/g, '_')).remove();
	},
};

