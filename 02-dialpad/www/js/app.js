var MIN_WIDTH = 240;
var MIN_HEIGHT = 320;
var BTN_RATIO = 0.113; // of window height
var dialpad, txtPhone, btnCall;
var urlMp3, tm, buttonRule, buttonSize, windowHeight;

// window.addEventListener('load', onDeviceReady, false);
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	buttonRule = getButtonRule();
	urlMp3 = getMediaURL('res/btn.mp3');
	dialpad = document.getElementById('dialpad');
	txtPhone = document.getElementById('txtPhone');
	btnCall = document.querySelector('.call');
	document.querySelector('.plus').ontouchend = onPlusUp;
	dialpad.addEventListener('touchstart', onPadClick, false);
	//
	centering();
	window.addEventListener('resize', onWindowResize, false);
	// window.addEventListener('orientationchange', onWindowResize, false); // autorotation fix
	document.getElementById('welcome').style.display = 'none';
	document.getElementById('container').style.visibility = 'visible';
};

function onWindowResize() {
	centering();
}

function onPadClick(e) {
	var self = e.target;
	if (self.className.indexOf('btn') == -1 && self.parentNode.className.indexOf('btn') == -1) return;
	//
	if (self.className.indexOf('plus') > -1) {
		tm = setTimeout(function () {
			clearTimeout(tm);
			tm = null;
			txtPhone.value += '+';
		}, 1000);
	}
	// img
	else if (self.parentNode.className.indexOf('add') > -1) {
		if (txtPhone.value == '') return;
		var dspName = prompt('Enter some name', '');
		if ( !dspName || !trim(dspName, ' ') ) return;
		addContact(dspName, txtPhone.value);
	}
	else if (self.parentNode.className.indexOf('call') > -1) {
		//
	}
	else if (self.parentNode.className.indexOf('del') > -1) {
		var str = txtPhone.value;
		txtPhone.value = str.substring(0, str.length - 1);
	}
	else {
		txtPhone.value += self.innerHTML;
	}
	//
	playAudio(urlMp3);
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
	catch (err) {
		console.log(err);
	}
}

function getMediaURL(url) {
	try {
		if (device.platform.toLowerCase() == 'android') {
			return '/android_asset/www/' + url;
		}
	}
	catch (err) {
		console.log(err);
	}
	return url;
}

function playAudio(url) {
	try {
		var myMedia = new Media(
			url,
			function () {
				myMedia.release();
			},
			function (err) {
				console.log(err);
			}
		);
		myMedia.play();
	}
	catch (err) {
		console.log(err);
	}
}

function centering() {
	windowHeight = document.documentElement.clientHeight;
	if (windowHeight <= MIN_HEIGHT) windowHeight = MIN_HEIGHT;
	//
	buttonSize = BTN_RATIO * windowHeight;
	buttonRule.style.width = buttonSize + 'px';
	buttonRule.style.height = buttonSize + 'px';
	buttonRule.style.lineHeight = buttonSize + 'px';
	buttonRule.style.borderRadius = buttonSize / 2 + 'px';
	btnCall.style.top = -(buttonSize / 2 + 2) + 'px'; // +2 for border
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