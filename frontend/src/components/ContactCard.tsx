'use client'

import { useState } from 'react'
import { Contact } from '@/types/types'
import { ContactInputType } from '@/types/contactInput'
import ContactForm from '@/app/(protected)/contacts/ContactForm'
import { useMutation } from '@apollo/client'
import { UPDATE_CONTACT, DELETE_CONTACT, CREATE_ACTIVITY } from '@/app/graphql/mutations'
import { GET_CONTACTS } from '@/app/graphql/queries'
import { StatusKey } from '@/constants/status'

type Props = {
  contact: Contact
  token: string
  onUpdate?: (c: Contact) => void
  onDelete?: (id: number) => void
}

/** Konverter backend-kontakt til skjemainput uten null-felter */
const toInput = (c: Contact): ContactInputType => ({
  name: c.name,
  email: c.email,
  phone: c.phone ?? '',
  company: c.company ?? '',
  note: c.note ?? '',
  status: c.status as StatusKey,
})

export default function ContactCard({ contact, token, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [activityTitle, setActivityTitle] = useState('')

  const context = { headers: { Authorization: `Bearer ${token}` } }

  const [updateContact] = useMutation(UPDATE_CONTACT, { context, refetchQueries: [{ query: GET_CONTACTS }] })
  const [deleteContact] = useMutation(DELETE_CONTACT, { context, refetchQueries: [{ query: GET_CONTACTS }] })
  const [createActivity] = useMutation(CREATE_ACTIVITY, { context, refetchQueries: [{ query: GET_CONTACTS }] })

  /* -------- handlers -------- */

  const handleSave = async (changes: ContactInputType) => {
    const payload = { id: contact.id, ...changes }
    await updateContact({ variables: { data: payload } })
    onUpdate?.({ ...contact, ...changes })
    setEditing(false)
  }

  const handleRemove = async () => {
    await deleteContact({ variables: { id: contact.id } })
    onDelete?.(contact.id)
  }

  const handleAddActivity = async () => {
    if (!activityTitle.trim()) return
    await createActivity({
      variables: { data: { title: activityTitle, contactId: contact.id } },
    })
    setActivityTitle('')
    setShowActivity(false)
  }

  /* -------- render -------- */

  if (editing) {
    return (
      <ContactForm
        initialData={toInput(contact)}
        onSubmit={handleSave}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="space-y-2 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow transition-colors">
      <h3 className="text-xl font-semibold">{contact.name}</h3>
      <p><span className="font-medium">E-post:</span> {contact.email}</p>
      {contact.phone && <p><span className="font-medium">Telefon:</span> {contact.phone}</p>}
      {contact.company && <p><span className="font-medium">Firma:</span> {contact.company}</p>}
      <p><span className="font-medium">Status:</span> {contact.status.replace(/_/g, ' ')}</p>
      {contact.note && <p><span className="font-medium">Notat:</span> {contact.note}</p>}

      {/* Aktivitet */}
      {showActivity ? (
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
            placeholder="Ny aktivitet..."
            value={activityTitle}
            onChange={(e) => setActivityTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddActivity}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Lagre
            </button>
            <button
              onClick={() => setShowActivity(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowActivity(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Aktivitet
        </button>
      )}

      {/* Kontroller */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Rediger
        </button>
        <button
          onClick={handleRemove}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Slett
        </button>
      </div>
    </div>
  )
}
