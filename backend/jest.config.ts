import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  clearMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/__mocks__/@prisma/client.ts',
    '^bcrypt$': '<rootDir>/__mocks__/bcrypt.ts',
    '^bcryptjs$': '<rootDir>/__mocks__/bcryptjs.ts',
    '^jsonwebtoken$': '<rootDir>/__mocks__/jsonwebtoken.ts',
    '^@/(.*)$': '<rootDir>/src/$1', // keep or remove depending on your paths
  },
};

export default config;
