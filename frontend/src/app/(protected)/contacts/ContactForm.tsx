'use client'

import { useState } from 'react'
import { Contact } from '../../../types/types'
import { STATUS_OPTIONS, StatusKey } from '@/constants/status'

type Props = {
  onSubmit: (data: Omit<Contact, 'id' | 'createdAt'>) => void
  onCancel: () => void
  initialData?: Contact
}

export default function ContactForm({ onSubmit, onCancel, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [company, setCompany] = useState(initialData?.company ?? '')
  const [note, setNote] = useState(initialData?.note ?? '')
  const [status, setStatus] = useState<StatusKey>(
    (initialData?.status as StatusKey) ?? 'VENTER_PA_SVAR'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, phone, company, note, status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black dark:text-white">
      <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white" placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white" placeholder="E-post" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white" placeholder="Firma" value={company} onChange={(e) => setCompany(e.target.value)} />
      <textarea className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white" placeholder="Notat" value={note} onChange={(e) => setNote(e.target.value)} />
      
      <select className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white" value={status} onChange={(e) => setStatus(e.target.value as StatusKey)}>
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
