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

var getUserStatus = function() {
	dbSession.fetchAll('SELECT * FROM users WHERE external_id IS NOT NULL', function(err, rows) {
		if (err) {
			throw new Error('error getting users from database:' + err);
		} else {
//			allUsers = rows;

			rows.forEach(function(currentUser, index) {
				var options = {
					hostname: zdWrapper.hostname,
					auth: zdWrapper.auth,
					path: zdWrapper.basePath + '/channels/voice/availabilities/' + (currentUser.external_id),
					headers: zdWrapper.headers
				};
				https.get(options, function(response) {
					var content = "";
					response.on('data', function (chunk) {
						content += chunk;
					});
					response.on('end', function () {
						if (response.statusCode < 400) {
							content = JSON.parse(content);
							if (content.availability.status != currentUser.status) {
								console.log('from zendesk: ' + content.availability.status + ' Stored:' + currentUser.status + ' User: ' + currentUser.name);
								var timeNow = new Date();
				//				timeNow = timeNow.getTime(); // ensure UTC
								dbSession.update('users', {
									status: content.availability.status,
									call_start: timeNow.toString()
								}, 'id=' + currentUser.id, function(err) {
									console.log('timestamp: ' + timeNow);
								});
							} else {
								console.log('statuses matched ' + currentUser.status);
							}
						} 
					});
					response.on('error', function(err) {
						console.log('got error: ' + error);
					})
				}).on('error', function(err) {
					console.log('Got an error!');
					console.log(err);
				});
			})
		}
	});
}

var getVoicemailStatus = function() {
	var voicemailOptions = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/search.json?query=via:voicemail+group:Support+status:new',
		headers: zdWrapper.headers
	};
	https.get(voicemailOptions, function(response) {
		var content = "";
		response.on('data', function (chunk) {
			content += chunk;
		});
		response.on('end', function () {
			console.log(content);
			content = JSON.parse(content);
			var numVM = content.count;
			if (numVM == 100) {
				numVM = '100+';
			}
			zdWrapper.voicemails = numVM;
		});
		response.on('error', function() {
			console.log('Error getting voicmail response');
			console.log(error);
		})
	}).on('error', function(err) {
		console.log('Error getting voicemail status');
		console.log(err);
	});
}

var getEmailStatus = function() {
	var emailOptions = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/search.json?query=via:email+group:Support+status:new+-voicemail',
		headers: zdWrapper.headers
	};
	https.get(emailOptions, function(response) {
		var content = "";
		response.on('data', function (chunk) {
			content += chunk;
		});
		response.on('end', function () {
			console.log(content);
			content = JSON.parse(content);
			var numEM = content.count;
			if (numEM == 100) {
				numEM = '100+'.;
			}
			zdWrapper.emails = numEM;
		});
		response.on('error', function() {
			console.log('Error getting email response');
			console.log(error);
		})
	}).on('error', function(err) {
		console.log('Error getting email status');
		console.log(err);
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
