var MIN_WIDTH = 240;
var MIN_HEIGHT = 320;
var BTN_RATIO = 0.1; // of window height
var URL_MP3;
var dialpad, txtPhone, pad, btnPlus, btnAdd;
var btnRule, tm;

//crossutil.setEventListener(window, 'deviceready', onDeviceReady);
crossutil.setEventListener(window, 'load', onDeviceReady);
function onDeviceReady() {
	btnRule = getButtonRule();
	URL_MP3 = getMediaURL('res/btn.mp3');
	dialpad = document.getElementById('dialpad');
	txtPhone = document.getElementById('txtPhone');
	pad = document.getElementById('pad');
	btnPlus = document.getElementById('btnPlus');
	btnAdd = document.getElementById('btnAdd');
	//
	crossutil.setEventListener(pad, 'touchstart', onPadClick);
	crossutil.setEventListener(btnPlus, 'touchend', onPlusUp);
	crossutil.setEventListener(btnAdd, 'touchend', onAddClick);
	crossutil.setEventListener(window, 'resize', onWindowResize);
	centering();
	document.getElementById('welcome').style.display = 'none';
	dialpad.style.visibility = 'visible';
}

function onWindowResize() {
	centering();
}

function onPadClick(e) {
	var self = e.target;
	if (self.className.indexOf('btn') == -1) return;
	//
	if (self.className.indexOf('clear') > -1) {
		txtPhone.value = '';
	}
	else if (self.className.indexOf('del') > -1) {
		var str = txtPhone.value;
		txtPhone.value = str.substring(0, str.length - 1);
	}
	else if (self.id == 'btnPlus') {
		tm = setTimeout(function () {
			clearTimeout(tm);
			tm = null;
			txtPhone.value += '+';
		}, 1000);
	}
	else {
		var num = parseInt(self.innerHTML);
		txtPhone.value += num;
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

function onAddClick() {
	if (txtPhone.value == '') return;
	var dspName = prompt('Enter some name', '');
	if ( !dspName || !crossutil.trim(dspName, ' ') ) return;
	//
	addContact(dspName, txtPhone.value);
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
	var w = document.body.clientWidth;
	var h = document.body.clientHeight;
	var dpW = parseInt( crossutil.getStyle(dialpad, 'width') );
	var dpH = parseInt( crossutil.getStyle(dialpad, 'height') );
	
	if (w > MIN_WIDTH && w > dpW && h > MIN_HEIGHT && h > dpH) {
		var size = BTN_RATIO * h + 'px';
		btnRule.style.width = size;
		btnRule.style.height = size;
		btnRule.style.lineHeight = size;
		btnRule.style.borderRadius = size / 3;
		dialpad.style.marginLeft = (w - dpW) / 2 + 'px';
		dialpad.style.marginTop = (h - dpH) / 2 + 'px';
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