var URL_MP3 = 'file://res/notify.mp3';
var allContacts = [];
var container, tick;

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	document.getElementById('welcome').style.display = 'none';
	container = document.getElementById('container');
	container.style.display = 'block';
	document.getElementById('btnExit').ontouchend = function () {
		navigator.app.exitApp();
	};
	//
	container.innerHTML = 'Processing...';
	cordova.plugins.backgroundMode.setDefaults({ text: 'BGCN is bg'});
	cordova.plugins.backgroundMode.enable();
	cordova.plugins.backgroundMode.onactivate = onBGActivate;
	cordova.plugins.backgroundMode.ondeactivate = onBGDeactivate;
	//
	var options = new ContactFindOptions();
	options.multiple = true;
	var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
	navigator.contacts.find(fields, onContactsSuccess, onContactsError, options);
}

function onBGActivate() {
	if (allContacts.length > 0) {
		tick = setInterval(onTick, 5000);	
	}
}
function onBGDeactivate() {
	if (tick) {
		clearInterval(tick);
		tick = null;
	}
}
function onTick() {
	try {
		var num = parseInt(Math.random() * allContacts.length);
		var dspName = allContacts[num].displayName;
		var phone = allContacts[num].phone;
		cordova.plugins.notification.local.schedule({
			title: dspName,
			text: phone,
			sound: URL_MP3
		});
	}
	catch (err) {}
}

function onContactsSuccess(contacts) {
	if (contacts.length == 0) return;
	allContacts = [];
	var ul = createElement('ul');
	for (var i in contacts) {
		try {
			var dspName = contacts[i].displayName;
			var phones = contacts[i].phoneNumbers;
			var phone = phones[0].value; // mobile
			allContacts.push( {displayName: dspName, phone: phone} );
			var li = createElement('li', dspName + ': ' + phone);
			ul.appendChild(li);
		}
		catch (err) {}
	}
	container.innerHTML = '';
	container.appendChild(ul);
}
function onContactsError(err) {
	alert('Error of contacts getting');
}
function createElement(tag, text) {
	var element = document.createElement(tag);
	if (text) {
		var txt = document.createTextNode(text);
		element.appendChild(txt);
	}
	return element;
}