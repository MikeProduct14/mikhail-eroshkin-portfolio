import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";

const approvedPalette = [
  "#18263f",
  "#596477",
  "#9da3aa",
  "#a04330",
  "#e6e2d8",
  "#f3f0e8"
].sort();

const fontFiles = [
  "commissioner-cyrillic-ext-wght-normal.woff2",
  "commissioner-cyrillic-wght-normal.woff2",
  "commissioner-latin-ext-wght-normal.woff2",
  "commissioner-latin-wght-normal.woff2",
  "unbounded-cyrillic-ext-wght-normal.woff2",
  "unbounded-cyrillic-wght-normal.woff2",
  "unbounded-latin-ext-wght-normal.woff2",
  "unbounded-latin-wght-normal.woff2"
];

const licenseFiles = [
  "commissioner-LICENSE.txt",
  "unbounded-LICENSE.txt"
];

const localePreloads = [
  {
    path: "site/index.html",
    hrefs: [
      "assets/fonts/unbounded-cyrillic-wght-normal.woff2",
      "assets/fonts/unbounded-latin-wght-normal.woff2",
      "assets/fonts/commissioner-cyrillic-wght-normal.woff2",
      "assets/fonts/commissioner-latin-wght-normal.woff2"
    ]
  },
  {
    path: "site/en/index.html",
    hrefs: [
      "../assets/fonts/unbounded-latin-wght-normal.woff2",
      "../assets/fonts/commissioner-latin-wght-normal.woff2"
    ]
  }
];

test("the stylesheet uses only the approved warm Executive Blueprint system", async () => {
  const css = await readFile("site/assets/css/styles.css", "utf8");
  const colors = [...new Set(
    [...css.matchAll(/#[0-9a-f]{6}\b/gi)].map((match) => match[0].toLowerCase())
  )].sort();

  assert.deepEqual(colors, approvedPalette, "an unapproved hexadecimal color entered the stylesheet");
  assert.match(css, /--paper:\s*#e6e2d8;/);
  assert.match(css, /--surface:\s*#f3f0e8;/);
  assert.match(css, /--ink:\s*#18263f;/);
  assert.match(css, /--muted:\s*#596477;/);
  assert.match(css, /--line:\s*#9da3aa;/);
  assert.match(css, /--accent:\s*#a04330;/);
  assert.match(css, /--font-display:\s*"Unbounded Variable",\s*sans-serif;/);
  assert.match(css, /--font-body:\s*"Commissioner Variable",\s*sans-serif;/);
  assert.doesNotMatch(css, /(?<!sans-)\bserif\b/i, "a standalone serif fallback is not approved");
  assert.doesNotMatch(css, /gradient\s*\(/i, "the blueprint must use lines rather than gradients");
  assert.doesNotMatch(css, /@import/i, "styles must not import a remote stylesheet");
  assert.doesNotMatch(css, /src:\s*url\(\s*["']?https?:/i, "fonts must not depend on a CDN");

  const faceBlocks = [...css.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
  assert.equal(faceBlocks.length, 8, "the two variable families must expose four local subsets each");
  const faceFamilies = [...new Set(faceBlocks.map((block) => {
    const family = block.match(/font-family:\s*"([^"]+)"/);
    assert.ok(family, "every font face needs an explicit family");
    return family[1];
  }))].sort();
  assert.deepEqual(faceFamilies, ["Commissioner Variable", "Unbounded Variable"]);
});

test("the build produces the exact local font and license set", async () => {
  const actualFiles = (await readdir("site/assets/fonts")).sort();
  assert.deepEqual(actualFiles, [...fontFiles, ...licenseFiles].sort());

  for (const file of fontFiles) {
    const info = await stat("site/assets/fonts/" + file);
    assert.ok(info.isFile(), file + " is not a file");
    assert.ok(info.size > 1_000, file + " is unexpectedly small");
  }

  for (const file of licenseFiles) {
    const info = await stat("site/assets/fonts/" + file);
    assert.ok(info.isFile(), file + " is not a file");
    assert.ok(info.size > 4_000, file + " is unexpectedly small");
  }
});

test("each locale preloads only its above-the-fold subsets", async () => {
  for (const locale of localePreloads) {
    const html = await readFile(locale.path, "utf8");
    const actual = [...html.matchAll(
      /<link rel="preload" href="([^"]+\.woff2)" as="font" type="font\/woff2" crossorigin>/g
    )].map((match) => match[1]);
    assert.deepEqual(actual, locale.hrefs, locale.path + " has the wrong font preload order");
  }
});
