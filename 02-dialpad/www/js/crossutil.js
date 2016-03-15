var crossutil = {
	// setEventListener(document.body, 'click', myFunc);
	setEventListener: function (element, type, handler)	{
		try {
			element.addEventListener(type, handler, false);
		}
		catch (err) {
			try {
				element.attachEvent('on' + type, handler);
			}
			catch (err) {
				element['on' + type] = handler;
			}
		}
	},
	
	// unsetEventListener(document.body, 'click', myFunc);
	unsetEventListener: function (element, type, handler)	{
		try {
			element.removeEventListener(type, handler);
		}
		catch (err) {
			try {
				element.detachEvent('on' + type, handler);
			}
			catch (err) {
				element['on' + type] = null;
			}
		}
	},
	
	// getStyle(document.body, 'width'); == 10px
	getStyle: function (element, style) {
		try {
			return getComputedStyle(element, null)[style];
		}
		catch (err) {
			return element.currentStyle[style]; // IE>=9
		}
	},
	// trim('Hello World', 'Hdle'); == 'o Wor'
	trim: function (str, charlist) {
		charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
		//var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
		var re = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
		return str.replace(re, '');
	}
};