import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log('server ready at ' + url);
});
