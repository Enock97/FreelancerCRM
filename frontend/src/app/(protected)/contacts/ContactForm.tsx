'use client'

import { useState } from 'react'
import { STATUS_OPTIONS } from '@/constants/status'
import { ContactInputType } from '@/types/contactInput'

type Props = {
  onSubmit: (data: ContactInputType) => void
  onCancel: () => void
  initialData?: ContactInputType
}

export default function ContactForm({ onSubmit, onCancel, initialData }: Props) {
  const [form, setForm] = useState<ContactInputType>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    company: initialData?.company ?? '',
    note: initialData?.note ?? '',
    status: initialData?.status ?? 'VENTER_PA_SVAR',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black dark:text-white">
      {(['name', 'email', 'phone', 'company'] as const).map((field) => (
        <input
          key={field}
          name={field}
          type={field === 'email' ? 'email' : 'text'}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field] ?? ''}
          onChange={handleChange}
          required={field === 'name' || field === 'email'}
          className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
        />
      ))}

      <textarea
        name="note"
        placeholder="Notat"
        value={form.note ?? ''}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
      >
        {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lagre</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Avbryt</button>
      </div>
    </form>
  )
}
