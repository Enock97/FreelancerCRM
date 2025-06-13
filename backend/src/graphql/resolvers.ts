import { PrismaClient } from '@prisma/client'
import { ApolloContext } from '../types/apolloContext'
import { Resolvers, ContactStatus } from '../types/generated/graphql'
import { CONTACT_STATUSES } from '../constants/contactstatus'

const prisma = new PrismaClient()

export const resolvers: Resolvers<ApolloContext> = {
  Query: {
    contacts: async (_, __, { user }) => {
      const contacts = await prisma.contact.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      })

      return contacts.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        status: c.status as ContactStatus | undefined,
      }))
    },

    contact: async (_, { id }, { user }) => {
      const contact = await prisma.contact.findFirst({
        where: { id, userId: user.userId },
      })

      return contact
        ? {
            ...contact,
            createdAt: contact.createdAt.toISOString(),
            status: contact.status as ContactStatus | undefined,
          }
        : null
    },

    activities: async (_, { contactId }, { user }) => {
      const activities = await prisma.activity.findMany({
        where: { contactId, userId: user.userId },
        orderBy: { createdAt: 'desc' },
      })

      return activities.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      }))
    },

    dashboard: async (_, __, { user }) => {
      const userId = user.userId
      const [totalContacts, totalActivities, grouped] = await Promise.all([
        prisma.contact.count({ where: { userId } }),
        prisma.activity.count({ where: { userId } }),
        prisma.contact.groupBy({
          by: ['status'],
          where: { userId },
          _count: true,
        }),
      ])

      const statusCounts = grouped.map((g) => ({
        status: g.status ?? 'UNKNOWN',
        count: g._count,
      }))

      return { totalContacts, totalActivities, statusCounts }
    },
  },

  Mutation: {
    createContact: async (_, { data }, { user }) => {
      if (data.status && !CONTACT_STATUSES.includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`)
      }

      const contact = await prisma.contact.create({
        data: { ...data, userId: user.userId },
      })

      return {
        ...contact,
        createdAt: contact.createdAt.toISOString(),
        status: contact.status as ContactStatus | undefined,
      }
    },

    updateContact: async (_, { data }, { user }) => {
      if (data.status && !CONTACT_STATUSES.includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`)
      }

      const { id, ...rest } = data
      
      const prismaData: Record<string, any> = {}
      for (const key in rest) {
        const value = rest[key as keyof typeof rest]
        if (value !== null && value !== undefined) {
          prismaData[key] = value
        }
      }

      const updated = await prisma.contact.updateMany({
        where: { id, userId: user.userId },
        data: prismaData,
      })

      if (updated.count === 0) throw new Error('Contact not found')

      const updatedContact = await prisma.contact.findUnique({ where: { id } })
      if (!updatedContact) throw new Error('Contact not found')

      return {
        ...updatedContact,
        createdAt: updatedContact.createdAt.toISOString(),
        status: updatedContact.status as ContactStatus | undefined,
      }
    },


    deleteContact: async (_, { id }, { user }) => {
      const deleted = await prisma.contact.deleteMany({
        where: { id, userId: user.userId },
      })

      return deleted.count > 0
    },

    createActivity: async (_, { data }, { user }) => {
      const contact = await prisma.contact.findFirst({
        where: { id: data.contactId, userId: user.userId },
      })

      if (!contact) throw new Error('Contact not found')

      const activity = await prisma.activity.create({
        data: { ...data, userId: user.userId },
      })

      return {
        ...activity,
        createdAt: activity.createdAt.toISOString(),
      }
    },
  },
}
