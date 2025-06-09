import { Request, Response } from 'express';
import { PrismaClient, ContactStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

const isValidStatus = (value: any): value is ContactStatus => {
  return Object.values(ContactStatus).includes(value);
};

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

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
    return;
  }

  const { name, email, phone, company, status, note } = req.body;

  if (!isValidStatus(status)) {
    res.status(400).json({ error: `Ugyldig statusverdi: ${status}` });
    return;
  }

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      phone,
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
  const { name, email, phone, company, status, note } = req.body;

  if (!isValidStatus(status)) {
    res.status(400).json({ error: `Ugyldig statusverdi: ${status}` });
    return;
  }

  const updated = await prisma.contact.updateMany({
    where: {
      id: contactId,
      userId,
    },
    data: {
      name,
      email,
      phone,
      company,
      status,
      note,
    },
  });

  if (updated.count === 0) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

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

  const deleted = await prisma.contact.deleteMany({
    where: {
      id: contactId,
      userId,
    },
  });

  if (deleted.count === 0) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

  res.json({ message: 'Deleted' });
};

export const getContactSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const total = await prisma.contact.count({ where: { userId } });

  const grouped = await prisma.contact.groupBy({
    by: ['status'],
    where: { userId },
    _count: true,
  });

  const statusBreakdown: Record<ContactStatus, number> = {
    VENTER_PA_SVAR: 0,
    I_SAMTALE: 0,
    TENKER_PA_DET: 0,
    AVKLART: 0,
  };

  for (const g of grouped) {
    if (g.status) statusBreakdown[g.status] = g._count;
  }

  res.json({ total, statusBreakdown });
};
