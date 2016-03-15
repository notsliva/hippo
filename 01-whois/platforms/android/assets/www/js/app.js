var URL = 'http://whoisxmlapi.com/whoisserver/WhoisService?domainName=';
var container, formSend, txtDomain, result;
var req;

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	document.getElementById('welcome').style.display = 'none';
	container = document.getElementById('container');
	container.style.display = 'block';
	document.getElementById('btnExit').ontouchend = function () {
		navigator.app.exitApp();
	};
	//
	formSend = document.getElementById('formSend');
	txtDomain = document.getElementById('txtDomain');
	result = document.getElementById('result');
	req = new XMLHttpRequest();
	req.addEventListener('readystatechange', onReqReady, false);
	formSend.addEventListener('submit', onFormSubmit, false);
}

function onReqReady() {
	if (req.readyState != 4 || req.status != 200) return;
	var dom = req.responseXML;
	var raws = dom.getElementsByTagName('rawText');
	var raw = raws[raws.length - 1].firstChild.nodeValue;
	//var raw = parseRaws(raws);
	result.innerHTML = '<pre>' + raw + '</pre>';
}

function onFormSubmit(e) {
	e = e || event;
	try {
		e.preventDefault(); // w3c dom
	}
	catch (err) {
		e.returnValue = false; // IE
	}
	req.open('GET', URL + txtDomain.value, true);
	req.send(null);
	result.innerHTML = 'Processing...'
}

function parseRaws(raws) {
	for (var i in raws) {
		var raw = raws[i].firstChild.nodeValue;
		if (raw.indexOf('Domain Name:') === 0) {
			return raw;
		}
	}
	// else last
	return raws[raws.length - 1].firstChild.nodeValue;
}