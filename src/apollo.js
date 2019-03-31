// $NoFlow
const { ApolloServer, gql } = require('apollo-server');
const auth = require('./auth');

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
		login: async (_, { email, password }, context) => {
			// console.log(`\nLogin\ne-mail: ${email}\npassword: ${password}\n`);
			return auth.loginUser(email, password, context.ip);
		},
		signup: async (_, { email, password }, context) => {
			let message = 'ok';
			console.log("IP", context.ip);
			console.log(`\nSign Up\ne-mail: ${email}\npassword: ${password}`);
			await auth.signupUser(email, password, context.ip).catch((error) => {
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
			let ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress;
			let authToken = req.headers['authorization'];
			try {
				console.log(authToken);
				if (authToken) {
					// Token exists
				}
			 } catch (e) {
					console.warn(`Unable to authenticate using auth token: ${authToken}`);
			}
			// Return values so that they can be accessed from resolvers
			// when 'context' is passed as a third parameter of a resolver
			return {
				ip: ip,
				authToken: authToken
			};
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