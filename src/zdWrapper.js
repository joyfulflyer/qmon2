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
	startPollingQueueStatus();
//	startPollingUserStatus();
	var userPoll = setInterval(getUserStatus, 5000);;
	callback();
}

//Maybe this should become get queue status and have the polling start elsewhere?
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
			
			response.on('error', function(err) {
				console.log('got an error during get');
				console.log(err);
			});
			
		}).on('error', function(error) {
			console.log('Error while calling queue activity: ' + error.message);
		});	
	}
	poll();
	var queuePoll = setInterval(poll, 1000); // save the variable to shut it off
}

var allContent = [];

// Current page is designed to start at 0. It uses currentPage + 1 to determine the page to view
var getUserStatus = function(currentPage) {
	if (currentPage == null) {
		currentPage = 0;
	}
	var cont = true;
	var i = 0;
//	var allUsers = []

	dbSession.fetchAll('SELECT * FROM users', function(err, rows) {
		if (err) {
			throw new Error('error getting users from database:' + err);
		} else {
//			allUsers = rows;
			for (var i = 0; i < rows.length; i++) {
				var currentUser = rows[i];
				var options = {
					hostname: zdWrapper.hostname,
					auth: zdWrapper.auth,
					path: zdWrapper.basePath + '/channels/voice/availabilities/' + (currentUser.external_id),
					headers: zdWrapper.headers
				};
//				console.log('getting' + rows[i].external_id);
				https.get(options, function(response) {
					var content = "";
					response.on('data', function (chunk) {
						console.log(response.statusCode);
						content += chunk;
					});
					response.on('end', function () {
						if (response.statusCode < 400) {
							
						
							console.log(response.statusCode);
							console.log(currentUser);
							console.log('user ^');
							console.log(content);
							content = JSON.parse(content);
							console.log(content);
							console.log(content.availability);

							if (content.availability != undefined) {
								console.log(currentUser.status + ' ' + content.availability.status);
							}
							if (content.availability != undefined && currentUser.status != content.availability.status) {
								var timeNow = new Date();
	//							console.log('updated');
								dbSession.update('users', {
									status: content.status,
									call_start: timeNow //I don't need this for all status but I don't see a harm in recording it
								}, 'id=' + currentUser.id, function(err) {
									console.log('inserted');
								});
							}
						}
					});
					response.on('error', function (err) {
						console.log('Error getting info for ' + allUsers[i])
					})
				}).on('error', function(err) {
					console.log('another error location');
					console.log(err);
				}
			}
		}
	});

}

/**********************************************************************
* Note on user statuses:
* status | string | Unavailable, Available, On Call, Wrap up
* status_code | string | not_available, available, on_call, wrap_up
***********************************************************************/
module.exports = zdWrapper;


/******************
* Alternative method: get the availability of the users from zendesk
* https://developer.zendesk.com/rest_api/docs/voice-api/voice#getting-availability


Getting Availability

GET /api/v2/channels/voice/availabilities/{id}.json

Allowed For

Agents
Using curl

 curl https://{subdomain}.zendesk.com/api/v2/channels/voice/availabilities/{id}.json \
  -v -u {email_address}:{password} -X GET
Example Response

 Status: 200 OK

{
  "availability": {
    "via":        "client",
    "available":  true,
    "status":     "available"
  }
}
Availability JSON Format

Availability has the following keys:

Name	Type	Comment
available	boolean	The current availability status of the agent
via	string	The channel (client/phone) the agent is registered on
status	string	The status of the agent. Posible values: "available", "on_call", "wrap_up", "not_available"

*/
