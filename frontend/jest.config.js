module.exports = {
  // Use the default transformer for all files except node_modules
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  // Transform node_modules that use ES modules
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs)/).*"
  ],
  // Setup files to run before each test
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],
  // Test environment
  testEnvironment: "jsdom",
  // Mock modules
  moduleNameMapper: {
    "^axios$": "<rootDir>/src/__mocks__/axios.js"
  }
}
