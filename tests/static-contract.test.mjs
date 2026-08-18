import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
const pages = [
  { path: "site/index.html", lang: "ru", assetPrefix: "assets/", languageHref: "en/" },
  { path: "site/en/index.html", lang: "en", assetPrefix: "../assets/", languageHref: "../" }
];
const requiredIds = ["top", "cases", "case-prodamus-onboarding", "case-prodamus-pay", "case-obalor-mobile", "case-abslegroup-platform", "approach", "experience", "expertise", "contact"];
function idsIn(html) { return [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]); }
test("both autonomous locale pages exist with the same public anchors", async () => {
  const pageIds = [];
  for (const page of pages) {
    await access(page.path);
    const html = await readFile(page.path, "utf8");
    assert.match(html, new RegExp(`<html[^>]+lang="${page.lang}"`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /(?:href|src)="\/(?!\/)/, `${page.path} contains a root-relative URL`);
    assert.match(html, new RegExp(`href="${page.assetPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}css/styles\\.css"`));
    assert.match(html, new RegExp(`data-language-link[^>]+href="${page.languageHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"|href="${page.languageHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]+data-language-link`));
    const ids = idsIn(html);
    assert.equal(new Set(ids).size, ids.length, `${page.path} contains duplicate IDs`);
    for (const id of requiredIds) assert.ok(ids.includes(id), `${page.path} is missing #${id}`);
    pageIds.push(ids.filter((id) => requiredIds.includes(id)).sort());
  }
  assert.deepEqual(pageIds[0], pageIds[1]);
});
