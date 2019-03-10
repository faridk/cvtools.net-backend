var socket = require('socket.io');
var cors = require('cors');
var express = require('express');
var app = express();
var apollo = require('./apollo');

// Allow Cross-Origin Requests
app.use(cors());

// ApolloServer from local file ./apollo.js
apollo.startServer(4000);

app.use(express.static('./../cvtools.net-frontend/build', {
	extensions: ['html', 'htm'],
	// Other options here
}));

const port = 5000;
var server = app.listen(port, () => console.log(`Express listening on port ${port}!`));

var io = socket(server);
io.sockets.on('connection', handleConnection);

function handleConnection(socket) {
	// console.log(socket);
	console.log('New Socket.IO connection, id: ' + socket.id);

	socket.on('login', checkCredentials);

	function checkCredentials(credentials) {
		console.log(credentials);
	}
}

app.get('/', (req, res) => res.render('/index.html'));

