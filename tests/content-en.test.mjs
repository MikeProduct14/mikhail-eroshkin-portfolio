import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredCopy = [
  "5 days → 6 hours",
  "150 → 500 applications per day",
  "+113% ARPU",
  "Merchant onboarding and activation",
  "Partner service migration",
  "Mobile product in three months",
  "B2B platform and API development",
  "Dependency map",
  "Career trajectory",
  "mike.eroshkin@yandex.ru",
  "+7 962 023-33-02"
];

const forbiddenInterfaceCopy = [
  "Кейсы", "Смотреть кейсы", "Опыт", "Экспертиза", "Контакты", "Наверх", "Переключить"
];

test("English page contains the approved evidence and no Russian copy", async () => {
  const html = await readFile("site/en/index.html", "utf8");

  for (const text of requiredCopy) assert.ok(html.includes(text), `missing EN copy: ${text}`);
  assert.match(html, /<h1>I manage <span>complexity\.<\/span> I deliver outcomes\.<\/h1>/);
  for (const text of forbiddenInterfaceCopy) assert.ok(!html.includes(text), `mixed RU interface copy: ${text}`);

  assert.doesNotMatch(html, /[\u0400-\u04FF]/, "English page contains Cyrillic text");
  assert.equal((html.match(/<details\b[^>]*data-case/g) || []).length, 4);
  assert.equal((html.match(/<details\b[^>]*open/g) || []).length, 1);
  assert.match(html, /href="mailto:mike\.eroshkin@yandex\.ru"/);
  assert.match(html, /href="tel:\+79620233302"/);
  assert.match(html, /<a class="language-switch" href="\.\.\/" data-language-link data-language-base="\.\.\/"/);
  assert.doesNotMatch(html, /\$300(?:\s|,)?000\b|\$300\s*[kK]\b/);
});
