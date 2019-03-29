const servers = require('./servers');
const core = require('./core/main');
const prisma = require('./prisma');

// Initialize Prisma before starting servers
prisma.init();

servers.startServers();

core.init(true);
