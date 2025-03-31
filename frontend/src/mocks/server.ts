import { handlers } from './handlers';

// Create a mock server that doesn't rely on MSW's setupServer
const server = {
  listen: jest.fn(),
  resetHandlers: jest.fn(),
  use: jest.fn(),
  close: jest.fn()
};

export { server, handlers };
