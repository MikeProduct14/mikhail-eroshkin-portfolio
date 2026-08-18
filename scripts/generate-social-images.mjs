import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const fontRoot = resolve("site/assets/fonts");
const outputRoot = resolve("site/assets/images");

async function dataUrl(name) {
  const file = await readFile(resolve(fontRoot, name));
  return `data:font/woff2;base64:${file.toString("base64")}`;
}

const fonts = {
  unboundedCyrillic: await dataUrl("unbounded-cyrillic-wght-normal.woff2"),
  unboundedLatin: await dataUrl("unbounded-latin-wght-normal.woff2"),
  commissionerCyrillic: await dataUrl("commissioner-cyrillic-wght-normal.woff2"),
  commissionerLatin: await dataUrl("commissioner-latin-wght-normal.woff2")
};

const cards = [
  {
    lang: "ru",
    output: "social-ru.png",
    mark: "МЕ",
    name: "Михаил Ерошкин",
    role: "Руководитель проектов и поставки · Финтех",
    lineOne: "Управляю сложностью.",
    lineTwo: "Поставляю результат.",
    metrics: ["5 дней → 6 часов", "150 → 500 заявок", "+113% ARPU"]
  },
  {
    lang: "en",
    output: "social-en.png",
    mark: "ME",
    name: "Mikhail Eroshkin",
    role: "Senior Project Manager · Delivery Manager · FinTech",
    lineOne: "I manage complexity.",
    lineTwo: "I deliver outcomes.",
    metrics: ["5 days → 6 hours", "150 → 500 applications", "+113% ARPU"]
  }
];

function documentFor(card) {
  const metrics = card.metrics.map((metric, index) => `
    <div class="metric"><span>0${index + 1}</span><strong>${metric}</strong></div>
  `).join("");

  return `<!DOCTYPE html>
  <html lang="${card.lang}">
    <head>
      <meta charset="utf-8">
      <style>
        @font-face { font-family: "Unbounded"; src: url("${fonts.unboundedCyrillic}") format("woff2"); font-weight: 200 900; font-display: block; unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
        @font-face { font-family: "Unbounded"; src: url("${fonts.unboundedLatin}") format("woff2"); font-weight: 200 900; font-display: block; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD; }
        @font-face { font-family: "Commissioner"; src: url("${fonts.commissionerCyrillic}") format("woff2"); font-weight: 100 900; font-display: block; unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
        @font-face { font-family: "Commissioner"; src: url("${fonts.commissionerLatin}") format("woff2"); font-weight: 100 900; font-display: block; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD; }
        * { box-sizing: border-box; }
        html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
        body { position: relative; color: #18263F; background: #E6E2D8; font-family: "Commissioner", Arial, sans-serif; }
        body::before { content: ""; position: absolute; inset: 0; opacity: .06; background-size: 80px 80px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M0 .5H80M.5 0V80' fill='none' stroke='%239DA3AA'/%3E%3C/svg%3E"); }
        .card { position: relative; width: 100%; height: 100%; padding: 58px 66px 52px; display: grid; grid-template-columns: 1fr 354px; grid-template-rows: auto 1fr auto; gap: 30px 54px; }
        .identity { grid-column: 1; border-top: 4px solid #18263F; padding-top: 18px; }
        .name { margin: 0 0 10px; font: 650 25px/1.1 "Unbounded", Arial, sans-serif; letter-spacing: -.02em; }
        .role { margin: 0; color: #596477; font-size: 20px; font-weight: 550; }
        .mark { grid-column: 2; justify-self: end; display: grid; place-items: center; width: 92px; height: 92px; border: 3px solid #18263F; font: 700 30px/1 "Unbounded", Arial, sans-serif; }
        .headline { grid-column: 1; align-self: center; max-width: 760px; margin: 0; font: 690 58px/1.08 "Unbounded", Arial, sans-serif; letter-spacing: -.055em; }
        .headline span { color: #A04330; }
        .metrics { grid-column: 2; grid-row: 2 / 4; align-self: stretch; display: grid; grid-template-rows: repeat(3, 1fr); border: 1px solid #9DA3AA; background: #F3F0E8; }
        .metric { display: flex; flex-direction: column; justify-content: space-between; padding: 24px 26px; border-bottom: 1px solid #9DA3AA; }
        .metric:last-child { border-bottom: 0; }
        .metric span { color: #A04330; font: 600 14px/1 "Unbounded", Arial, sans-serif; }
        .metric strong { font: 650 24px/1.18 "Unbounded", Arial, sans-serif; letter-spacing: -.035em; }
        .footer { grid-column: 1; align-self: end; display: flex; align-items: center; gap: 16px; color: #596477; font-size: 17px; font-weight: 600; }
        .footer::before { content: ""; width: 54px; height: 4px; background: #A04330; }
      </style>
    </head>
    <body>
      <main class="card">
        <header class="identity"><p class="name">${card.name}</p><p class="role">${card.role}</p></header>
        <div class="mark" aria-hidden="true">${card.mark}</div>
        <h1 class="headline">${card.lineOne}<br><span>${card.lineTwo}</span></h1>
        <section class="metrics" aria-label="Impact metrics">${metrics}</section>
        <footer class="footer">mikeproduct14.github.io/mikhail-eroshkin-portfolio</footer>
      </main>
    </body>
  </html>`;
}

await mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce"
  });
  const page = await context.newPage();

  for (const card of cards) {
    await page.setContent(documentFor(card), { waitUntil: "load" });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.screenshot({
      path: resolve(outputRoot, card.output),
      type: "png",
      animations: "disabled",
      caret: "hide"
    });
  }

  await context.close();
} finally {
  await browser.close();
}

console.log("Generated social-ru.png and social-en.png at 1200×630.");
