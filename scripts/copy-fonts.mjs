import { copyFile, mkdir, rm } from "node:fs/promises";
import { basename, resolve } from "node:path";

const outputDirectory = resolve("site/assets/fonts");
const assets = [
  {
    source: "node_modules/@fontsource-variable/unbounded/files/unbounded-cyrillic-ext-wght-normal.woff2",
    target: "unbounded-cyrillic-ext-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/unbounded/files/unbounded-cyrillic-wght-normal.woff2",
    target: "unbounded-cyrillic-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/unbounded/files/unbounded-latin-ext-wght-normal.woff2",
    target: "unbounded-latin-ext-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2",
    target: "unbounded-latin-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/unbounded/LICENSE",
    target: "unbounded-LICENSE.txt"
  },
  {
    source: "node_modules/@fontsource-variable/commissioner/files/commissioner-cyrillic-ext-wght-normal.woff2",
    target: "commissioner-cyrillic-ext-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/commissioner/files/commissioner-cyrillic-wght-normal.woff2",
    target: "commissioner-cyrillic-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/commissioner/files/commissioner-latin-ext-wght-normal.woff2",
    target: "commissioner-latin-ext-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/commissioner/files/commissioner-latin-wght-normal.woff2",
    target: "commissioner-latin-wght-normal.woff2"
  },
  {
    source: "node_modules/@fontsource-variable/commissioner/LICENSE",
    target: "commissioner-LICENSE.txt"
  }
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const asset of assets) {
  const sourcePath = resolve(asset.source);
  const targetPath = resolve(outputDirectory, asset.target);
  await copyFile(sourcePath, targetPath);
  console.log("Copied " + basename(sourcePath) + " -> " + asset.target);
}

console.log("Prepared " + assets.length + " local font assets.");
