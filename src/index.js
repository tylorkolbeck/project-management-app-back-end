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
const Project = require("./resolvers/Project");
const Milestone = require("./resolvers/Milestone");
const Task = require("./resolvers/Task");
const { authenticate } = require("./utils");

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
  Vote,
  Date,
  Project,
  Milestone,
  Task
};

const prisma = new PrismaClient({
  errorFormat: "minimal"
});

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: `./src/schemas/schema.graphql`,
  resolvers,

  context: (request) => {
    let token = request.request.headers.authorization || null;
    let user = {};

    if (token) {
      user.id = authenticate(token);
    }
    return {
      ...request,
      prisma,
      pubsub,
      user
    };
  }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
