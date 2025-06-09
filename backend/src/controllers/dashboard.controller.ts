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

  type ContactStatus = 'VENTER_PA_SVAR' | 'I_SAMTALE' | 'TENKER_PA_DET' | 'AVKLART';

  const statusCounts = contactsByStatus.reduce<Record<ContactStatus, number>>((acc, curr) => {
    if (curr.status) {
      acc[curr.status as ContactStatus] = curr._count.status;
    }
    return acc;
  }, {
    VENTER_PA_SVAR: 0,
    I_SAMTALE: 0,
    TENKER_PA_DET: 0,
    AVKLART: 0,
  });


  res.json({
    totalContacts,
    totalActivities,
    statusCounts,
  });
};
