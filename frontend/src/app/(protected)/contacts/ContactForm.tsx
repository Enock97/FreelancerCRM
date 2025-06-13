'use client'

import { useState } from 'react'
import { ContactInputType } from '@/types/contactInput'
import { STATUS_OPTIONS, StatusKey } from '@/constants/status'

type Props = {
  onSubmit: (data: ContactInputType) => void
  onCancel: () => void
  initialData?: ContactInputType
}


export default function ContactForm({ initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ContactInputType>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone,
    company: initialData?.company,
    note: initialData?.note,
    status: (initialData?.status as StatusKey) ?? 'VENTER_PA_SVAR',
  })

  const handleChange =
    (field: keyof ContactInputType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black dark:text-white">
      <input
        className="w-full p-2 border rounded bg-white dark:bg-gray-900"
        placeholder="Navn"
        value={form.name}
        onChange={handleChange('name')}
        required
      />
      <input
        className="w-full p-2 border rounded bg-white dark:bg-gray-900"
        type="email"
        placeholder="E-post"
        value={form.email}
        onChange={handleChange('email')}
        required
      />
      <input
        className="w-full p-2 border rounded bg-white dark:bg-gray-900"
        placeholder="Telefon"
        value={form.phone ?? ''}
        onChange={handleChange('phone')}
      />
      <input
        className="w-full p-2 border rounded bg-white dark:bg-gray-900"
        placeholder="Firma"
        value={form.company ?? ''}
        onChange={handleChange('company')}
      />
      <textarea
        className="w-full p-2 border rounded bg-white dark:bg-gray-900"
        placeholder="Notat"
        value={form.note ?? ''}
        onChange={handleChange('note')}
      />
      <select
        className="w-full p-2 border rounded bg-white dark:bg-gray-900"
        value={form.status}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, status: e.target.value as StatusKey }))
        }
      >
        {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">
          Lagre
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Avbryt
        </button>
      </div>
    </form>
  )
}
