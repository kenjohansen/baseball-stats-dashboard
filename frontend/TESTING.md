# Frontend Testing Guide

This document provides instructions for running the automated tests for the Baseball Stats Dashboard frontend.

## Overview

The frontend test suite includes:

1. **Component Tests**: Verify that React components render correctly and handle user interactions properly
2. **API Integration Tests**: Ensure that API calls are made correctly and responses are handled appropriately
3. **Error Handling Tests**: Validate that the application handles error conditions gracefully

## Prerequisites

Before running the tests, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installing Dependencies

To install the required testing dependencies, run:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

## Running Tests

To run all tests, use the following command in the frontend directory:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- src/components/PlayerDashboard.test.tsx
```

To run tests in watch mode (tests will automatically re-run when files change):

```bash
npm test -- --watch
```

## Test Coverage

To generate a test coverage report:

```bash
npm test -- --coverage
```

This will create a coverage report in the `coverage` directory. Open `coverage/lcov-report/index.html` in a browser to view the detailed report.

## Test Structure

The tests are organized as follows:

- `src/setupTests.ts`: Configuration for the Jest testing environment
- `src/mocks/`: Mock service worker setup for API call interception
  - `handlers.ts`: API endpoint mocks
  - `server.ts`: MSW server setup
- Component tests:
  - `src/components/PlayerDashboard.test.tsx`
  - `src/components/PlayerViewDialog.test.tsx`
  - `src/components/PlayerEditDialog.test.tsx`

## Mocking Strategy

The tests use Mock Service Worker (MSW) to intercept API calls and provide mock responses. This allows the tests to run without a backend server while still testing the full component behavior, including API interactions.

## What's Being Tested

### PlayerDashboard Component
- Initial loading state
- Successful data fetching and display
- Search/filtering functionality
- Error handling
- Dialog opening (view, edit, delete)

### PlayerViewDialog Component
- Rendering player information correctly
- Dialog actions (close)
- Handling null player data

### PlayerEditDialog Component
- Form rendering with player data
- Form validation
- Form submission
- Error handling
- Dialog actions (save, cancel)

## Adding New Tests

When adding new components or functionality, follow these guidelines for creating tests:

1. Create a test file with the same name as the component, adding `.test.tsx` extension
2. Import the necessary testing utilities and the component to test
3. Write test cases that cover the component's functionality
4. Use MSW to mock any API calls the component makes
5. Test both success and error scenarios

## Troubleshooting

If you encounter issues running the tests:

1. Make sure all dependencies are installed
2. Check that the component imports are correct
3. Verify that the mock API endpoints match what the components expect
4. Look for any console errors during test execution

For more information on React Testing Library, see the [official documentation](https://testing-library.com/docs/react-testing-library/intro/).
