'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import ContactForm from './ContactForm'
import ContactCard from '@/components/ContactCard'
import { Contact } from '../../../types/types'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CONTACTS } from '../../graphql/queries'
import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
} from '../../graphql/mutations'
import { ContactInputType } from '@/types/contactInput'

export default function ContactsPage() {
  const { token } = useAuth()
  const [showForm, setShowForm] = useState(false)

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    skip: !token,
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

  const [createContact] = useMutation(CREATE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetch(),
  })

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetch(),
  })

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetch(),
  })

  const handleCreate = async (input: ContactInputType) => {
    try {
      await createContact({ variables: { data: input } })
      setShowForm(false)
    } catch (e) {
      console.error('createContact-error', e)
    }
  }


  const handleUpdate = async (input: Contact) => {
    try {
      await updateContact({ variables: { data: input } })
    } catch (e) {
      console.error('Update contact error:', e)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteContact({ variables: { id } })
    } catch (e) {
      console.error('Delete contact error:', e)
    }
  }

  useEffect(() => {
    if (!loading && !token) {
      window.location.href = '/login'
    }
  }, [loading, token])

  if (loading) return <p>Laster kontakter...</p>
  if (error) return <p>Feil ved henting av kontakter: {error.message}</p>
  if (!data || !data.contacts) return <p>Ingen kontakter funnet.</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-4">Kontakter</h2>

      {showForm ? (
        <ContactForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
        >
          Legg til kontakt
        </button>
      )}

      <div className="space-y-6">
        {data.contacts.map((contact: Contact) => (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md" key={contact.id}>
            <ContactCard
              contact={contact}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              token={token!}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
