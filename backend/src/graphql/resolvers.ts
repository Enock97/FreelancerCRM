import { PrismaClient, Status } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function getUserIdFromContext(context: any): string | null {
  if (context.user && context.user.id) {
    return context.user.id.toString();
  }
  const auth = context.req?.headers?.authorization || "";
  if (auth.startsWith("Bearer ")) {
    try {
      const token = auth.slice(7);
      const payload = jwt.verify(token, JWT_SECRET) as any;
      return payload.userId as string;
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
        where: { userId: Number(userId) },
        include: { activities: true },
        orderBy: { createdAt: "desc" },
      });
    },
    me: async (_parent: any, _args: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) return null;
      return await prisma.user.findUnique({
        where: { id: Number(userId) },
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
      if (!contact || contact.userId !== Number(userId)) throw new Error("No access");
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
      if (!contact || contact.userId !== Number(userId)) throw new Error("No access");
      await prisma.activity.deleteMany({ where: { contactId: Number(id) } });
      await prisma.contact.delete({ where: { id: Number(id) } });
      return true;
    },
    createActivity: async (_parent: any, { contactId, description }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Unauthorized");
      const contact = await prisma.contact.findUnique({ where: { id: Number(contactId) } });
      if (!contact || contact.userId !== Number(userId)) throw new Error("No access");
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
      if (!contact || contact.userId !== Number(userId)) throw new Error("No access");
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
    
    // --- New for Kanban drag-and-drop ---
    updateContactStatusAndOrder: async (
        _parent: any,
        { id, status, order }: { id: number; status: string; order: number },
        context: any,
      ) => {
      const { user } = context;
      // Only allow editing own contacts
      const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
      if (!contact || contact.userId !== user.id) throw new Error("Not authorized");
      // Update status and order
      return prisma.contact.update({
        where: { id: Number(id)  },
        data: { status: Status[status as keyof typeof Status], order }
      });
      
    },

    // --- New for profile email/password update ---
    updateCurrentUser: async (
      _parent: any,
      { email, password }: { email?: string; password?: string },
      context: any
    ) => {
      try {
        const { user } = context;
        if (!user) throw new Error("Unauthorized");
        const updates: { email?: string; password?: string } = {};
        if (email) updates.email = email;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (!updates.email && !updates.password) throw new Error("No updates provided");
        console.log("Updating user:", user.id, updates);
        const updated = await prisma.user.update({
          where: { id: Number(user.id) },
          data: updates,
        });
        return updated;
      } catch (err) {
        console.error("updateCurrentUser error:", err);
        throw err;
      }
    }

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
