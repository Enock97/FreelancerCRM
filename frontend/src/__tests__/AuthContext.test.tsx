import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import '@testing-library/jest-dom'


describe('AuthContext', () => {
  it('provides default values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.token).toBe(null)
    expect(typeof result.current.setToken).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  it('stores token on setToken and clears on logout', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.setToken('mock-token')
    })
    expect(result.current.token).toBe('mock-token')

    act(() => {
      result.current.logout()
    })
    expect(result.current.token).toBe(null)
  })
})
