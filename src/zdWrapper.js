'use strict';

var express = require('express');
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');
var https = require('https');
var callQueue = require('../models/callQueue');
var async = require('async');

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
//	startPollingQueueStatus();
//	startPollingUserStatus();
	getUserStatus(0);
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
//				console.log(zdWrapper.queueStatus);
//				callQueue.updateQueueInfo(zdWrapper.queueStatus, new Date());
				zdWrapper.lastQueueCall = new Date(); // we store the last time we got data
			});
			
		}).on('error', function(error) {
			console.log('Error while calling queue activity: ' + error.message);
		});	
	}
	poll();
	var queuePoll = setInterval(poll, 1000); // to shut it off
}

var allContent = [];

// Current page is designed to start at 0. It uses currentPage + 1 to determine the page to view
var getUserStatus = function(currentPage) {
	var cont = true;
	var i = 0;

	var options = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/channels/voice/stats/agents_activity.json?page=' + (currentPage + 1),
		headers: zdWrapper.headers
	};

	https.get(options, function(response) {
		var content = "";
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			console.log ('content ' + (currentPage + 1));
			content = JSON.parse(content);
//			console.log(content);
			if (content.next_page != null) {
				allContent = allContent.concat(content.agents_activity);
//				allContent.push(content.agents_activity);
				console.log('read page ' + (currentPage + 1));
				getUserStatus(currentPage + 1);
			} else {
				console.log('no more pages');
				console.log(allContent);
				console.log('printed all content');
			}
		});


	});

}
/*
	async.whilst(function() {
		console.log('cont ' + cont);
		return cont;
	}, function() {
		


		https.get(options, function(response) {
			var content = "";
			response.on('data', function(chunk) {
//				console.log('got chunk');
				content += chunk;
			});
			response.on('end', function() {
				content = JSON.parse(content);
				console.log(content.next_page);
				if (content.next_page === 'undefined') {
					console.log('found undefined');
//					console.log(content.next_page);
					cont = false;
				} else {
					allContent += content;
				}
				console.log('end');


			//	console.log(content);
			});
			console.log('get finished');
		});

		console.log('moving on i=' + i);
		console.log('continue?: ' + cont);

		i++;
	}, function(err) {
		if (err) {
			console.log('got error: ' + error);
		} else {
			console.log('end');
			console.log(allContent);
		}

	});
*/

/*
	for (var i = 1; i < 5; i++) {

		var options = {
			hostname: zdWrapper.hostname,
			auth: zdWrapper.auth,
			path: zdWrapper.basePath + '/channels/voice/stats/agents_activity.json?page=' + i,
			headers: zdWrapper.headers
		};


		https.get(options, function(response) {
			var content = "";
			response.on('data', function(chunk) {
				console.log('got chunk');
				content += chunk;
			});
			response.on('end', function() {
				content = JSON.parse(content);
				console.log(content.next_page);
				if (content.next_page === 'undefined') {
					console.log('found undefined');
					console.log(content.next_page);
					cont = false;
				} else {
					allContent += content;
				}


			//	console.log(content);
			});
		});

	}
	console.log(allContent);

*/

	




zdWrapper.getQueueStatus = function() {
	// another way of getting data out
	return queueStatus;
}



module.exports = zdWrapper;