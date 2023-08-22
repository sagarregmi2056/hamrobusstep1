const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    // Add more fields as needed
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL!',
    },
    // Add more queries here
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  // Add mutations if needed
});

module.exports = schema;
