// $NoFlow
const cors = require('cors'); // $NoFlow
const ws = require('ws'); // $NoFlow
const validator = require('validator'); // $NoFlow
const express = require('express');
const app = express();
const apollo = require('./apollo');
const fileupload = require('./fileupload');

/* TODO
   use validator.isEmail() for frontend validated emails
   use MongoDB for storing user emails and HASHED passwords
   implement authentication: use JSON Web Token (JWT) (recommended) or sessions
   change session id on login to protect against session fixation attacks
   use Synchronizing Token Pattern to protect against Cross-Site Request Forgeries (CSRF)
   Note: CORS does NOT necessarily protect against CSRF
*/

function startServers() {
	// ApolloServer from local file ./apollo.js
	apollo.startServer(4000);

	// WebSockets server setup
	const wss = new ws.Server({ port: 5001 });
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			if (validator.isAscii(message)) {
				console.log('received: %s', message);
			} else {
				console.log('error: received message is not a string');            
			}
		});

		ws.send('authorized');
	});

	startExpress();
}

function startExpress() {
	// Allow Cross-Origin Requests
	app.use(cors());
	app.use(express.static('./../cvtools.net-frontend/build', {
		extensions: ['html', 'htm'],
		// Other options here
	}));
	
	expressGET();
	expressPOST();

	const port = 5000;
	var server = app.listen(port, () => console.log(`Express listening on port ${port}!`));	
}

function expressGET() {
	app.get('/', (req, res) => res.render('/index.html'));
}

function expressPOST() {
	fileupload.processFileUpload(app);
}

module.exports = {
    startServers: function() {
			startServers();
	}
};