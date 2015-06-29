'use strict';

var app = require('./app.js');
var http = require('http');
var zdWrapper = require('./src/zdWrapper.js');
var arguments = process.argv.slice(2);


var server = http.createServer(app);

server.listen(8080, function() {
	console.log('started listening on port 8080');
})

// [0].zendesk.com, username, api key
zdWrapper.connect(arguments[0], arguments[1], arguments[3], function(err) {
	console.log(err);
})

zdWrapper.getQueuStatus(function (res) {
	console.log(res);
})