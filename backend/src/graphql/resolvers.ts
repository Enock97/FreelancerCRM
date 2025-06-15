import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function getUserIdFromContext(context: any): string | null {
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
      if (!userId) throw new Error("Ikke autentisert");
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
      if (!userId) throw new Error("Ikke autentisert");
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
      if (!userId) throw new Error("Ikke autentisert");
      const contact = await prisma.contact.findUnique({ where: { id } });
      if (!contact || contact.userId !== Number(userId)) throw new Error("Ingen tilgang");
      return await prisma.contact.update({
        where: { id },
        data: {
          ...input,
        },
        include: { activities: true },
      });
    },
    deleteContact: async (_parent: any, { id }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Ikke autentisert");
      const contact = await prisma.contact.findUnique({ where: { id } });
      if (!contact || contact.userId !== Number(userId)) throw new Error("Ingen tilgang");
      await prisma.activity.deleteMany({ where: { contactId: id } });
      await prisma.contact.delete({ where: { id } });
      return true;
    },
    createActivity: async (_parent: any, { contactId, description }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Ikke autentisert");
      const contact = await prisma.contact.findUnique({ where: { id: contactId } });
      if (!contact || contact.userId !== Number(userId)) throw new Error("Ingen tilgang");
      return await prisma.activity.create({
        data: { description, contactId },
      });
    },
    deleteActivity: async (_parent: any, { id }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Ikke autentisert");
      const activity = await prisma.activity.findUnique({ where: { id } });
      if (!activity) throw new Error("Ikke funnet");
      const contact = await prisma.contact.findUnique({ where: { id: activity.contactId } });
      if (!contact || contact.userId !== Number(userId)) throw new Error("Ingen tilgang");
      await prisma.activity.delete({ where: { id } });
      return true;
    },
    register: async (_parent: any, { email, password }: any) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("Bruker finnes allerede");
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hash },
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    },
    login: async (_parent: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Feil e-post eller passord");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Feil e-post eller passord");
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    },
    updateProfile: async (_parent: any, { input }: any, context: any) => {
      const userId = getUserIdFromContext(context);
      if (!userId) throw new Error("Ikke autentisert");
      const data: any = {};
      if (input.email) data.email = input.email;
      if (input.password) data.password = await bcrypt.hash(input.password, 10);
      return await prisma.user.update({
        where: { id: Number(userId) },
        data,
      });
    },
  },

  Contact: {
    activities: (parent: any) =>
      prisma.activity.findMany({
        where: { contactId: parent.id },
        orderBy: { createdAt: "desc" },
      }),
  },
  User: {
    contacts: (parent: any) =>
      prisma.contact.findMany({ where: { userId: parent.id } }),
  },
  Activity: {
    contact: (parent: any) =>
      prisma.contact.findUnique({ where: { id: parent.contactId } }),
  },
};
