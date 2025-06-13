'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ContactCard from '@/components/ContactCard'
import {
  DndContext, closestCenter,
  useDroppable, DragEndEvent, PointerSensor,
  useSensor, useSensors
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CONTACTS } from '@/app/graphql/queries'
import { UPDATE_CONTACT } from '@/app/graphql/mutations'
import { Contact } from '@/types/types'
import { STATUS_OPTIONS, StatusKey } from '@/constants/status'
//import { ContactInputType } from '@/types/contactInput'

const STATUS_ENUM = STATUS_OPTIONS
type ContactStatus = StatusKey

export default function DashboardPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  const context = { headers: { Authorization: `Bearer ${token}` } }

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, { skip: !token, context })
  const [updateContact] = useMutation(UPDATE_CONTACT, { context })

  const contacts: Contact[] = data?.contacts ?? []

  /** Optimistisk oppdatering av lokal cache før vi venter på backend */
  const patchLocal = (id: number, status: ContactStatus) => {
    if (!data) return
    data.contacts = data.contacts.map((c: Contact) => c.id === id ? { ...c, status } : c)
  }

  

  const sensors = useSensors(useSensor(PointerSensor))

  const handleStatusChange = async (id: number, newStatus: ContactStatus) => {
    patchLocal(id, newStatus)
    await updateContact({ variables: { data: { id, status: newStatus } } })
    refetch()
  }

  const handleDragEnd = (evt: DragEndEvent) => {
    const id = parseInt(evt.active.id as string)
    const newStatus = evt.over?.id as ContactStatus
    if (id && newStatus) handleStatusChange(id, newStatus)
  }

  useEffect(() => {
    if (!isLoading && !token) router.push('/login')
  }, [token, isLoading, router])

  if (isLoading || loading) return <p>Laster inn…</p>
  if (error) return <p className="text-red-500">Feil: {error.message}</p>

  return (
    <main className="p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">CRM Kanban Dashboard</h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATUS_ENUM).map(([key, label]) => (
            <Column key={key} id={key} label={label} contacts={contacts} token={token!} />
          ))}
        </div>
      </DndContext>
    </main>
  )
}

/* ------------ helpers ------------ */

function Column({ id, label, contacts, token }: { id: string; label: string; contacts: Contact[]; token: string }) {
  const { setNodeRef } = useDroppable({ id })
  const list = contacts.filter(c => c.status === id)

  return (
    <div ref={setNodeRef} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow min-h-[100px] transition-colors">
      <h2 className="font-semibold text-lg mb-2">{label} ({list.length})</h2>
      <SortableContext items={list.map(c => c.id.toString())} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {list.map(c => <Card key={c.id} contact={c} token={token} />)}
        </div>
      </SortableContext>
    </div>
  )
}

function Card({ contact, token }: { contact: Contact; token: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: contact.id.toString() })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ContactCard contact={contact} token={token} />
    </div>
  )
}
