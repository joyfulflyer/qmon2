'use strict';

var express = require('express');
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');
var https = require('https');
var callQueue = require('../models/callQueue');

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
//	console.log('set some variables');
	console.log(zdWrapper);
	console.log(this);
	startPollingQueueStatus();
	callback();
}

var queueStatus;

var startPollingQueueStatus = function() {
	var options = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/channels/voice/stats/current_queue_activity',
		headers: zdWrapper.headers
	};
	var poll = function() {
		
		https.get(options, function (response) {
			var content = "";
			
			response.on('data', function(chunk) {
				content += chunk;
			});
			
			response.on('end', function() {
				//two methods of saving this
				zdWrapper.queueStatus = JSON.parse(content);
				console.log('called zendesk');
//				callQueue.updateQueueInfo(zdWrapper.queueStatus, new Date());
				zdWrapper.lastQueueCall = new Date(); // we store the last time we got data
			});
		}).on('error', function(error) {
			console.log('Error while calling queue activity: ' + error.message);
		});	
	}
	poll();
	setInterval(poll, 5000);
}

zdWrapper.getQueueStatus = function() {
	// another way of getting data out
	return queueStatus;
}



module.exports = zdWrapper;