'use strict';

var app = require('./app.js');
var http = require('http');
var zdWrapper = require('./src/zdWrapper.js');
var args = process.argv.slice(2);

var server = http.createServer(app);

server.listen(8080, function() {
	console.log('started listening on port 8080');
})

// [0].zendesk.com, username, api key
zdWrapper.connect(args[0], args[1], args[2], function(err) {
	console.log(err);
})

var str = '';

zdWrapper.getQueueStatus(function (res) {
	res.on('data', function(chunk) {
		console.log('got chunk');
		console.log(chunk);
		str += chunk;
	})
	res.on('end', function () {
		console.log('end');
		console.log('message: ' + str);

	})
	console.log('RESPONSE');
	console.log(res.statusCode);
//	console.log(res);
	console.log("end response");
})
*/
