import { PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';
import { head, isNil, isEmpty } from 'ramda';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface ResolverContext {
  userId: string | null;
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
      if (isNil(context.userId)) throw new AuthenticationError('not authentication');

      const word = await context.prisma.wordDoc.create({
        data: { ...args.word, prefix: head(args.word.word).toUpperCase() },
      });
      return word;
    },
    updateWordDoc: async (_: any, args: any, context: ResolverContext) => {
      if (isNil(context.userId)) throw new AuthenticationError('not authentication');

      const word = await context.prisma.wordDoc.update({
        where: {
          id: args.id,
        },
        data: args.word,
      });
      return word;
    },
    deleteWordDoc: async (_: any, args: any, context: ResolverContext) => {
      if (isNil(context.userId)) throw new AuthenticationError('not authentication');

      const word = await context.prisma.wordDoc.delete({
        where: {
          id: args.id,
        },
      });
      return word;
    },
    increaseWordReviewCount: async (_: any, args: any, context: ResolverContext) => {
      if (isNil(context.userId)) throw new AuthenticationError('not authentication');

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

    signup: async (_: any, args: any, context: ResolverContext) => {
      const password = await bcrypt.hash(args.password, 10);

      const user = await context.prisma.user.create({
        data: {
          ...args,
          password,
        },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string);

      return {
        token,
        user,
      };
    },

    login: async (_: any, args: any, context: ResolverContext) => {
      const user = await context.prisma.user.findUnique({ where: { email: args.email } });

      if (!user) {
        throw new Error('No such user found');
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string);

      return {
        token,
        user,
      };
    },
  },
};

export default resolvers;
