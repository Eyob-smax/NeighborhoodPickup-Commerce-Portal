import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".mts", ".jsx", ".json"],
  },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    globals: true,
    clearMocks: true,
    restoreMocks: true
  }
});
