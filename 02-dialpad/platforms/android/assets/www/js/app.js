var minWidth = 240;
var minHeight = 320;
var dialpad, header, footer;
var btnRatio = 0.1; // of window height

//crossutil.setEventListener(window, 'deviceready', onDeviceReady);
crossutil.setEventListener(window, 'load', onDeviceReady);
function onDeviceReady() {
	document.getElementById('welcome').style.display = 'none';
	dialpad = document.getElementById('dialpad');
	header = document.getElementById('header');
	footer = document.getElementById('footer');
	//
	/*centering();
	dialpad.style.visibility = 'visible';
	crossutil.setEventListener(window, 'resize', onWindowResize);*/
	
	dialpad.style.visibility = 'visible';
	try {
		var ss = document.styleSheets[0];
		var lr = ss.cssRules[ss.cssRules.length - 1];
		dialpad.innerHTML = lr.selectorText;
	}
	catch (err) {
		dialpad.innerHTML = 'no stylesheet';
	}
}

function onWindowResize() {
	centering();
}

function centering() {
	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	var dpW = parseInt( crossutil.getStyle(dialpad, 'width') );
	var dpH = parseInt( crossutil.getStyle(dialpad, 'height') );
	
	
	
	if (w > minWidth && w > dpW && h > minHeight && h > dpH) {
		btn.style.width = btnRatio * h + 'px';
		btn.style.height = btnRatio * h + 'px';
		dialpad.style.marginLeft = (w - dpW) / 2 + 'px';
		dialpad.style.marginTop = (h - dpH) / 2 + 'px';
	}
}