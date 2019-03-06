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
}
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4000, () => console.log('Server listening on localhost:4000/graphiql'));