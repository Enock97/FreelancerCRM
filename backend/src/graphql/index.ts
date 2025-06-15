import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './typeDefs';
import { resolvers } from './resolvers';
import { requireAuth } from '../middlewares/auth.middleware';
import { ApolloContext } from '../types/apolloContext';
import { json } from 'express';

const createGraphQLMiddleware = async () => {
  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Return Express middleware ready to be mounted
  return [
    json(), // For parsing JSON bodies
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          user: (req as any).user,
          req
        };
      }
    }),
  ];
};

export default createGraphQLMiddleware;
