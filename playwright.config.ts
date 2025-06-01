import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [['list']],

  use: {
    baseURL: 'http://localhost:3000/?test',
    trace: 'on-first-retry',
    // Habilitar cobertura de código
    // collectCoverage: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Configurar cobertura específica para Chromium
        contextOptions: {
          // Habilitar cobertura de JavaScript
          recordVideo: undefined,
        }
      },
    },
  ],

  webServer: {
    command: 'npx serve public -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});