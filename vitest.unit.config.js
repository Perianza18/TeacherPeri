import { defineConfig } from 'vitest/config'

// Database-free safety checks. Do not add the integration setup file here.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/**/*.unit.test.js'],
  },
})
