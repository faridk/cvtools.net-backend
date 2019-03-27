const servers = require('./servers');
const core = require('./core/main');
const prisma = require('./prisma');

servers.startServers();

core.init(true);

prisma.init();