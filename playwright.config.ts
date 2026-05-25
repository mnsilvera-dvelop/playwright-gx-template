import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const AUTH_FILE = path.join(__dirname, '.auth/session.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 60000,
  expect: { timeout: 10000 },

  use: {
    baseURL: process.env.BASE_URL,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 1. Corre primero, hace login y guarda la sesión
    {
      name: 'seed',
      testMatch: '**/seed.spec.ts',
    },

    // 2. Todos los demás tests reutilizan la sesión del seed
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
      dependencies: ['seed'],
      testIgnore: '**/seed.spec.ts',
    },
  ],
});