var MAX_PAGE_NUM = 3;
var pageNum = 0;
var wrapper;

window.addEventListener('load', onDeviceReady, false);
// document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	wrapper = document.getElementById('wrapper')
	// wrapper.addEventListener('click', onWrapperClick, false);
	wrapper.addEventListener('touchstart', onWrapperClick, false);
};

function onWrapperClick(e) {
	var self = e.target.tagName.toLowerCase();
	console.log(self);
	if (self == 'button') {
		next();
	}
	else if (self == 'h1') {
		prev();
	}
}

function next() {
	pageNum = pageNum > MAX_PAGE_NUM - 1 ? MAX_PAGE_NUM : ++pageNum;
	navigate();
}
function prev() {
	pageNum = pageNum < 1 ? 0 : --pageNum;
	navigate();
}
function navigate() {
	for (var i = 0; i <= MAX_PAGE_NUM; i++) {
			hidePage(i);
	}
	showPage(pageNum);
}
function showPage(num) {
	document.getElementById('page' + num).style.display = 'block';
}
function hidePage(num) {
	document.getElementById('page' + num).style.display = 'none';
}