// $NoFlow
const { ApolloServer, gql } = require('apollo-server'); // $NoFlow
const { GraphQLUpload } = require('graphql-upload');

// TODO stream file to the server using WebSockets
// instead of uploading it using GraphQL multipart HTTP request

// Upload was renamed to FileUpload because of a name conflict
const typeDefs = `
	scalar FileUpload
	extend type Mutation {
		uploadFiles(files: FileUpload!): String
	}
`;

const resolvers = {
	Mutation: {
		uploadFiles: async (parent: any, { files }: any) => {
			console.log(await files);
			return files[0].path;
		}
	}
}

// Export typeDefs & resolvers to be combined into one schema along with others
module.exports = {
	typeDefs,
	resolvers
};