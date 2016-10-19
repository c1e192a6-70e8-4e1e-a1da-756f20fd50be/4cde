'use strict';
const bswWorkerMounter = require('../../units/bsw-worker');
function mountWorker(app) {
	bswWorkerMounter(app);
}
module.exports = mountWorker;
