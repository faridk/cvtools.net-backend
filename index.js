var express = require('express');
var app = express();

app.use(express.static('./../cvtools.net-frontend/build', {
    extensions: ['html', 'htm'],
    // Other options here
}));

const port = 5000;
app.listen(port, () => console.log(`Express listening on port ${port}!`));

app.get('/', (req, res) => res.render('/index.html'));