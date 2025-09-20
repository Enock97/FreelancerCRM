/* Mock for @apollo/client used only in Jest tests. */

export class ApolloClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Record<string, unknown>) {
    // ignore options
  }
}

export class InMemoryCache {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Record<string, unknown> = {}) {
    // ignore options
  }
}

export class HttpLink {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Record<string, unknown> = {}) {
    // ignore options
  }
}

// Minimal gql tag that returns a concatenated string
export function gql(strings: TemplateStringsArray, ...exprs: unknown[]): string {
  return strings.reduce((acc, s, i) => acc + s + (exprs[i] ?? ''), '');
}

// Return type for a mocked useMutation tuple
type MutationTuple = [jest.Mock, { loading: boolean; error: unknown; data: unknown }];

// Basic hook stubs
export function useMutation(): MutationTuple {
  return [jest.fn(), { loading: false, error: undefined, data: undefined }];
}
