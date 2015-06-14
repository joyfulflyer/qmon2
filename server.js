'use strict';

var express = require('express');
var app = express();

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Starting server on port 3000');
	
});

module.exports = {'server': server};