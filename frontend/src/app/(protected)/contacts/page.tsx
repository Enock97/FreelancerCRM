'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ContactForm from './ContactForm'
import ContactCard from '@/components/ContactCard'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CONTACTS } from '@/app/graphql/queries'
import { CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACT } from '@/app/graphql/mutations'
import { Contact } from '@/types/types'
import { ContactInputType } from '@/types/contactInput'

export default function ContactsPage() {
  const { token, isLoading } = useAuth()
  const [showForm, setShowForm] = useState(false)

  const context = { headers: { Authorization: `Bearer ${token}` } }

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    skip: !token,
    context,
  })

  const [createContact] = useMutation(CREATE_CONTACT, { context, onCompleted: () => refetch() })
  const [updateContact] = useMutation(UPDATE_CONTACT, { context, onCompleted: () => refetch() })
  const [deleteContact] = useMutation(DELETE_CONTACT, { context, onCompleted: () => refetch() })

  /* redirect hvis ikke innlogget */
  useEffect(() => {
    if (!isLoading && !token) window.location.href = '/login'
  }, [isLoading, token])

  if (isLoading || loading) return <p>Laster kontakter…</p>
  if (error) return <p className="text-red-600">Feil: {error.message}</p>

  const handleCreate = async (input: ContactInputType) => {
    await createContact({ variables: { data: input } })
    setShowForm(false)
  }

  const handleUpdate = async (changes: ContactInputType & { id: number }) => {
    await updateContact({ variables: { data: changes } })
  }

  const handleDelete = async (id: number) => {
    await deleteContact({ variables: { id } })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-4">Kontakter</h2>

      {showForm ? (
        <ContactForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
        >
          Legg til kontakt
        </button>
      )}

      <div className="space-y-6">
        {data.contacts.map((c: Contact) => (
          <ContactCard
            key={c.id}
            contact={c}
            token={token!}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
