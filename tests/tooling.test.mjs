import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("tooling exposes the required verification commands", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(pkg.private, true);
  assert.equal(pkg.engines.node, ">=22");
  for (const script of ["build", "serve", "check:static", "check:html", "check:links", "test:e2e", "audit", "verify"]) {
    assert.equal(typeof pkg.scripts[script], "string", `missing npm script ${script}`);
  }
  for (const dep of [
    "@axe-core/playwright",
    "@fontsource-variable/commissioner",
    "@fontsource-variable/unbounded",
    "@lhci/cli",
    "@playwright/test",
    "html-validate"
  ]) {
    assert.equal(typeof pkg.devDependencies?.[dep], "string", `missing dev dependency ${dep}`);
  }
});

test("tooling source files include the hardening changes", async () => {
  const ignore = await readFile(".gitignore", "utf8");
  for (const entry of [".DS_Store", "Thumbs.db", ".superpowers/", "dist/", ".worktrees/", "node_modules/", "playwright-report/", "test-results/", "lighthouse-report/", ".lighthouseci/"]) {
    assert.match(ignore, new RegExp(`^${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
  }

  const serve = await readFile("scripts/serve.mjs", "utf8");
  assert.match(serve, /try\s*\{\s*pathname = decodeURIComponent\(url\.pathname\);/);
  assert.match(serve, /catch\s*\(error\)/);
  assert.match(serve, /error instanceof URIError/);
  assert.match(serve, /response\.writeHead\(400, \{ "Content-Type": "text\/plain; charset=utf-8" \}\);/);
  assert.match(serve, /response\.end\("Bad request"\);/);

  const config = await readFile("playwright.config.mjs", "utf8");
  assert.match(config, /const port = Number\(process\.env\.PORT \|\| 4173\);/);
  assert.match(config, /const baseURL = `http:\/\/127\.0\.0\.1:\$\{port\}\/mikhail-eroshkin-portfolio\/`;/);
  assert.match(config, /baseURL: baseURL,/);
  assert.match(config, /url: baseURL,/);
});
