// tfjs-node-gpu crashes with segfault
// tfjs = require('@tensorflow/tfjs-node-gpu');

function init(isBackend) {
	console.log('Initializing core...');
}

module.exports = {
	init: function(isBackend: boolean) {
		init(isBackend);
	}
};