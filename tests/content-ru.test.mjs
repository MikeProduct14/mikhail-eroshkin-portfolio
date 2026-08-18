import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredCopy = [
  "5 дней → 6 часов",
  "150 → 500 заявок в день",
  "+113% ARPU",
  "Онбординг и активация мерчантов",
  "Миграция партнёрского сервиса",
  "Мобильный продукт за три месяца",
  "Развитие B2B-платформы и API",
  "Карта зависимостей",
  "Карьерная траектория",
  "mike.eroshkin@yandex.ru",
  "+7 962 023-33-02"
];
const forbiddenInterfaceCopy = [
  "Case studies", "View cases", "Experience", "Open to opportunities",
  "Contact me", "Back to top", "Switch to Russian"
];

test("Russian page contains the approved evidence and no English interface copy", async () => {
  const html = await readFile("site/index.html", "utf8");
  for (const text of requiredCopy) assert.ok(html.includes(text), `missing RU copy: ${text}`);
  assert.match(html, /<h1>Управляю <span>сложностью\.<\/span> Поставляю результат\.<\/h1>/);
  for (const text of forbiddenInterfaceCopy) assert.ok(!html.includes(text), `mixed EN interface copy: ${text}`);
  assert.equal((html.match(/<details\b[^>]*data-case/g) || []).length, 4);
  assert.equal((html.match(/<details\b[^>]*open/g) || []).length, 1);
  assert.match(html, /href="mailto:mike\.eroshkin@yandex\.ru"/);
  assert.match(html, /href="tel:\+79620233302"/);
  assert.doesNotMatch(html, /\$300(?:\s|,)?000\b|\$300\s*[kK]\b/);
});
