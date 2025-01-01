import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Global timeout configuration
jest.setTimeout(30000);

// Silence specific warnings if needed
const originalError = console.error;
console.error = (...args: any[]) => {
  if (args[0]?.includes('Warning:')) return;
  originalError.call(console, ...args);
};