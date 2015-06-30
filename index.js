'use strict';

var app = require('./app.js');
var http = require('http');
var zdWrapper = require('./src/zdWrapper.js');
var args = process.argv.slice(2);

var secrets = require('./secrets.js');

var server = http.createServer(app);

server.listen(8080, function() {
	console.log('started listening on port 8080');
})

// [0].zendesk.com, username, api key
zdWrapper.connect(secrets.org, secrets.user, secrets.key, function(err) {
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
	console.log(res);
	console.log("end response");
})

