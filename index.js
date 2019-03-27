const servers = require('./servers');
const core = require('./core/main');

servers.startServers();

core.init(true);