module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
        isolatedModules: true // Movido desde globals
      }]
    },
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    testMatch: [
      '<rootDir>/src/tests/**/*.test.ts',
      '<rootDir>/src/tests/**/*.test.tsx'
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };
  