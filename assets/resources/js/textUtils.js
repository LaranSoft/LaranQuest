var textUtils = {
	measureText: function(text, fontSize, css) {
		
	    var lDiv = document.createElement('div');
	    document.body.appendChild(lDiv);
	    
	    lDiv.style.position = 'absolute';
	    lDiv.style.left = -1000;
	    lDiv.style.top = -1000;
	    
	    lDiv.style.fontSize = fontSize + 'px';
	    css['font-family'] && (lDiv.style.fontFamily = css['font-family']);
	    css['font-style'] && (lDiv.style.fontStyle = css['font-style']);
	    css['font-weight'] && (lDiv.style.fontWeight = css['font-weight']);
	    
	    lDiv.innerText = text;
	
	    var lResult = {
	        width: lDiv.clientWidth,
	        height: lDiv.clientHeight
	    };
	    
	    document.body.removeChild(lDiv);
	    return lResult;
	},
	
	getMaxFontSize: function(text, css, maxBox){
		//#LOG#console.log(text + '; ' + JSON.stringify(maxBox));
		var fontSizeBottom = 1;
		var box = this.measureText(text, fontSizeBottom, css);
		var validBox;
		
		while(box.width <= maxBox.width && box.height <= maxBox.height){
			validBox = box;
			fontSizeBottom *= 2;
			if(isNaN(fontSizeBottom)){return 200};
			box = this.measureText(text, fontSizeBottom, css);
		}
		
		var fontSizeUp = fontSizeBottom;
		fontSizeBottom /= 2;
		
		while(fontSizeUp - fontSizeBottom > 1){
			var finalFontSize = Math.floor((fontSizeUp + fontSizeBottom) / 2); 
			box = this.measureText(text, finalFontSize, css);
			
			if(box.width > maxBox.width || box.height > maxBox.height){
				fontSizeUp = finalFontSize;
			} else {
				validBox = box;
				fontSizeBottom = finalFontSize;
			}
		}
		
		return {fontSize: fontSizeBottom, box: box}; 
	}
};