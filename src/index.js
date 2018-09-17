const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require("prisma-binding")
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')
const Subscription = require('./resolvers/Subscription')

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  // Subscription,
}

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/axel-debenham-lendon/graphql-server-test/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
server.start(() => console.log('server running on localhost 4000'))