net = require('net');
events = require('events');
util = require('util');
fs = require('fs');

LineStream = function() {
	net.Stream.call(this);
	var self=this;
	var previousBuffer="";

	this.addListener('data', function(data) {
		data = (previousBuffer+data).replace(/\r/g, "");
		var somethingLeft = LineStream._cutFromRight(data);
		previousBuffer=somethingLeft[1];
		
		if (somethingLeft[0]=='') {
			return;
		}
		
		self.emit('lines', somethingLeft[0].split("\n"));
	});
}

util.inherits(LineStream, net.Stream);
module.exports = LineStream;

LineStream._cutFromRight = function(str) {
	if (str.charAt(str.length-1)=="\n") {
		return [str.substr(0,str.length-1), ''];
	}
	var li = str.lastIndexOf("\n");
	var str1 = str.substr(0,li);
	var str2 = str.substr(li+1, str.length);
	return [str1, str2];
}


LineStream.prototype.puts = function(line) {
	return this.write(line+"\r\n");
}

