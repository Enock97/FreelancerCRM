"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5000/api/graphql";

function createApolloClient(token: string | null) {
  return new ApolloClient({
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    }),
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === "development",
  });
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [apolloClient, setApolloClient] = useState(() => createApolloClient(null));

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setTokenState(storedToken);
    setApolloClient(createApolloClient(storedToken));
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (typeof window !== "undefined") {
      if (newToken) localStorage.setItem("token", newToken);
      else localStorage.removeItem("token");
    }
    setApolloClient(createApolloClient(newToken));
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
