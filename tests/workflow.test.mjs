import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const execFileAsync = promisify(execFile);

test("Pages workflow verifies first and deploys only site/ with current official actions", async () => {
  const workflow = await readFile(".github/workflows/pages.yml", "utf8");
  for (const action of [
    "actions/checkout@v7",
    "actions/setup-node@v7",
    "actions/configure-pages@v6",
    "actions/upload-pages-artifact@v5",
    "actions/deploy-pages@v5"
  ]) {
    assert.ok(workflow.includes(action), `missing ${action}`);
  }
  for (const command of [
    "npm ci",
    "npx playwright install --with-deps chromium",
    "npm run verify",
    "npm run audit"
  ]) {
    assert.ok(workflow.includes(command), `missing workflow command: ${command}`);
  }
  assert.match(workflow, /path:\s+\.\/site\s*$/m);
  assert.match(workflow, /include-hidden-files:\s+true\s*$/m);
  assert.doesNotMatch(workflow, /path:\s+\.\s*$/m);
  assert.match(workflow, /pages:\s+write/);
  assert.match(workflow, /id-token:\s+write/);
  assert.match(workflow, /environment:\s*\n\s+name:\s+github-pages/);
  for (const job of ["package", "deploy"]) {
    const jobBlock = workflow.match(new RegExp(`${job}:\\s*\\n\\s+if:\\s+([^\\n]+)`));
    assert.ok(jobBlock, `missing deployment guard for ${job}`);
    assert.match(jobBlock[1], /github\.event_name != 'pull_request'/);
    assert.match(jobBlock[1], /github\.ref == 'refs\/heads\/main'/);
  }
});

test("tracked files exclude private job-search source documents", async () => {
  const { stdout } = await execFileAsync("git", ["ls-files"], { encoding: "utf8" });
  const tracked = stdout.split(/\r?\n/).filter(Boolean);
  const forbidden = tracked.filter((path) => /\.(?:pdf|docx|csv|mhtml)$/i.test(path) || /pasted-text/i.test(path));
  assert.deepEqual(forbidden, []);
});

test("README documents exact local and Pages operations", async () => {
  const readme = await readFile("README.md", "utf8");
  for (const text of [
    "npm ci",
    "npx playwright install chromium",
    "npm run serve",
    "npm run verify",
    "npm run audit",
    "site/",
    "GitHub Actions",
    "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/",
    "PDF, DOCX, CSV"
  ]) {
    assert.ok(readme.includes(text), `README is missing: ${text}`);
  }
});
