import { PrismaClient, Status } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Always expects context.user.id (number)
function getUserIdFromContext(context: any): number | null {
  if (context.user && context.user.id) {
    return Number(context.user.id);
  }
  const auth = context.req?.headers?.authorization || "";
  if (auth.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      const payload = jwt.verify(token, JWT_SECRET) as any;
      return Number(payload.userId);
    } catch {
      return null;
    }
  }
  return null;
}

export const resolvers = {
  Query: {
    contacts: async (_parent: any, _args: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      return await prisma.contact.findMany({
        where: { userId },
        include: { activities: true },
        orderBy: { createdAt: "desc" },
      });
    },
    me: async (_parent: any, _args: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) return null;
      return await prisma.user.findUnique({
        where: { id: userId },
        include: { contacts: true },
      });
    },
  },

  Mutation: {
    createContact: async (_parent: any, { input }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      return await prisma.contact.create({
        data: {
          ...input,
          userId,
        },
        include: { activities: true },
      });
    },
    updateContact: async (_parent: any, { id, input }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
      if (!contact || contact.userId !== userId) throw new Error("No access");
      return await prisma.contact.update({
        where: { id: Number(id) },
        data: input,
        include: { activities: true },
      });
    },
    deleteContact: async (_parent: any, { id }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
      if (!contact || contact.userId !== userId) throw new Error("No access");
      await prisma.activity.deleteMany({ where: { contactId: Number(id) } });
      await prisma.contact.delete({ where: { id: Number(id) } });
      return true;
    },
    createActivity: async (_parent: any, { contactId, description }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      const contact = await prisma.contact.findUnique({ where: { id: Number(contactId) } });
      if (!contact || contact.userId !== userId) throw new Error("No access");
      return await prisma.activity.create({
        data: { description, contactId: Number(contactId) },
      });
    },
    deleteActivity: async (_parent: any, { id }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      const activity = await prisma.activity.findUnique({ where: { id: Number(id) } });
      if (!activity) throw new Error("Not found");
      const contact = await prisma.contact.findUnique({ where: { id: Number(activity.contactId) } });
      if (!contact || contact.userId !== userId) throw new Error("No access");
      await prisma.activity.delete({ where: { id: Number(id) } });
      return true;
    },
    register: async (_parent: any, { email, password }: any) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("User already exists");
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hash },
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    },
    login: async (_parent: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Wrong email or password");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Wrong email or password");
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    },

    updateContactStatusAndOrder: async (
      _parent: any,
      { id, status, order }: { id: number; status: string; order: number },
      context: any
    ) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
      if (!contact || contact.userId !== userId) throw new Error("Not authorized");
      return prisma.contact.update({
        where: { id: Number(id) },
        data: {
          status: Status[status as keyof typeof Status],
          order,
        },
        include: { activities: true },
      });
    },

    updateCurrentUser: async (
      _parent: any,
      { email, password }: { email?: string; password?: string },
      context: any
    ) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
    
      const updates: { email?: string; password?: string } = {};
      if (email) {
        // Check if the new email is already in use by another user
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing && existing.id !== userId) throw new Error("Email already in use.");
        updates.email = email;
      }
      if (password) updates.password = await bcrypt.hash(password, 10);
      if (Object.keys(updates).length === 0) throw new Error("No updates provided");
    
      const updated = await prisma.user.update({
        where: { id: Number(userId) }, // << this line fixes your problem
        data: updates,
      });
      return updated;
    },

    reorderContacts: async (_parent: any, { input }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");

      // Validate all contacts belong to this user
      const ids = input.map((c: any) => Number(c.id));
      const found = await prisma.contact.findMany({ where: { id:  { in: ids }, userId: Number(userId) } });
      if (found.length !== ids.length) throw new Error("No access");

      // Batch update
      const ops = input.map((c: any) =>
        prisma.contact.update({
          where: { id: Number(c.id) },
          data: { order: c.order, status: c.status },
        })
      );
      await prisma.$transaction(ops);
      return true;
    },

  },

  Contact: {
    activities: (parent: any) =>
      prisma.activity.findMany({
        where: { contactId: Number(parent.id) },
        orderBy: { createdAt: "desc" },
      }),
  },
  User: {
    contacts: (parent: any) =>
      prisma.contact.findMany({ where: { userId: Number(parent.id) } }),
  },
  Activity: {
    contact: (parent: any) =>
      prisma.contact.findUnique({ where: { id: Number(parent.contactId) } }),
  },
};
