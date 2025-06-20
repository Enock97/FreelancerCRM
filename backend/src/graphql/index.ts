import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './typeDefs';
import { resolvers } from './resolvers';
import { requireAuth } from '../middlewares/auth.middleware';
import { ApolloContext } from '../types/apolloContext';
import { json } from 'express';
import jwt from 'jsonwebtoken';

// You can adjust this interface as needed for your user object
interface DecodedToken {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

const createGraphQLMiddleware = async () => {
  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
  });

  await server.start();


  return [
    json(), 
    expressMiddleware(server, {
      context: async ({ req }) => {
        // === JWT extraction logic added ===
        let user = null;
        const auth = req.headers.authorization;
        if (auth && auth.startsWith("Bearer ")) {
          const token = auth.split(" ")[1];
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            if (decoded && typeof decoded === "object" && "userId" in decoded) {
              user = { id: (decoded as any).userId, email: (decoded as any).email };
            }
          } catch {
            user = null;
          }
        }
        // === END JWT logic ===
        return {
          user: (req as any).user,
          req,
        };
      }
    }),
  ];
};

export default createGraphQLMiddleware;
