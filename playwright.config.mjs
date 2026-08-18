import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT || 4173);
const baseURL = `http://127.0.0.1:${port}/mikhail-eroshkin-portfolio/`;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  use: {
    baseURL: baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [{ name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run serve",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
