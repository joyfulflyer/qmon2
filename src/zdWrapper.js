'use strict';

var express = require('express');
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');
var https = require('https');


var zdWrapper = {};
//maybe I'm too java but I think I want a zdWrapper object to carry around, is that what i'm doing?
zdWrapper.connect = function(org, user, key, callback) {
	if (user === 'undefined' || org === 'undefined' || key === 'undefined') {
		throw new Error('Need orginization, username and API key to be able to connect'); 
	}
	
	zdWrapper.basePath = '/api/v2';
	zdWrapper.hostname = org + '.zendesk.com';
	zdWrapper.auth = user + '/token:' + key; //I hope this is right
	zdWrapper.headers = {
		Accept: 'application/json'
	}
	console.log('set some variables');
	console.log(zdWrapper);
	callback();
}

zdWrapper.getQueueStatus = function(callback) {
	var options = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/channels/voice/stats/current_queue_activity',
		headers: zdWrapper.headers
	}
	console.log(options);
	https.get(options, callback).on('error', function(e) {
		console.log('Got error: ' + e.message);

	});
}



module.exports = zdWrapper;