import * as React from 'react';

// Minimal stand-in so components can mount in tests.
// We accept a `client` prop to match real signature, but ignore it.
export const ApolloProvider: React.FC<{ client?: unknown; children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

export default ApolloProvider;
