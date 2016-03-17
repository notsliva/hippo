var MIN_WIDTH = 240;
var MIN_HEIGHT = 320;
var BTN_RATIO = 0.12; // of window height
var dialpad, txtPhone;
var urlMp3, tm, btnRule, btnSize, windowWidth, windowHeight;

// window.addEventListener('load', onDeviceReady, false);
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	btnRule = getButtonRule();
	urlMp3 = getMediaURL('res/btn.mp3');
	dialpad = document.getElementById('dialpad');
	txtPhone = document.getElementById('txtPhone');
	document.querySelector('.plus').ontouchend = onPlusUp;
	dialpad.addEventListener('touchstart', onPadClick, false);
	//
	centering();
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('orientationchange', onWindowResize, false);
	document.getElementById('welcome').style.display = 'none';
	dialpad.style.visibility = 'visible';
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
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
	if (windowWidth <= MIN_WIDTH) windowWidth = MIN_WIDTH;
	if (windowHeight <= MIN_HEIGHT) windowHeight = MIN_HEIGHT;
	//
	btnSize = BTN_RATIO * windowHeight;
	btnRule.style.width = btnSize + 'px';
	btnRule.style.height = btnSize + 'px';
	btnRule.style.lineHeight = btnSize + 'px';
	btnRule.style.borderRadius = btnSize / 2 + 'px';
	dialpad.style.marginLeft = (windowWidth - dialpad.clientWidth) / 2 + 'px';
	dialpad.style.marginTop = (windowHeight - dialpad.clientHeight) / 2 + 'px';
}

function getButtonRule() {
	try {
		var rules = document.styleSheets[0].cssRules;
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