// graphqlServer.js
const { ApolloServer } = require("apollo-server-express");
const { readFileSync } = require("fs");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { gql } = require("graphql-tag");
// const { runEveryMidnight, dbConnection, errorHandler } = require("./helpers");
// const logger = require("./helpers/logger");
const context = require("./context");

async function setupGraphQLServer(app) {
  console.log("Setting up GraphQL server...");
  const typeDefs = gql(readFileSync("./grqphqlschema/typeDefs.gql", "utf-8"));
  const resolvers = require("./grqphqlschema/resolvers");

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context,
    playground: true,
  });

  await server.start();
  server.applyMiddleware({ app });
  console.log("GraphQL server started successfully!");
}

module.exports = { setupGraphQLServer };
