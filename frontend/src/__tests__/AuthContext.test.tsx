import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

describe('AuthContext', () => {
  it('provides default values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.token).toBe(null)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  it('stores token on login and clears on logout', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.login('mock-token')
    })
    expect(result.current.token).toBe('mock-token')

    act(() => {
      result.current.logout()
    })
    expect(result.current.token).toBe(null)
  })
})