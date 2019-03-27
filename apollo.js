// $NoFlow
const { ApolloServer, gql } = require('apollo-server');

var typeDefs = [`
	schema {
		query: Query,
		mutation: Mutation
	}
	type Query {
		appInfo: AppInfo
	}
	type Mutation {
		login(email: String, pass: String): String,
		signup(email: String, pass: String): String
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
		login: async (_, { email, pass }) => {
			console.log(`\nLogin\ne-mail: ${email}\npass: ${pass}\n`);
			return 'Login successful';
		},
		signup: async (_, { email, pass }) => {
			console.log(`\nSign Up\ne-mail: ${email}\npass: ${pass}\n`);
			return 'Signup successful';
		}
	}
};

module.exports = {
    startServer: function(port: number) {
		const server = new ApolloServer({ typeDefs, resolvers });
		server.listen(port, () => console.log('ApolloServer listening on localhost:' + port + '/graphiql'));
	}
};