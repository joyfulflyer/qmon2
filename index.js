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
	if (err) {
		console.log(err);
	}
})

