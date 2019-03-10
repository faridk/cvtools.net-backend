const { ApolloServer, gql } = require('apollo-server');
const express = require('express');

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

module.exports = {
    startServer: function(port) {
		const server = new ApolloServer({ typeDefs, resolvers });
		server.listen(port, () => console.log('ApolloServer listening on localhost:' + port + '/graphiql'));
	}
};