var app = {
	initialize: function () {
		this.bindEvents();
	},
	// load, deviceready, offline, online
	bindEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function () {
		var URL = 'http://whoisxmlapi.com/whoisserver/WhoisService?domainName=';
		var result = document.getElementById('result');
		var formSend = document.getElementById('formSend');
		var txtDomain = document.getElementById('txtDomain');
		document.getElementById('box').style.display = 'none';
		formSend.style.display = 'block';
		//
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
		//
		function onFormSubmit(e) {
			e.preventDefault();
			var req = new XMLHttpRequest();
			req.onreadystatechange = function () {
				if (req.readyState != 4 || req.status != 200) return;
				var dom = req.responseXML;
				var raws = dom.getElementsByTagName('rawText');
				var raw = raws[raws.length - 1].firstChild.nodeValue;
				//var raw = parseRaws(raws);
				//var serializer = new XMLSerializer();
				//var raw = serializer.serializeToString(dom);
				result.innerHTML = '<pre>' + raw + '</pre>';
			};
			req.open('GET', URL + txtDomain.value, true);
			req.send(null);
			result.innerHTML = 'Processing...'
		}
		formSend.addEventListener('submit', onFormSubmit, false);
	}
};

app.initialize();