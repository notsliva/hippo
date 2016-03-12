// trim('Hello World', 'Hdle') == 'o Wor'
function trim(str, charlist) {
	charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
	//var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
	var re = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	return str.replace(re, '');
}