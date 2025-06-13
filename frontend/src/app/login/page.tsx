'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await res.json()
      if (!res.ok || !result.token || !result.user) {
        setError('Login feilet: ugyldig respons')
        return
      }

      // Fjern gammel localStorage (valgfritt, men ryddig)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('profile_data')

      login(result.token, result.user)
      router.push('/dashboard')
    } catch (err) {
      console.log('Error:' + err)
      setError('Login feilet: nettverksfeil eller serverproblem')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Logg inn</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="E-post"
          className="w-full border px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Passord"
          className="w-full border px-3 py-2"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Logg inn
        </button>
      </form>
    </div>
  )
}
