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

// No longer needed now Prisma is connected
// let links = [{
//   id: 'link-0',
//   url: 'www.howtographql.com',
//   description: 'Fullstack tutorial for GraphQL'
// }]

// function findLink(id) {
//   return links.find(link => link.id === id)
// }

// function deleteLink(id) {
//   let link = findLink(id)
//   links.splice(links.indexOf(link), 1)
// }

// let idCount = links.length

// const resolvers = {
//   Query: {
//     info: () => `This is the API of a Hackernews Clone`,
//     feed: () => links,
//     link: (root, args) => findLink(args.id)
//   },
//   Mutation: {
//     post: (root, args) => {
//       const link = {
//       id:`link-${idCount++}`,
//       description: args.description,
//       url: args.url,
//       }
//     links.push(link)
//     return link
//     },
//     updateLink: (root, args) => {
//       const link = findLink(args.id)
//       link.url = args.url
//       link.description = args.description
//       return link
//     },
//     deleteLink: (root, args) => {
//       deleteLink(args.id)
//     }
//   },
// }