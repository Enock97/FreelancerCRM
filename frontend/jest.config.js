/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/__tests__'],          // only run tests in src/__tests__
  testMatch: ['**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/src/__tests__/tsconfig.json' }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test-utils/styleMock.ts',
    '^next/router$': '<rootDir>/src/test-utils/nextRouterMock.ts',
    '^next/navigation$': '<rootDir>/src/test-utils/nextNavigationMock.ts',
    '^next/link$': '<rootDir>/src/test-utils/nextLinkMock.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@apollo/client$': '<rootDir>/src/test-utils/apolloClientMock.ts',
    '^@apollo/client/react$': '<rootDir>/src/test-utils/ApolloProviderMock.tsx',
  },
  transformIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/cypress/']
};
