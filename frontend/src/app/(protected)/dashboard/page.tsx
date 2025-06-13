'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ContactCard from '@/components/ContactCard'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CONTACTS } from '@/app/graphql/queries'
import { UPDATE_CONTACT } from '@/app/graphql/mutations'
import { Contact } from '@/types/types'
import { STATUS_OPTIONS, StatusKey } from '@/constants/status'

const STATUS_ENUM = STATUS_OPTIONS
type ContactStatus = StatusKey

export default function DashboardPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    skip: !token,
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

  const contacts: Contact[] = data?.contacts ?? []

  /* ---------- sensor ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleUpdateStatus = async (id: number, status: ContactStatus) => {
    await updateContact({ variables: { data: { id, status } } })
    refetch()
  }

  const onDragEnd = (evt: DragEndEvent) => {
    const id = parseInt(evt.active.id as string)
    const newStatus = evt.over?.id as ContactStatus | undefined
    if (id && newStatus) handleUpdateStatus(id, newStatus)
  }

  useEffect(() => {
    if (!isLoading && !token) router.push('/login')
  }, [isLoading, token, router])

  if (isLoading || loading || !token) return <p>Laster ...</p>
  if (error) return <p className="text-red-600">Feil: {error.message}</p>

  return (
    <main className="p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">CRM Kanban Dashboard</h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATUS_ENUM).map(([key, label]) => (
            <StatusColumn
              key={key}
              id={key}
              label={label}
              contacts={contacts.filter((c) => c.status === key)}
              token={token}
            />
          ))}
        </div>
      </DndContext>
    </main>
  )
}

/* ---------- kolonne ---------- */
function StatusColumn({
  id,
  label,
  contacts,
  token,
}: {
  id: string
  label: string
  contacts: Contact[]
  token: string
}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="font-semibold mb-2">
        {label} ({contacts.length})
      </h2>

      <SortableContext
        items={contacts.map((c) => c.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {contacts.map((c) => (
            <Draggable contact={c} key={c.id} token={token} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

/* ---------- draggable wrapper ---------- */
function Draggable({ contact, token }: { contact: Contact; token: string }) {
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({
    id: contact.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ContactCard contact={contact} token={token} onDelete={() => {}} onUpdate={() => {}} />
    </div>
  )
}
