/// <reference types="jest" />
import '@testing-library/jest-dom';

// Force a link-like object with .concat for this suite
jest.mock('@apollo/client/link/context', () => ({
  setContext: () => ({ concat: (next: unknown) => next }),
}));

// HttpLink mock that won't be used but keeps constructor shape
jest.mock('@apollo/client/link/http', () => ({
  HttpLink: function HttpLinkMock() { return {}; },
}));

import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

describe('AuthContext', () => {
  it('provides default values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.token).toBe(null);
    expect(typeof result.current.setToken).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('stores token on setToken and clears on logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => result.current.setToken('user-1'));
    expect(result.current.token).toBe('user-1');

    act(() => result.current.logout());
    expect(result.current.token).toBe(null);
  });
});
