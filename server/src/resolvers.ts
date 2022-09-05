import { PrismaClient } from '@prisma/client';
import { head, isNil, isEmpty } from 'ramda';

interface ResolverContext {
  prisma: PrismaClient;
}

const resolvers = {
  Query: {
    words: async (_: any, args: any, context: ResolverContext) => {
      return isNil(args.prefix) || isEmpty(args.prefix)
        ? context.prisma.wordDoc.findMany()
        : context.prisma.wordDoc.findMany({
            where: {
              prefix: args.prefix.toUpperCase(),
            },
          });
    },
  },

  Mutation: {
    createWordDoc: async (_: any, args: any, context: ResolverContext) => {
      const word = await context.prisma.wordDoc.create({
        data: { ...args.word, prefix: head(args.word.word).toUpperCase() },
      });
      return word;
    },
    updateWordDoc: async (_: any, args: any, context: ResolverContext) => {
      const word = await context.prisma.wordDoc.update({
        where: {
          id: args.id,
        },
        data: args.word,
      });
      return word;
    },
    deleteWordDoc: async (_: any, args: any, context: ResolverContext) => {
      const word = await context.prisma.wordDoc.delete({
        where: {
          id: args.id,
        },
      });
      return word;
    },
    increaseWordReviewCount: async (_: any, args: any, context: ResolverContext) => {
      const word = await context.prisma.wordDoc.update({
        where: {
          id: args.id,
        },
        data: {
          review_count: {
            increment: 1,
          },
        },
      });
      return word;
    },
  },
};

export default resolvers;
