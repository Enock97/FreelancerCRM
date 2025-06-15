import { AuthPayload } from '../middlewares/auth.middleware';

export interface ApolloContext {
  user: AuthPayload | null;
}
