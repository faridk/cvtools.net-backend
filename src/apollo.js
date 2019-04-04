// $NoFlow
const { ApolloServer, gql } = require('apollo-server'); // $NoFlow
const lodash = require('lodash'); // $NoFlow
const graphqlTools = require('graphql-tools');
const appInfo = require('./appInfo');
const auth = require('./auth');


// If you had Query fields not associated with a
// specific type you could put them here
const Query = `
  type Query {
    _empty: String
  }
`;
const initialResolvers = {};
const typeDefs = [Query,
	appInfo.typeDefs.toString(), auth.typeDefs.toString()];
const resolvers = lodash.merge(initialResolvers,
	appInfo.resolvers, auth.resolvers);
var schema = graphqlTools.makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});


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