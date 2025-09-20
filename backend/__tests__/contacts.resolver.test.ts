import { PrismaClient } from '@prisma/client';

import { resolvers } from '../src/graphql/resolvers';

const { Query, Mutation } = resolvers as {
  Query: {
    contacts: (_p: unknown, _a: Record<string, never>, ctx: any) => Promise<any[]>;
  };
  Mutation: {
    createContact: (_p: unknown, a: { input: any }, ctx: any) => Promise<any>;
    updateContact: (_p: unknown, a: { id: number; input: any }, ctx: any) => Promise<any>;
    deleteContact: (_p: unknown, a: { id: number }, ctx: any) => Promise<boolean>;
    reorderContacts: (_p: unknown, a: { input: { id: number; order: number }[] }, ctx: any) => Promise<boolean>;
  };
};

describe('Contacts resolvers', () => {
  let prisma: PrismaClient;
  const ctx = () => ({ prisma, userId: 1, user: { id: 1 } });

  beforeEach(() => {
    prisma = new PrismaClient();
    Object.values(prisma.contact).forEach((fn: any) => fn?.mockReset?.());
    Object.values(prisma.activity).forEach((fn: any) => fn?.mockReset?.());
    (prisma.$transaction as jest.Mock).mockReset?.();
  });

  it('Query.contacts returns user-scoped contacts', async () => {
    (prisma.contact.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: 'A', userId: 1 },
      { id: 2, name: 'B', userId: 1 },
    ]);

    const result = await Query.contacts(null, {}, ctx());
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } })
    );
    expect(result).toHaveLength(2);
  });

  it('createContact creates a record with userId', async () => {
    (prisma.contact.create as jest.Mock).mockResolvedValue({ id: 10, name: 'X', userId: 1 });

    const input = { name: 'X', email: 'x@ex.com', phone: '123', company: 'XCo', status: 'NEW', note: '' };
    const result = await Mutation.createContact(null, { input }, ctx());

    expect(prisma.contact.create).toHaveBeenCalled();
    expect(result.id).toBe(10);
  });

  it('updateContact updates by id (only when owned)', async () => {
    (prisma.contact.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // ownership ok
    (prisma.contact.update as jest.Mock).mockResolvedValue({ id: 1, name: 'Z', status: 'CUSTOMER' });

    const result = await Mutation.updateContact(null, { id: 1, input: { name: 'Z', status: 'CUSTOMER' } }, ctx());

    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } })
    );
    expect(result.status).toBe('CUSTOMER');
  });

  it('deleteContact deletes by id (only when owned)', async () => {
    (prisma.contact.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // ownership ok
    (prisma.activity.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
    (prisma.contact.delete as jest.Mock).mockResolvedValue({ id: 1 });

    const ok = await Mutation.deleteContact(null, { id: 1 }, ctx());
    expect(prisma.activity.deleteMany).toHaveBeenCalledWith({ where: { contactId: 1 } });
    expect(prisma.contact.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(ok).toBe(true);
  });

  it('reorderContacts updates order in bulk (with access check)', async () => {
    const payload = [{ id: 1, order: 0 }, { id: 2, order: 1 }];

    // Access validation: ensure both contacts belong to userId 1.
    (prisma.contact.findMany as jest.Mock).mockResolvedValue([
      { id: 1, userId: 1 },
      { id: 2, userId: 1 },
    ]);

    // Allow either implementation:
    (prisma.contact.updateMany as jest.Mock).mockResolvedValue({ count: 2 });
    (prisma.contact.update as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.$transaction as jest.Mock).mockResolvedValue(true);

    const ok = await Mutation.reorderContacts(null, { input: payload }, ctx());

    const txCalls = (prisma.$transaction as jest.Mock).mock.calls;
    if (txCalls.length) {
      const ops = txCalls[0][0];
      expect(Array.isArray(ops)).toBe(true);
      expect(ops).toHaveLength(2);
    } else {
      const directCalls =
        (prisma.contact.updateMany as jest.Mock).mock.calls.length +
        (prisma.contact.update as jest.Mock).mock.calls.length;
      expect(directCalls).toBe(2);
    }

    expect(ok).toBe(true);
  });
});
