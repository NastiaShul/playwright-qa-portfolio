import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  globalSetup: './global-setup.js',
  use: {
    API_URL: process.env.API_URL,
    BASE_URL: process.env.BASE_URL,
    actionTimeout: 3000,
  },
  testDir: './tests',
  timeout: 150 * 1000,
  expect: {
    timeout: 5000
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 2,
  reporter: [['html'], ['line'], ['allure-playwright'], ['junit', { outputFile: 'playwright-report/results.xml' }]],
  use: {
    headless: true,
    actionTimeout: 0,
    trace: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'on',
    testIdAttribute: 'data-test',
    // Stage ingress drops long-lived HTTP/2 connections -> net::ERR_CONNECTION_CLOSED in CI
    launchOptions: {
      args: ['--disable-http2', '--disable-quic'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['Galaxy S24'] },
      testIgnore: ["**/seo/**", "**/seo_bt/**"]
    },
  ],
});
