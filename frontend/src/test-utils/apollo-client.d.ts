// Test-only types so TS accepts the imports your code uses in tests.
// These do NOT ship; they live under src/__tests__.

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '@apollo/client' {
  // Minimal ApolloLink surface your code needs
  export class ApolloLink {
    concat(next: ApolloLink): ApolloLink;
    split(...args: unknown[]): ApolloLink;
    request?: (...args: unknown[]) => unknown;
  }

  // HttpLink extends ApolloLink so `.concat(httpLink)` type-checks
  export class HttpLink extends ApolloLink {
    constructor(options?: { uri?: string; headers?: Record<string, string>; fetchOptions?: Record<string, unknown> });
  }

  export class InMemoryCache {
    constructor(options?: Record<string, unknown>);
  }

  export class ApolloClient {
    constructor(options: { cache: InMemoryCache; link?: ApolloLink; [key: string]: unknown });
  }

  export function gql(literals: TemplateStringsArray, ...placeholders: unknown[]): unknown;

  // Keep it simple; no generics to avoid lint noise
  export function useMutation(...args: unknown[]): [
    (...args: unknown[]) => Promise<unknown>,
    { loading: boolean; error?: unknown; data?: unknown }
  ];
}
