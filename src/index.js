require("dotenv").config();
const { GraphQLServer, PubSub } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Vote = require("./resolvers/Vote");
const Subscription = require("./resolvers/Subscription");
const Date = require("./resolvers/customScalarResolver");

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
  Vote,
  Date
};

const prisma = new PrismaClient({
  errorFormat: "minimal"
});

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: `./src/schemas/schema.graphql`,
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
      pubsub
    };
  }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
