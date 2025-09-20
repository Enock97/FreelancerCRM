'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:5000/api/graphql';

type AuthContextValue = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  token: null,
  setToken: () => {},
  logout: () => {},
});

function makeApolloClient(token: string | null) {
  const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

  // Use a broadly-compatible setContext signature and cast prev context safely.
  const authLink = setContext((_, prev) => {
    const prevHeaders =
      (prev as { headers?: Record<string, string> | undefined }).headers ?? {};
    return {
      headers: {
        ...prevHeaders,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

// Avoid `{}` empty-object type by giving an explicit props shape
type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (saved) setTokenState(saved);
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem('token', t);
      else localStorage.removeItem('token');
    }
  };

  const logout = () => setToken(null);

  const client = useMemo(() => makeApolloClient(token), [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
