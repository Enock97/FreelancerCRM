import { AuthPayload } from '../../types/jwt';

declare namespace Express {
  export interface Request {
    user?: AuthPayload;
  }
}
