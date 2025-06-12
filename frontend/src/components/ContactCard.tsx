'use client'

import { useState } from 'react'
import { Contact } from '../types/types'
import ContactForm from '@/app/(protected)/contacts/ContactForm'
import { useMutation } from '@apollo/client'
import { UPDATE_CONTACT, DELETE_CONTACT } from '../app/graphql/mutations'
import { GET_CONTACTS } from '../app/graphql/queries'

type Props = {
  contact: Contact
  onUpdate: (data: Contact) => void
  onDelete: (id: number) => void
  token: string
}

export default function ContactCard({ contact }: Props) {
  const [editing, setEditing] = useState(false)

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  })

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  })

  const handleSave = async (data: Omit<Contact, 'id' | 'createdAt'>) => {
    await updateContact({
      variables: {
        data: {
          id: contact.id,
          ...data,
        },
      },
    })
    setEditing(false)
  }

  const handleDelete = async () => {
    await deleteContact({ variables: { id: contact.id } })
  }

  if (editing) {
    return (
      <ContactForm
        initialData={contact}
        onSubmit={handleSave}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{contact.name}</h3>
      <p><span className="font-medium">E-post:</span> {contact.email}</p>
      <p><span className="font-medium">Telefon:</span> {contact.phone}</p>
      <p><span className="font-medium">Firma:</span> {contact.company}</p>
      <p><span className="font-medium">Status:</span> {contact.status.replace(/_/g, ' ')}</p>
      <p><span className="font-medium">Notat:</span> {contact.note}</p>

      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Rediger
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Slett
        </button>
      </div>
    </div>
  )
}
