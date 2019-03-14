const cors = require('cors');
const express = require('express');
const app = express();
const apollo = require('./apollo');

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

app.get('/', (req, res) => res.render('/index.html'));

// WebSockets server setup
const wss = new ws.Server({ port: 5001 });

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	ws.send('authorized');
});