import { PrismaClient } from '@prisma/client';
import { ApolloContext } from '../types/apolloContext';
import { Resolvers } from '../types/generated/graphql';
import { CONTACT_STATUSES } from '../constants/contactstatus';

const prisma = new PrismaClient();

export const resolvers: Resolvers<ApolloContext> = {
  Query: {
    contacts: async (_, __, { user }) => {
      return prisma.contact.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      });
    },
    contact: async (_, { id }, { user }) => {
      return prisma.contact.findFirst({
        where: { id, userId: user.userId },
      });
    },
    activities: async (_, { contactId }, { user }) => {
      return prisma.activity.findMany({
        where: { contactId, userId: user.userId },
        orderBy: { createdAt: 'desc' },
      });
    },
    dashboard: async (_, __, { user }) => {
      const userId = user.userId;
      const [totalContacts, totalActivities, grouped] = await Promise.all([
        prisma.contact.count({ where: { userId } }),
        prisma.activity.count({ where: { userId } }),
        prisma.contact.groupBy({
          by: ['status'],
          where: { userId },
          _count: true,
        }),
      ]);

      const statusCounts = grouped.map((g: { status: string | null; _count: number }) => ({
        status: g.status ?? 'UNKNOWN',
        count: g._count,
      }));

      return { totalContacts, totalActivities, statusCounts };
    },
  },

  Mutation: {
    createContact: async (_, { data }, { user }) => {
      if (data.status && !CONTACT_STATUSES.includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`);
      }

      return prisma.contact.create({
        data: { ...data, userId: user.userId },
      });
    },

    updateContact: async (_, { data }, { user }) => {
      if (data.status && !CONTACT_STATUSES.includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`);
      }

      const { id, ...rest } = data;
      const updated = await prisma.contact.updateMany({
        where: { id, userId: user.userId },
        data: rest,
      });

      if (updated.count === 0) throw new Error('Contact not found');
      return prisma.contact.findUnique({ where: { id } });
    },

    deleteContact: async (_, { id }, { user }) => {
      const deleted = await prisma.contact.deleteMany({
        where: { id, userId: user.userId },
      });

      return deleted.count > 0;
    },

    createActivity: async (_, { data }, { user }) => {
      const contact = await prisma.contact.findFirst({
        where: { id: data.contactId, userId: user.userId },
      });

      if (!contact) throw new Error('Contact not found');

      return prisma.activity.create({
        data: { ...data, userId: user.userId },
      });
    },
  },
};
