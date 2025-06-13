'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '../../graphql/mutations'

export default function ProfilePage() {
  const { token, isLoading, user } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company: '',
    location: '',
  })

  const [realPassword, setRealPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [updateUser] = useMutation(UPDATE_USER, {
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

  useEffect(() => {
    if (!isLoading && !token) router.push('/login')

    if (token) {
      const stored = localStorage.getItem('profile_data')
      if (stored && stored !== 'undefined') {
        try {
          const parsed = JSON.parse(stored)
          setRealPassword(parsed.password || '')
          setForm({
            ...parsed,
            email: user?.email || parsed.email || '',
            password: '*'.repeat((parsed.password || '').length),
          })
        } catch {
          setForm((prev) => ({
            ...prev,
            email: user?.email || '',
            password: '********',
          }))
        }
      } else {
        setForm((prev) => ({
          ...prev,
          email: user?.email || '',
          password: '********',
        }))
      }
    }
  }, [token, isLoading, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'password') setRealPassword(value)
  }

  const handleSave = async () => {
    const input: Record<string, string> = {}
    if (form.email) input.email = form.email
    if (form.password && !form.password.includes('*')) input.password = form.password
    if (form.name)     input.name     = form.name
    if (form.phone)    input.phone    = form.phone
    if (form.company)  input.company  = form.company
    if (form.location) input.location = form.location

    try {
      await updateUser({ variables: { data: input } })
      if (input.password) form.password = '*'.repeat(input.password.length)
      localStorage.setItem('profile_data', JSON.stringify(form))
    } catch (e) {
      console.error('updateUser-error', e)
    }
  }



  if (isLoading || !token) return null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 text-black dark:text-white transition-colors">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 relative">
        <h1 className="text-3xl font-bold mb-6 text-center">Min Profil</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">E-post</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium mb-1">Passord</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={showPassword ? realPassword : form.password}
                onChange={handleChange}
                className="w-full border p-2 pr-10 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 dark:text-gray-300"
              >
                {showPassword ? 'Skjul' : 'Vis'}
              </button>
            </div>
          </div>

          {['name', 'phone', 'company', 'location'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-medium mb-1 capitalize">{field}</label>
              <input
                id={field}
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-white dark:bg-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
          >
            Lagre
          </button>
        </div>
      </div>
    </main>
  )
}
