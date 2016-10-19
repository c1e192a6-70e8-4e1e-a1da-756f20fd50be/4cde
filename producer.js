'use strict';

const Client = require('fivebeans').client;
const app = require('./server/server.js');
const repl = require('repl');

app.once('READY_FOR_TEST', function () {
	// not necessary to maintain db connection for producer worker.
	app.dataSources.mongo.disconnect();
});

let replServer = repl.start('>');
let client = new Client(app.get('BS_HOST'), app.get('BS_PORT'));

client.on('connect', function () {
	client.use(app.get('BS_TUBE'), function (err, tname) {
		client.put(0, 0, 60, JSON.stringify({from: 'usd', to: 'hkd'}), () => {});
		if (replServer) {
			replServer.context.seed = function (from, to) {
				console.log('seed a new job:', {from, to});
				client.put(0, 0, 60, JSON.stringify({from, to}), () => {});
			};
			console.log('Type seed("usd", "hkd"); to seed a  job.');
		}
	});
});

client.connect();


replServer.context.client = client;
