import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'off',
    launchOptions: {
      executablePath: '/opt/google/chrome/chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
        '--disable-extensions',
      ]
    }
  },
  webServer: {
    command: 'node node_modules/next/dist/bin/next start -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 60000,
  }
})
