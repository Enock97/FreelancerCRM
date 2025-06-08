import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { userId: number };
}

const prisma = new PrismaClient();

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const [totalContacts, totalActivities, contactsByStatus] = await Promise.all([
    prisma.contact.count({ where: { userId } }),
    prisma.activity.count({ where: { userId } }),
    prisma.contact.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    }),
  ]);

  const statusCounts = contactsByStatus.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.status] = curr._count.status;
    return acc;
  }, {});

  res.json({
    totalContacts,
    totalActivities,
    statusCounts,
  });
};
