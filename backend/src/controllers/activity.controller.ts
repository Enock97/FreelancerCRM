import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { userId: number };
}

const prisma = new PrismaClient();

export const createActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { title, note, contactId } = req.body;

  const contact = await prisma.contact.findFirst({
    where: { id: contactId, userId },
  });

  if (!contact) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

  const activity = await prisma.activity.create({
    data: {
      title,
      note,
      contactId,
      userId,
    },
  });

  res.status(201).json(activity);
};

export const getActivitiesForContact = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const contactId = parseInt(req.params.contactId);

  const activities = await prisma.activity.findMany({
    where: {
      contactId,
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(activities);
};
