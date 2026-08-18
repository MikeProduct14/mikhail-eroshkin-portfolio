import { existsSync, statSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const externalScheme = /^(?:https?:|mailto:|tel:|data:|blob:)/i;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return nested.flat().sort();
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/g)].map((match) => [match[1].toLowerCase(), match[3]])
  );
}

function htmlReferences(html) {
  const references = [];
  for (const match of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    for (const name of ["href", "src"]) {
      if (attrs[name] !== undefined) references.push(attrs[name]);
    }
    if (attrs.srcset) {
      for (const candidate of attrs.srcset.split(",")) references.push(candidate.trim().split(/\s+/)[0]);
    }
  }
  return references;
}

function cssReferences(css) {
  return [...css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)].map((match) => match[2]);
}

function idValues(html) {
  return [...html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2]);
}

function ids(html) {
  return new Set(idValues(html));
}

function isInside(root, target) {
  const path = relative(root, target);
  return path === "" || (!path.startsWith(`..${sep}`) && path !== "..");
}

function resolvedTarget(root, source, reference) {
  const sourceRelative = relative(root, source).split(sep).join("/");
  const base = new URL(sourceRelative, "https://portfolio.invalid/");
  const url = new URL(reference, base);
  const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  let target = resolve(root, pathname);
  if (url.pathname.endsWith("/") || (existsSync(target) && statSync(target).isDirectory())) {
    target = resolve(target, "index.html");
  }
  return { target, fragment: decodeURIComponent(url.hash.slice(1)) };
}

export async function collectSiteIssues(siteRoot = resolve("site")) {
  const root = resolve(siteRoot);
  const files = await walk(root);
  const htmlFiles = files.filter((path) => extname(path).toLowerCase() === ".html");
  const cssFiles = files.filter((path) => extname(path).toLowerCase() === ".css");
  const idCache = new Map();
  const issues = [];

  async function targetIds(path) {
    if (!idCache.has(path)) idCache.set(path, ids(await readFile(path, "utf8")));
    return idCache.get(path);
  }

  async function check(source, reference) {
    const display = relative(root, source).split(sep).join("/");
    if (!reference) {
      issues.push(`${display}: empty local reference`);
      return;
    }
    if (reference.startsWith("/")) {
      issues.push(`${display}: root-relative path is forbidden: ${reference}`);
      return;
    }
    if (externalScheme.test(reference)) return;
    if (/^[a-z][a-z0-9+.-]*:/i.test(reference)) {
      issues.push(`${display}: unsupported URL scheme: ${reference}`);
      return;
    }

    let resolved;
    try {
      resolved = resolvedTarget(root, source, reference);
    } catch {
      issues.push(`${display}: invalid local URL: ${reference}`);
      return;
    }

    if (!isInside(root, resolved.target)) {
      issues.push(`${display}: local reference escapes site/: ${reference}`);
      return;
    }
    if (!existsSync(resolved.target) || !statSync(resolved.target).isFile()) {
      issues.push(`${display}: missing local target: ${reference}`);
      return;
    }
    if (resolved.fragment && extname(resolved.target).toLowerCase() === ".html") {
      const targetSet = await targetIds(resolved.target);
      if (!targetSet.has(resolved.fragment)) {
        issues.push(`${display}: missing fragment #${resolved.fragment} in ${relative(root, resolved.target).split(sep).join("/")}`);
      }
    }
  }

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const values = idValues(html);
    const duplicates = values.filter((id, index) => values.indexOf(id) !== index);
    for (const duplicate of duplicates) issues.push(`${relative(root, file)}: duplicate id ${duplicate}`);
    for (const reference of htmlReferences(html)) await check(file, reference);
  }

  for (const file of cssFiles) {
    const css = await readFile(file, "utf8");
    for (const reference of cssReferences(css)) await check(file, reference);
  }

  const ru = resolve(root, "index.html");
  const en = resolve(root, "en/index.html");
  if (existsSync(ru) && existsSync(en)) {
    const ruIds = [...await targetIds(ru)].sort();
    const enIds = [...await targetIds(en)].sort();
    if (JSON.stringify(ruIds) !== JSON.stringify(enIds)) {
      issues.push(`locale IDs differ: RU=${ruIds.join(",")} EN=${enIds.join(",")}`);
    }
  }

  return [...new Set(issues)].sort();
}

const invokedDirectly = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedDirectly) {
  const issues = await collectSiteIssues();
  if (issues.length) {
    console.error(issues.map((issue) => `- ${issue}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("All local links, resources, fragments, and locale IDs are valid.");
  }
}
