var { createCanvas, loadImage } = require('canvas');
var cors = require('cors');
var express = require('express');
var app = express();
var apollo = require('./apollo');
var ws = require('ws');

// Allow Cross-Origin Requests
app.use(cors());

// WebSockets server setup
const wss = new ws.Server({ port: 5001 });

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	ws.send('something');
});

// ApolloServer from local file ./apollo.js
apollo.startServer(4000);

app.use(express.static('./../cvtools.net-frontend/build', {
	extensions: ['html', 'htm'],
	// Other options here
}));

const port = 5000;
var server = app.listen(port, () => console.log(`Express listening on port ${port}!`));

app.get('/', (req, res) => res.render('/index.html'));

const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');

let jpegStream = canvas.createJPEGStream(); // ReadableStream
// let pngStream = canvas.createPNGStream();
