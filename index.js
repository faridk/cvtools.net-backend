var { createCanvas, loadImage } = require('canvas');
var cors = require('cors');
var express = require('express');
var app = express();
var apollo = require('./apollo');
var ws = require('ws');
var websocketStream = require('websocket-stream/stream');

const expressPort = 5000;
const apolloPort = 4000;
const webSocketsPort = 5001;

// Allow Cross-Origin Requests
app.use(cors());

// WebSockets server setup (see docs for more fine-tuning)
const wss = new ws.Server({ port: webSocketsPort });

// TODO: Add 'heartbeat' and close broken connections
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	// convert ws instance to stream
	const stream = websocketStream(ws, {
		// websocket-stream options here
		binary: true,
	});
	const canvas = createCanvas(1280, 720);
	const ctx = canvas.getContext('2d');
	let jpegStream = canvas.createJPEGStream(); // ReadableStream
	// let pngStream = canvas.createPNGStream();
	jpegStream.pipe(stream);

	ws.send('something');
});

// ApolloServer from local file ./apollo.js
apollo.startServer(apolloPort);

var server = app.listen(expressPort, () => console.log(`Express listening on port ${expressPort}!`));

app.use(express.static('./../cvtools.net-frontend/build', {
	extensions: ['html', 'htm'],
	// Other options here
}));