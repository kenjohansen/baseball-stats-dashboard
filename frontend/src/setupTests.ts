// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Import MSW setup
import './mocks/setup';

// Mock the global fetch
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
});
