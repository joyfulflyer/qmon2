# qmon2
## NO LONGER MAINTAINED, DEPRECATED
Queue monitoring webpage

Who is on a call? How long have they been on the call? How many calls are in the queue. All these questions can be answered with qmon!

Provides basic queue information, how many in the queue, how long the wait as well as information on how long each user has been on their current call. The queue has one second resolution and the users have 5 second resolution.


To install:
Download repo
cd /qmon2
npm install

Add a 'secrets.js' file to the main directory of qmon2. The format should be an exported object containing 3 keys: org, user and key

e.g.
```
module.exports = {
	org: "org", 				// [org].zendesk.com
	user: "admin@person.com", 	// username used to access zendesk api
	key: "123456" 				// The zendesk API key associated witih the username
}
```
To run forever use 'forever' `npm install forever -g` which will keep the server running after exiting the shell
