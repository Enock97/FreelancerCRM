import { PrismaClient } from '@prisma/client';

import { resolvers } from '../src/graphql/resolvers';

const { Mutation } = resolvers as {
  Mutation: {
    login: (
      _p: unknown,
      args: { email: string; password: string },
      ctx: any
    ) => Promise<{ token: string } | string>;
  };
};

describe('Auth resolvers', () => {
  let prisma: PrismaClient;
  const ctx = () => ({ prisma, userId: 1, user: { id: 1 } });

  beforeEach(() => {
    prisma = new PrismaClient();
    (prisma.user.findUnique as jest.Mock).mockReset();
  });

  it('login returns a token for valid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'alice@example.com',
      password: 'hash', // your resolver reads `password`
    });

    const result = await Mutation.login(
      null,
      { email: 'alice@example.com', password: 'secret' },
      ctx()
    );

    const token = (result as any)?.token ?? result;
    expect(token).toBe('test.jwt.token');
  });

  it('login throws for invalid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      Mutation.login(null, { email: 'x', password: 'y' }, ctx())
    ).rejects.toThrow(/Wrong email or password/i);
  });
});
