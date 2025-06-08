import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthPayload } from '../types/jwt';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(contacts);
};

export const createContact = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
  res.status(401).json({ error: 'Unauthorized' });
  return; // ← returner for å avbryte videre kjøring
}

  const { name, email, company, status, note } = req.body;

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      company,
      status,
      note,
      userId,
    },
  });

  res.status(201).json(contact);
};

export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const contactId = parseInt(req.params.id);
  const { name, email, company, status, note } = req.body;

  const contact = await prisma.contact.updateMany({
    where: {
      id: contactId,
      userId,
    },
    data: {
      name,
      email,
      company,
      status,
      note,
    },
  });

  if (contact.count === 0) res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated' });
};

export const getContactById = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const contactId = parseInt(req.params.id);

  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      userId,
    },
  });

  if (!contact) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

  res.json(contact);
};


export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const contactId = parseInt(req.params.id);

  const contact = await prisma.contact.deleteMany({
    where: {
      id: contactId,
      userId,
    },
  });

  if (contact.count === 0) res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
};
