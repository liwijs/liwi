import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/',
  globalSetup: fileURLToPath(
    import.meta.resolve('./e2e/global-setup', import.meta.url),
  ),
});
