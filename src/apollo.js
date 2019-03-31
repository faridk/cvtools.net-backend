// $NoFlow
const { ApolloServer, gql } = require('apollo-server');
const prisma = require('./prisma');
const auth = require('./auth');

const HEADER_NAME = 'authorization';

var typeDefs = [`
	schema {
		query: Query,
		mutation: Mutation
	}
	type Query {
		appInfo: AppInfo
	}
	type Mutation {
		login(email: String, password: String): String,
		signup(email: String, password: String): String
	}
	type AppInfo {
		name: String,
		version: String
	}
`];

var resolvers = {
	Query: {
		appInfo(root) {
			// Potential security issue
			return {
				name: process.env.npm_package_name,
				version: process.env.npm_package_version
			}
		}
	},
	Mutation: {
		login: async (_, { email, password }) => {
			// console.log(`\nLogin\ne-mail: ${email}\npassword: ${password}\n`);
			return auth.authenticateUser(email, password);
		},
		signup: async (_, { email, password }) => {
			let message = 'ok';
			console.log(`\nSign Up\ne-mail: ${email}\npassword: ${password}`);
			await prisma.addUser(email, password).catch((error) => {
				message = error;
			});
			return message;
		}
	}
};

function startServer(port: number) {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
		}
	});
	server.listen(port, () => console.log('ApolloServer listening on localhost:'
		+ port + '/graphiql'));
}

module.exports = {
	startServer: function(port: number) {
		startServer(port);
	}
};