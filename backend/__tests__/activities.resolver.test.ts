import { PrismaClient } from '@prisma/client';

import { resolvers } from '../src/graphql/resolvers';

const { Mutation } = resolvers as {
  Mutation: {
    createActivity: (_: unknown, a: { contactId: number; description: string }, ctx: any) => Promise<any>;
    deleteActivity: (_: unknown, a: { id: number }, ctx: any) => Promise<boolean>;
  };
};

describe('Activities resolvers', () => {
  let prisma: PrismaClient;
  const ctx = () => ({ prisma, userId: 1, user: { id: 1 } });

  beforeEach(() => {
    prisma = new PrismaClient();
    Object.values(prisma.contact).forEach((fn: any) => fn?.mockReset?.());
    Object.values(prisma.activity).forEach((fn: any) => fn?.mockReset?.());
  });

  it('createActivity inserts a row for an owned contact', async () => {
    (prisma.contact.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // ownership ok
    (prisma.activity.create as jest.Mock).mockResolvedValue({
      id: 100,
      contactId: 1,
      description: 'Called',
      createdAt: new Date(),
    });

    const result = await Mutation.createActivity(null, { contactId: 1, description: 'Called' }, ctx());
    expect(prisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contactId: 1, description: 'Called' }),
      })
    );
    expect(result.id).toBe(100);
  });

  it('deleteActivity removes a row by id (owned via its contact)', async () => {
    (prisma.activity.findUnique as jest.Mock).mockResolvedValue({ id: 100, contactId: 1 });
    (prisma.contact.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // ownership ok
    (prisma.activity.delete as jest.Mock).mockResolvedValue({ id: 100 });

    const result = await Mutation.deleteActivity(null, { id: 100 }, ctx());
    expect(prisma.activity.findUnique).toHaveBeenCalledWith({ where: { id: 100 } });
    expect(prisma.activity.delete).toHaveBeenCalledWith({ where: { id: 100 } });
    expect(result).toBe(true); // your resolver returns boolean
  });
});
