function init(isBackend) {
	if (isBackend === true) {
		// Running on the backend
		tfjs = require('@tensorflow/tfjs-node-gpu');
	} else {
		// Running offline fullstack version
		// TODO add imports here
	}
	console.log('Initializing core...');
}

module.exports = {
	init: function(isBackend) {
		init(isBackend);
	}
};