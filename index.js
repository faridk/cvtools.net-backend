const { ApolloServer, gql } = require('apollo-server');
const express = require('express');
const cors = require('cors');
const app = express();

// Allow Cross-Origin Requests
app.use(cors());

var typeDefs = [`
	schema {
		query: Query
	}

	type Query {
		appInfo: AppInfo
	}

	type AppInfo {
		appName: String,
		appVersion: String
	}
`];

var resolvers = {
	Query: {
		appInfo(root) {
			return 'TBD';
		}

	// 	appName(root) {
	// 	// Security issue, consider hardcoding this value
	// 	// return process.env.npm_package_name;
	// 	return 'cvtools.net';
	// },

	// appVersion(root) {
	// 	// Security issue
	// 	return process.env.npm_package_version;
	// }
}
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4000, () => console.log('Server listening on localhost:4000/graphiql'));