'use strict';

var app = require('./app.js');
var http = require('http');

var server = http.createServer(app);

server.listen(8080, function() {
	console.log('started listening on port 8080');
})
