import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const rootUrl = "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/";
const linkedIn = "https://linkedin.com/in/productmichaeleroshkin";
const portfolio = "https://productmike.ru";

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*"([^"]*)"/g)].map((match) => [match[1], decodeHtml(match[2])])
  );
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => parseAttributes(match[0]));
}

function meta(html, key, value) {
  const tag = tags(html, "meta").find((attributes) => attributes[key] === value);
  assert.ok(tag, `missing meta ${key}="${value}"`);
  return tag.content;
}

function link(html, rel, hreflang) {
  const tag = tags(html, "link").find((attributes) =>
    attributes.rel === rel && (hreflang === undefined || attributes.hreflang === hreflang)
  );
  assert.ok(tag, `missing link rel="${rel}"${hreflang ? ` hreflang="${hreflang}"` : ""}`);
  return tag.href;
}

function jsonLd(html) {
  const match = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "missing Person JSON-LD");
  return JSON.parse(match[1]);
}

async function pngSize(path) {
  const image = await readFile(path);
  assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${path} is not a PNG`);
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

const locales = [
  {
    path: "site/index.html",
    canonical: rootUrl,
    alternate: `${rootUrl}en/`,
    title: "Михаил Ерошкин — руководитель проектов и поставки в финтехе",
    description: "Управляю сложными цифровыми проектами в финтехе: миграции, кросс-функциональные команды и измеримый результат — от 5 дней до 6 часов.",
    locale: "ru_RU",
    alternateLocale: "en_US",
    image: `${rootUrl}assets/images/social-ru.png`,
    imageAlt: "Михаил Ерошкин — управляю сложностью и поставляю результат",
    personName: "Михаил Ерошкин",
    jobTitle: "Старший руководитель проектов и руководитель поставки цифровых продуктов",
    favicon: "assets/images/favicon.svg"
  },
  {
    path: "site/en/index.html",
    canonical: `${rootUrl}en/`,
    alternate: rootUrl,
    title: "Mikhail Eroshkin — Senior Project and Delivery Manager in FinTech",
    description: "Senior Project and Delivery Manager for complex FinTech products, migrations and cross-functional teams, with outcomes measured in speed, scale and revenue.",
    locale: "en_US",
    alternateLocale: "ru_RU",
    image: `${rootUrl}assets/images/social-en.png`,
    imageAlt: "Mikhail Eroshkin — I manage complexity and deliver outcomes",
    personName: "Mikhail Eroshkin",
    jobTitle: "Senior Project Manager and Delivery Manager",
    favicon: "../assets/images/favicon.svg"
  }
];

for (const locale of locales) {
  test(`${locale.path} has complete localized metadata`, async () => {
    const html = await readFile(locale.path, "utf8");
    assert.equal(decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1] || ""), locale.title);
    assert.equal(meta(html, "name", "description"), locale.description);
    assert.equal(meta(html, "name", "robots"), "index, follow, max-image-preview:large");
    assert.equal(link(html, "canonical"), locale.canonical);
    assert.equal(link(html, "alternate", "ru"), rootUrl);
    assert.equal(link(html, "alternate", "en"), `${rootUrl}en/`);
    assert.equal(link(html, "alternate", "x-default"), rootUrl);
    assert.equal(link(html, "icon"), locale.favicon);

    assert.equal(meta(html, "property", "og:type"), "profile");
    assert.equal(meta(html, "property", "og:url"), locale.canonical);
    assert.equal(meta(html, "property", "og:title"), locale.title);
    assert.equal(meta(html, "property", "og:description"), locale.description);
    assert.equal(meta(html, "property", "og:locale"), locale.locale);
    assert.equal(meta(html, "property", "og:locale:alternate"), locale.alternateLocale);
    assert.equal(meta(html, "property", "og:image"), locale.image);
    assert.equal(meta(html, "property", "og:image:type"), "image/png");
    assert.equal(meta(html, "property", "og:image:width"), "1200");
    assert.equal(meta(html, "property", "og:image:height"), "630");
    assert.equal(meta(html, "property", "og:image:alt"), locale.imageAlt);
    assert.equal(meta(html, "name", "twitter:card"), "summary_large_image");
    assert.equal(meta(html, "name", "twitter:title"), locale.title);
    assert.equal(meta(html, "name", "twitter:description"), locale.description);
    assert.equal(meta(html, "name", "twitter:image"), locale.image);
    assert.equal(meta(html, "name", "twitter:image:alt"), locale.imageAlt);

    const person = jsonLd(html);
    assert.equal(person["@context"], "https://schema.org");
    assert.equal(person["@type"], "Person");
    assert.equal(person["@id"], `${rootUrl}#person`);
    assert.equal(person.name, locale.personName);
    assert.equal(person.url, locale.canonical);
    assert.equal(person.email, "mailto:mike.eroshkin@yandex.ru");
    assert.equal(person.telephone, "+79620233302");
    assert.equal(person.jobTitle, locale.jobTitle);
    assert.equal(person.address.addressCountry, "RU");
    assert.deepEqual(person.sameAs, [linkedIn, portfolio]);
  });
}

test("social cards and favicon have the production contract", async () => {
  assert.deepEqual(await pngSize("site/assets/images/social-ru.png"), { width: 1200, height: 630 });
  assert.deepEqual(await pngSize("site/assets/images/social-en.png"), { width: 1200, height: 630 });
  const favicon = await readFile("site/assets/images/favicon.svg", "utf8");
  assert.match(favicon, /viewBox="0 0 64 64"/);
  assert.match(favicon, /#18263F/);
  assert.match(favicon, /#A04330/);
  assert.doesNotMatch(favicon, /<text\b/);
});

test("sitemap publishes both canonical URLs and their language alternates", async () => {
  const sitemap = await readFile("site/sitemap.xml", "utf8");
  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.equal((sitemap.match(/<url>/g) || []).length, 2);
  assert.equal((sitemap.match(new RegExp(`<loc>${rootUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>`, "g")) || []).length, 1);
  assert.equal((sitemap.match(new RegExp(`<loc>${`${rootUrl}en/`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>`, "g")) || []).length, 1);
  for (const language of ["ru", "en", "x-default"]) {
    assert.equal((sitemap.match(new RegExp(`hreflang="${language}"`, "g")) || []).length, 2);
  }
});
