// $NoFlow
const bodyPix = require('@tensorflow-models/body-pix');

async function loadModel() {
	const net = await bodyPix.load();
	console.log('BodyPix model loaded');
}

function init() {
	loadModel();
	const outputStride = 16;
	// Increase if the model over-detects
	// Decrease if the model under-detects
	const segmentationThreshold = 0.5;

}

// ES6 exports
// export default BodyPix;

// Node exports
module.exports = {
	init: function() {
		init();
	}
};