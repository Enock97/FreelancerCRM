// Singleton Prisma mock so every `new PrismaClient()` shares the same spies.

type JFn<R = unknown> = jest.Mock<Promise<R>, any[]>;

function makeModel() {
  return {
    findMany:   jest.fn() as JFn,
    findUnique: jest.fn() as JFn,
    create:     jest.fn() as JFn,
    update:     jest.fn() as JFn,
    delete:     jest.fn() as JFn,
    deleteMany: jest.fn() as JFn,
    updateMany: jest.fn() as JFn,
  };
}

const prismaInstance = {
  contact:  makeModel(),
  activity: makeModel(),
  user:     makeModel(),

  $connect:     jest.fn(async () => {}),
  $disconnect:  jest.fn(async () => {}),
  $transaction: jest.fn(async (_ops?: unknown) => (_ops ?? null)),
};

export class PrismaClient {
  constructor() {
    // always return the same instance
    return prismaInstance as any;
  }
}

// Optional export if you want direct access in some tests
export const __prisma = prismaInstance;
