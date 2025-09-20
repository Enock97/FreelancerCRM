import '@testing-library/jest-dom';

jest.mock('@apollo/client/link/http', () => {
  // Minimal noop HttpLink that won’t try to use fetch
  function HttpLinkMock(this: unknown) {
    return {};
  }
  return { HttpLink: HttpLinkMock };
});

jest.mock('@apollo/client/link/context', () => {
  type Headers = Record<string, string | string[] | undefined>;
  type Ctx = { headers?: Headers };

  const setContext = () => (_operation: unknown, ctx: Ctx) => ({
    headers: ctx?.headers ?? {},
  });

  return { setContext };
});
