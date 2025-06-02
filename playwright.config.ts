import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['list'],                                    // Para consola
    ['html', { outputFolder: 'test-results' }], // Para reporte HTML
    ['json', { outputFile: 'test-results/results.json' }] // Para JSON
  ],

  use: {
    baseURL: 'http://localhost:3000/?test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',  // Screenshots en fallos
    video: 'retain-on-failure',     // Videos en fallos
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'npx serve public -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});