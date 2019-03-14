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