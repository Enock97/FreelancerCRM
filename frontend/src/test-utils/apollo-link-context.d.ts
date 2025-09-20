// Test-only type for setContext: it returns an ApolloLink-like thing
declare module '@apollo/client/link/context' {
  import { ApolloLink } from '@apollo/client';
  export function setContext(setter?: (...args: unknown[]) => unknown): ApolloLink;
}
