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
	zdWrapper.auth = user + '/token:' + key;
	zdWrapper.headers = {
		Accept: 'application/json'
	}
	console.log('set some variables');
	console.log(zdWrapper);
	startPollingQueueStatus();
	callback();
}

var startPollingQueueStatus = function() {
	var options = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/channels/voice/stats/current_queue_activity',
		headers: zdWrapper.headers
	};
	setInterval(function() {
		https.get(options, function (response) {
			var content = "";
			
			response.on('data', function(chunk) {
				content += chunk;
			});
			
			response.on('end', function() {
				var queueStatus = JSON.parse(content);
				console.log(content);
				zdWrapper.lastQueueCall = Date(); // we store the last time we got data
			});
		}).on('error', function(error) {
			console.log('Error while calling queue activity: ' + error.message);
		});
	}, 5000);
}

zdWrapper.getQueueStatus = function(callback) {
	callback(queueStatus);
}



module.exports = zdWrapper;