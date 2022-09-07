import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import * as dotenv from 'dotenv';
import { getUserId } from './utils';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

dotenv.config();

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => {
  console.log('server ready at ' + url);
});
