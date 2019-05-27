const formidable = require('formidable');

function processFileUpload(app) {
	// File uploads
	app.post('/', (req, res) => {
		var form = new formidable.IncomingForm();
		// Limit video file size to 10GB
		form.maxFileSize = 10 * 1024 * 1024 * 1024;
		form.on('progress', function(bytesReceived, bytesExpected) {
			// TODO send this to client over WebSockets
			console.log(`${bytesReceived} / ${bytesExpected}`);
		});
		form.parse(req, function (error, fields, files) {
			console.log(files.videoUpload);
			// console.log(files.videoUpload.path);
			if (error) {
				console.log(error);
			}
			// Send a response back
			res.write('File uploaded');
			res.end();
		});
	});
}

// Export typeDefs & resolvers to be combined into one schema along with others
module.exports = {
	processFileUpload: function(app) {
		processFileUpload(app);
	}
};