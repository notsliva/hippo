var MIN_HEIGHT = 320;
var BUTTON_RATIO = 0.113; // of window height
var dialpad, txtPhone, btnCall;
var urlMp3, tm, buttonRule, buttonSize, windowHeight;

// window.addEventListener('load', onDeviceReady, false);
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	buttonRule = getButtonRule();
	urlMp3 = getMediaURL('res/btn.wav');
	
	try {
		new Media(urlMp3).play();
	}
	catch (e) {
		alert(e);
	}
	
	dialpad = document.getElementById('dialpad');
	txtPhone = document.getElementById('txtPhone');
	btnCall = document.querySelector('.call');
	document.querySelector('.plus').ontouchend = onPlusUp;
	dialpad.addEventListener('touchstart', onPadClick, false);
	//
	centering();
	window.addEventListener('resize', onWindowResize, false);
	document.getElementById('welcome').style.display = 'none';
	document.getElementById('container').style.visibility = 'visible';
};

function onWindowResize() {
	centering();
}

function isContains(element, selector) {
	var class1 = element.className.toLowerCase();
	var class2 = element.parentNode.className.toLowerCase();
	selector = selector.toLowerCase();
	if (class1.indexOf(selector) > -1 || class2.indexOf(selector) > -1) return true;
	return false;
}

function onPadClick(e) {
	var self = e.target;
	if ( !isContains(self, 'btn') ) return;
	
	playAudio(urlMp3);
	
	// PLUS (div & span)
	if ( isContains(self, 'plus') ) {
		tm = setTimeout(function () {
			clearTimeout(tm);
			tm = null;
			txtPhone.value += '+';
		}, 1000);
	}
	// ADD (div & img)
	else if ( isContains(self, 'add') ) {
		if (txtPhone.value == '') return;
		var dspName = prompt('Enter some name', '');
		if ( !dspName || !trim(dspName, ' ') ) return;
		addContact(dspName, txtPhone.value);
	}
	// CALL (div & img)
	else if ( isContains(self, 'call') ) {
		//
	}
	// DEL (div & img)
	else if ( isContains(self, 'del') ) {
		var str = txtPhone.value;
		txtPhone.value = str.substring(0, str.length - 1);
	}
	// NUMS (div)
	else {
		txtPhone.value += self.innerHTML;
	}
}

function onPlusUp() {
	if (tm) {
		clearTimeout(tm);
		tm = null;
		txtPhone.value += '0';
	}
}

function addContact(name, phone) {
	try {
		var contact = navigator.contacts.create();
		contact.displayName = name;
		contact.phoneNumbers = [new ContactField('mobile', phone, true)];
		//
		contact.save(
			function () {
				alert('Ok, contact is saved');
			},
			function (err) {
				alert(err);
			}
		);
	}
	catch (err) {}
}

function getMediaURL(url) {
	var path = location.pathname;
	path = path.substring(path, path.length - 10); // del index.html
	return path + url;
	// return 'file://' + path + url;
	
	/*try {
		if (device.platform.toLowerCase() == 'android') {
			return '/android_asset/www/' + url;
		}
	}
	catch (err) {}
	return url;*/
}

function playAudio(url) {
	try {
		var myMedia = new Media(
			url,
			function () {
				myMedia.release();
			},
			function (err) {}
		);
		myMedia.play({numberOfLoops: 1});
	}
	catch (err) {}
}

function centering() {
	windowHeight = document.documentElement.clientHeight;
	if (windowHeight < MIN_HEIGHT) windowHeight = MIN_HEIGHT;
	//
	buttonSize = BUTTON_RATIO * windowHeight;
	buttonRule.style.width = buttonSize + 'px';
	buttonRule.style.height = buttonSize + 'px';
	buttonRule.style.lineHeight = buttonSize + 'px';
	buttonRule.style.borderRadius = parseInt(buttonSize / 2) + 'px';
	btnCall.style.top = -( buttonSize / 2 + parseInt(buttonRule.style.borderWidth) ) + 'px';
	// html font size
	document.documentElement.style.fontSize = windowHeight / MIN_HEIGHT * 100 + '%';
}

function getButtonRule() {
	try {
		var rules = document.styleSheets[1].cssRules;
		for (var i in rules) {
			if (rules[i].selectorText == '.btn') {
				return rules[i];
			}
		}
	}
	catch (err) {}
	return null;
}

function trim(str, charlist) {
	charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
	var re = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	return str.replace(re, '');
}