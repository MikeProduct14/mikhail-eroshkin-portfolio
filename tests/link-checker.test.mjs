import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { collectSiteIssues } from "../scripts/check-links.mjs";

async function fixture(files) {
  const root = await mkdtemp(join(tmpdir(), "portfolio-links-"));
  for (const [name, content] of Object.entries(files)) {
    const path = join(root, name);
    await mkdir(join(path, ".."), { recursive: true });
    await writeFile(path, content, "utf8");
  }
  return root;
}

test("the checker accepts portable locale, asset, CSS, and fragment links", async (context) => {
  const root = await fixture({
    "index.html": "<main id=\"main\"><section id=\"cases\"></section><a href=\"en/#cases\">EN</a><link rel=\"stylesheet\" href=\"assets/app.css\"><script src=\"assets/app.js\"></script></main>",
    "en/index.html": "<main id=\"main\"><section id=\"cases\"></section><a href=\"../#cases\">RU</a><link rel=\"stylesheet\" href=\"../assets/app.css\"><script src=\"../assets/app.js\"></script></main>",
    "assets/app.css": "body { background-image: url(\"images/grid.svg\"); }",
    "assets/app.js": "export {};",
    "assets/images/grid.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\"/>"
  });
  context.after(() => rm(root, { recursive: true, force: true }));
  assert.deepEqual(await collectSiteIssues(root), []);
});

test("the checker reports root paths, missing files, missing fragments, and locale ID drift", async (context) => {
  const root = await fixture({
    "index.html": "<main id=\"main\"><section id=\"cases\"></section><a href=\"en/#missing\">EN</a><link rel=\"stylesheet\" href=\"/assets/app.css\"><script src=\"assets/missing.js\"></script></main>",
    "en/index.html": "<main id=\"main\"><section id=\"experience\"></section><a href=\"../#cases\">RU</a></main>"
  });
  context.after(() => rm(root, { recursive: true, force: true }));
  const issues = await collectSiteIssues(root);
  assert.ok(issues.some((issue) => issue.includes("root-relative path is forbidden")));
  assert.ok(issues.some((issue) => issue.includes("missing local target")));
  assert.ok(issues.some((issue) => issue.includes("missing fragment #missing")));
  assert.ok(issues.some((issue) => issue.includes("locale IDs differ")));
});
