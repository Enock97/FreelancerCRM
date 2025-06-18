import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { userId: number };
}

const prisma = new PrismaClient();
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { id: true, email: true }, 
    });

    if (!user) res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const updates: { email?: string; password?: string } = {};

    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updated = await prisma.user.update({
      where: { id: req.user?.userId },
      data: updates,
    });

    res.json({ message: 'Profile updated', user: { email: updated.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error under update' });
  }
};
