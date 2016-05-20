
module.exports = function (chunk) {
	var data = {};
	chunk = chunk.toString(); console.log(chunk);
	chunk = chunk.split('&');
	for (var i = 0; i<chunk.length; i++) {
		var temp = chunk[i].split('=');
		data[temp[0]] = temp[1];
	}
	return data;
}
