var MIN_WIDTH = 240;
var MIN_HEIGHT = 320;
var BTN_RATIO = 0.12; // of window height
var URL_MP3;
var dialpad, txtPhone, btnPlus;
var btnRule, tm;
var windowWidth, windowHeight, dialpadWidth, dialpadHeight, btnSize

crossutil.setEventListener(document, 'deviceready', onDeviceReady);
// crossutil.setEventListener(window, 'load', onDeviceReady);
function onDeviceReady() {
	btnRule = getButtonRule();
	URL_MP3 = getMediaURL('res/btn.mp3');
	dialpad = document.getElementById('dialpad');
	txtPhone = document.getElementById('txtPhone');
	btnPlus = document.getElementById('btnPlus');
	//
	crossutil.setEventListener(dialpad, 'touchstart', onPadClick);
	crossutil.setEventListener(btnPlus, 'touchend', onPlusUp);
	crossutil.setEventListener(window, 'resize', onWindowResize);
	centering();
	document.getElementById('welcome').style.display = 'none';
	dialpad.style.visibility = 'visible';
}

function onWindowResize() {
	// setTimeout(centering, 100); // autorotation fix
	centering();
	centering();
}

function onPadClick(e) {
	var self = e.target;
	if (self.className.indexOf('btn') == -1) return;
	//
	if (self.id == 'btnPlus') {
		tm = setTimeout(function () {
			clearTimeout(tm);
			tm = null;
			txtPhone.value += '+';
		}, 1000);
	}
	else if (self.className.indexOf('add') > -1) {
		if (txtPhone.value == '') return;
		var dspName = prompt('Enter some name', '');
		if ( !dspName || !crossutil.trim(dspName, ' ') ) return;
		addContact(dspName, txtPhone.value);
	}
	else if (self.className.indexOf('call') > -1) {
		//
	}
	else if (self.className.indexOf('del') > -1) {
		var str = txtPhone.value;
		txtPhone.value = str.substring(0, str.length - 1);
	}
	else {
		//var num = parseInt(self.innerHTML);
		txtPhone.value += self.innerHTML;
	}
	//
	playAudio(URL_MP3);
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
	windowWidth = document.body.clientWidth;
	windowHeight = document.body.clientHeight;
	
	//if (windowWidth > MIN_WIDTH && windowHeight > MIN_HEIGHT) {
	{
		btnSize = BTN_RATIO * windowHeight;
		btnRule.style.width = btnSize + 'px';
		btnRule.style.height = btnSize + 'px';
		btnRule.style.lineHeight = btnSize + 'px';
		btnRule.style.borderRadius = btnSize / 2 + 'px';
		//
		dialpadWidth = parseInt( crossutil.getStyle(dialpad, 'width') );
		dialpadHeight = parseInt( crossutil.getStyle(dialpad, 'height') );
		dialpad.style.marginLeft = (windowWidth - dialpadWidth) / 2 + 'px';
		dialpad.style.marginTop = (windowHeight - dialpadHeight) / 2 + 'px';
	}
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