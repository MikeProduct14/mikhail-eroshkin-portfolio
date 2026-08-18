# Mikhail Eroshkin Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a production-grade, bilingual Executive Blueprint portfolio site for Mikhail Eroshkin on GitHub Pages.

**Architecture:** Two autonomous semantic HTML documents (`site/index.html` and `site/en/index.html`) share one CSS file and one progressive-enhancement JavaScript file. Runtime content is fully static and works without JavaScript; Node.js tooling exists only for asset preparation, validation, Playwright tests, Lighthouse, and Pages CI.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js 22+ locally / Node.js 24 in CI, Node test runner, Playwright, Axe, html-validate, Lighthouse CI, GitHub Actions, GitHub Pages.

**Execution order:** Follow the numbered tasks in order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11. The full Task 3 payload appears before the file map so its long approved copy remains isolated; do not execute it until Tasks 1 and 2 are green.

---

### Task 3: Populate the complete Russian page

**Files:**
- Create: `tests/content-ru.test.mjs`
- Modify: `site/index.html`

- [ ] **Step 1: Write the failing Russian content contract**

Create `tests/content-ru.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredCopy = [
  "Управляю сложностью. Поставляю результат.",
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
  for (const text of forbiddenInterfaceCopy) assert.ok(!html.includes(text), `mixed EN interface copy: ${text}`);
  assert.equal((html.match(/<details\b[^>]*data-case/g) || []).length, 4);
  assert.equal((html.match(/<details\b[^>]*open/g) || []).length, 1);
  assert.match(html, /href="mailto:mike\.eroshkin@yandex\.ru"/);
  assert.match(html, /href="tel:\+79620233302"/);
  assert.doesNotMatch(html, /\$300(?:\s|,)?000\b|\$300\s*[kK]\b/);
});
```

- [ ] **Step 2: Run the content contract and confirm RED**

Run:

```powershell
node --test tests/content-ru.test.mjs
```

Expected: FAIL with `missing RU copy: 5 дней → 6 часов`.

- [ ] **Step 3: Replace the Russian `<body>` with the approved content**

Keep the existing `<head>` and replace the entire `<body>` in `site/index.html` with:

```html
<body>
  <a class="skip-link" href="#main">Перейти к содержанию</a>
  <header class="site-header" data-site-header>
    <a class="brand" href="#top" aria-label="На первый экран"><span class="brand-mark">МЕ</span><span class="brand-name">Михаил Ерошкин</span></a>
    <nav class="site-nav" aria-label="Основная навигация">
      <a href="#cases" data-nav-link>Кейсы</a>
      <a href="#experience" data-nav-link>Опыт</a>
      <a href="#expertise" data-nav-link>Экспертиза</a>
      <a href="#contact" data-nav-link>Контакты</a>
    </nav>
    <div class="header-actions">
      <span class="availability">Удалённо · Готов к релокации</span>
      <a class="language-switch" href="en/" data-language-link data-language-base="en/" aria-label="Переключить на английский">EN</a>
    </div>
  </header>

  <main id="main">
    <section class="hero blueprint-grid" id="top" data-nav-section data-reveal>
      <div class="hero-copy">
        <p class="hero-name">Михаил Ерошкин</p>
        <p class="eyebrow">Старший руководитель проектов · Руководитель поставки цифровых продуктов — финтех</p>
        <h1>Управляю <span>сложностью.</span> Поставляю результат.</h1>
        <p class="hero-summary">Соединяю бизнес, технологии и команды — от декомпозиции целей и дорожной карты до запуска и пострелизной стабилизации.</p>
        <p class="hero-location">Ставрополь · Удалённая работа · Готов к релокации</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#cases">Смотреть кейсы <span aria-hidden="true">↓</span></a>
          <a class="text-link" href="mailto:mike.eroshkin@yandex.ru">Обсудить задачу <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <aside class="impact-panel" aria-label="Ключевые результаты">
        <p class="panel-label">Измеримый эффект · 2020—2026</p>
        <dl class="impact-list">
          <div><dt>Онбординг мерчантов</dt><dd>5 дней → 6 часов</dd></div>
          <div><dt>Пропускная способность</dt><dd>150 → 500 заявок в день</dd></div>
          <div><dt>ARPU B2B-платформы</dt><dd>+113% ARPU</dd></div>
        </dl>
      </aside>
    </section>

    <section class="section cases" id="cases" data-nav-section data-reveal aria-labelledby="cases-title">
      <div class="section-heading">
        <p class="section-index">02 / Избранные проекты</p>
        <h2 id="cases-title">Кейсы поставки</h2>
        <p>Четыре проекта: контекст, ограничение, моя зона ответственности, решения и измеримый эффект.</p>
      </div>

      <details class="case-card case-featured" id="case-prodamus-onboarding" data-case open>
        <summary>
          <span class="case-number">01</span><span class="case-company">PRODAMUS · Финтех</span>
          <span class="case-title">Онбординг и активация мерчантов</span><span class="case-signal">5 дней → 6 часов</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Контекст и масштаб</h3><p>Финтех-платформа с ARR около 3 млрд рублей и более чем 100 000 мерчантов.</p></div>
          <div class="case-fact"><h3>Задача и ограничение</h3><p>Ускорить проверку новых мерчантов, повысить пропускную способность и одновременно снизить риск мошенничества.</p></div>
          <div class="case-fact"><h3>Роль и ответственность</h3><p>Руководство поставкой: планирование, декомпозиция, приоритизация, управление зависимостями, блокерами и отчётностью для CEO и CPO.</p></div>
          <div class="case-fact"><h3>Команда</h3><p>8 специалистов: разработка, аналитика, дизайн и смежные бизнес-функции; отдельная синхронизация с риск-функцией и поддержкой.</p></div>
          <div class="case-decisions"><h3>Ключевые решения</h3><ul><li>Встроил новую скоринговую модель в продуктовый и технический контур.</li><li>Организовал единый процесс поставки и контроль кросс-командных зависимостей в Jira.</li><li>Ввёл регулярные статусы, риски и план корректирующих действий для руководства.</li></ul></div>
          <dl class="case-results"><div><dt>Скорость онбординга</dt><dd>20× быстрее</dd></div><div><dt>Заявки в день</dt><dd>150 → 500</dd></div><div><dt>Уровень фрода</dt><dd>−20%</dd></div></dl>
        </div>
      </details>

      <details class="case-card" id="case-prodamus-pay" data-case>
        <summary>
          <span class="case-number">02</span><span class="case-company">PRODAMUS PAY · Финтех</span>
          <span class="case-title">Миграция партнёрского сервиса</span><span class="case-signal">0 потерь данных</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Контекст и масштаб</h3><p>Перенос партнёрской программы на новую платёжную платформу с действующими данными, выплатами и критичными процессами.</p></div>
          <div class="case-fact"><h3>Задача и ограничение</h3><p>Мигрировать данные и расчёты без потери информации, нарушения выплат и критичного простоя.</p></div>
          <div class="case-fact"><h3>Роль и ответственность</h3><p>Руководство проектом миграции, проработка целевого процесса, интеграций, требований к данным и плана переключения.</p></div>
          <div class="case-fact"><h3>Команда</h3><p>Техническая, финансовая и юридическая команды, владельцы партнёрского продукта и платёжного контура.</p></div>
          <div class="case-decisions"><h3>Ключевые решения</h3><ul><li>Разделил миграцию на проверяемые этапы с критериями приёмки.</li><li>Согласовал форматы данных, финансовые правила и юридические ограничения до переключения.</li><li>Автоматизировал расчёт партнёрских выплат и снял ручную нагрузку с финансовой команды.</li></ul></div>
          <dl class="case-results"><div><dt>Данные</dt><dd>0 потерь</dd></div><div><dt>Критичный простой</dt><dd>0 остановок</dd></div><div><dt>Активация партнёров</dt><dd>+40%</dd></div></dl>
        </div>
      </details>

      <details class="case-card" id="case-obalor-mobile" data-case>
        <summary>
          <span class="case-number">03</span><span class="case-company">OBALOR · EdTech / MedTech</span>
          <span class="case-title">Мобильный продукт за три месяца</span><span class="case-signal">+300% выручки канала</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Контекст и масштаб</h3><p>Одновременная работа с международным MVP, федеральным B2C-продуктом и пилотным медицинским проектом.</p></div>
          <div class="case-fact"><h3>Задача и ограничение</h3><p>Запустить новый мобильный канал в сжатый срок при распределённой разработке и зависимости мобильного приложения от серверной части.</p></div>
          <div class="case-fact"><h3>Роль и ответственность</h3><p>Полный цикл мобильной поставки: требования, дорожная карта, декомпозиция, разработка, тестирование, релиз и стабилизация.</p></div>
          <div class="case-fact"><h3>Команда</h3><p>Распределённые участники в России, Европе и США: React Native, серверная разработка, тестирование, дизайн и маркетинг.</p></div>
          <div class="case-decisions"><h3>Ключевые решения</h3><ul><li>Синхронизировал мобильный и серверный контуры по критичным зависимостям.</li><li>Зафиксировал критерии готовности к публикации и единый релизный план.</li><li>Организовал пострелизную поддержку и быструю стабилизацию нового канала.</li></ul></div>
          <dl class="case-results"><div><dt>Срок запуска</dt><dd>3 месяца</dd></div><div><dt>Площадки</dt><dd>App Store и Google Play</dd></div><div><dt>Выручка канала</dt><dd>+300%</dd></div></dl>
        </div>
      </details>

      <details class="case-card" id="case-abslegroup-platform" data-case>
        <summary>
          <span class="case-number">04</span><span class="case-company">ABSELGROUP · B2B</span>
          <span class="case-title">Развитие B2B-платформы и API</span><span class="case-signal">220 000 → 470 000 ₽ ARPU</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Контекст и масштаб</h3><p>B2B-платформа с оборотом около 1 млрд рублей в месяц и программой функционального редизайна.</p></div>
          <div class="case-fact"><h3>Задача и ограничение</h3><p>Скоординировать более пяти направлений, обновить продукт и обеспечить стабильные интеграции внешних каталогов.</p></div>
          <div class="case-fact"><h3>Роль и ответственность</h3><p>Управление дорожной картой, приоритетами, требованиями, сроками, зависимостями и внешними поставщиками.</p></div>
          <div class="case-fact"><h3>Команда</h3><p>Продукт, разработка, аналитика, дизайн, контент и внешние интеграторы TECDOC и Laximo.</p></div>
          <div class="case-decisions"><h3>Ключевые решения</h3><ul><li>Согласовал технические спецификации, форматы API и SLA с поставщиками данных.</li><li>Выстроил прозрачную коммуникацию между внутренними командами и интеграторами.</li><li>Запустил внутренний SaaS-продукт и связал изменения с коммерческими метриками.</li></ul></div>
          <dl class="case-results"><div><dt>ARPU</dt><dd>+113%</dd></div><div><dt>Частота покупок</dt><dd>+160%</dd></div><div><dt>Оборот платформы</dt><dd>≈ 1 млрд ₽ / месяц</dd></div></dl>
        </div>
      </details>
    </section>

    <section class="section approach blueprint-grid" id="approach" data-nav-section data-reveal aria-labelledby="approach-title">
      <div class="section-heading"><p class="section-index">03 / Система работы</p><h2 id="approach-title">Как я веду поставку</h2><p>Пять этапов от бизнес-цели до измеримого эффекта.</p></div>
      <ol class="approach-steps"><li><b>Согласовать цель</b><span>Критерии результата и границы проекта.</span></li><li><b>Собрать контур</b><span>Команды, системы и зоны ответственности.</span></li><li><b>Снять зависимости</b><span>Риски, блокеры и порядок решений.</span></li><li><b>Запустить</b><span>План релиза и прозрачный статус руководству.</span></li><li><b>Стабилизировать</b><span>Метрики качества и бизнес-эффекта.</span></li></ol>
      <ul class="artifact-list" aria-label="Рабочие артефакты"><li>Карта зависимостей</li><li>Реестр рисков</li><li>План запуска</li><li>Статус руководству</li><li>Метрики стабилизации</li></ul>
    </section>

    <section class="section experience" id="experience" data-nav-section data-reveal aria-labelledby="experience-title">
      <div class="section-heading"><p class="section-index">04 / 2014—2026</p><h2 id="experience-title">Карьерная траектория</h2></div>
      <ol class="timeline">
        <li><time>Май 2024 — март 2026</time><h3>PRODAMUS</h3><p>Старший руководитель проектов / Владелец продукта · Финтех</p><span class="timeline-scale">ARR ≈ 3 млрд ₽ · 100 000+ мерчантов</span><strong>Онбординг 5 дней → 6 часов</strong></li>
        <li><time>Май 2022 — апрель 2024</time><h3>OBALOR</h3><p>Руководитель проектов / Владелец продукта · Образовательные и медицинские технологии</p><span class="timeline-scale">3 цифровых продукта · Россия, Европа и США</span><strong>Мобильный продукт за 3 месяца</strong></li>
        <li><time>Март 2020 — май 2022</time><h3>ABSELGROUP</h3><p>Руководитель проектов / Руководитель продукта · B2B-платформа</p><span class="timeline-scale">Оборот ≈ 1 млрд ₽ в месяц · 5+ направлений</span><strong>ARPU +113%</strong></li>
        <li><time>Март 2019 — март 2020</time><h3>НПО «Альпика»</h3><p>Руководитель проектов · Электронная коммерция</p><span class="timeline-scale">Продуктовая, аналитическая и техническая команды</span><strong>Повторные покупки +25%</strong></li>
        <li><time>Март 2014 — сентябрь 2017</time><h3>Концерн «Энергомера»</h3><p>Старший менеджер проектов · B2B / B2G</p><span class="timeline-scale">Корпоративные и государственные заказчики</span><strong>Инженерные проекты для крупных заказчиков</strong></li>
      </ol>
    </section>

    <section class="section expertise" id="expertise" data-nav-section data-reveal aria-labelledby="expertise-title">
      <div class="section-heading"><p class="section-index">05 / Экспертиза</p><h2 id="expertise-title">Что входит в мой контур</h2></div>
      <div class="capability-grid">
        <article><h3>Управляемая поставка</h3><ul><li>Дорожная карта и приоритеты</li><li>Риски и зависимости</li><li>Релизы и стабилизация</li><li>Несколько продуктовых потоков</li></ul></article>
        <article><h3>Технический контур</h3><ul><li>API и внешние интеграции</li><li>Серверная и мобильная разработка</li><li>Миграции систем и данных</li><li>SQL и продуктовая аналитика</li></ul></article>
        <article><h3>Лидерство</h3><ul><li>Кросс-функциональные команды</li><li>Руководители высшего уровня</li><li>Внешние поставщики</li><li>Международные стейкхолдеры</li></ul></article>
      </div>
      <div class="tools-grid">
        <div><h3>Управление</h3><p>Jira · Confluence · Notion · Miro · SDLC</p></div><div><h3>Аналитика</h3><p>SQL · Amplitude · Google Analytics · DataLens · Roistat</p></div><div><h3>Продукт</h3><p>Figma · JTBD · Unit-экономика · A/B-тестирование</p></div><div><h3>Автоматизация</h3><p>Claude · n8n · Make · Vercel · v0</p></div>
      </div>
      <div class="credentials"><div><h3>Образование</h3><p>Skillsetter — Product Management, 2022—2023</p><p>НИУ ВШЭ — бизнес и менеджмент, 2017—2018</p><p>СКФУ — электроснабжение, инженер, 2010</p></div><div><h3>Языки</h3><p>Русский — родной</p><p>Английский — B2, рабочая коммуникация</p></div></div>
    </section>

    <section class="section contact" id="contact" data-nav-section data-reveal aria-labelledby="contact-title">
      <p class="section-index">06 / Контакты</p><h2 id="contact-title">Есть сложный продуктовый контур, миграция или проблема с поставкой? Давайте обсудим.</h2>
      <div class="contact-actions"><a class="button button-primary" href="mailto:mike.eroshkin@yandex.ru">mike.eroshkin@yandex.ru</a><a href="tel:+79620233302">+7 962 023-33-02</a><a href="https://linkedin.com/in/productmichaeleroshkin" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://productmike.ru" target="_blank" rel="noopener noreferrer">productmike.ru <span aria-hidden="true">↗</span></a></div>
    </section>
  </main>

  <footer class="site-footer"><span>© 2026 Михаил Ерошкин</span><a href="#top">Наверх <span aria-hidden="true">↑</span></a></footer>
</body>
```

- [ ] **Step 4: Run the Russian contract and HTML validation**

Run:

```powershell
node --test tests/content-ru.test.mjs
npm run check:html
```

Expected: the Russian content test passes; html-validate reports 0 errors.

- [ ] **Step 5: Commit the Russian content**

```powershell
git add site/index.html tests/content-ru.test.mjs
git commit -m "feat: add Russian portfolio content"
```

---

## Approved source and working location

- Design specification: `docs/superpowers/specs/2026-08-17-mikhail-eroshkin-portfolio-design.md`
- Worktree: `C:\Users\Mike\Documents\Поиск работы\mikhail-eroshkin-portfolio\.worktrees\portfolio-site`
- Branch: `feature/portfolio-site`
- Expected repository: `MikeProduct14/mikhail-eroshkin-portfolio`
- Expected Pages URL: `https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/`

## File map

| File | Single responsibility |
|---|---|
| `site/index.html` | Complete Russian page, RU metadata, RU JSON-LD, relative RU paths |
| `site/en/index.html` | Complete English page, EN metadata, EN JSON-LD, relative EN paths |
| `site/assets/css/styles.css` | Two-font Executive Blueprint system, components, responsive rules, motion fallbacks |
| `site/assets/js/main.js` | Compact header, active navigation, reveal enhancement, language hash transfer |
| `site/assets/fonts/*` | Local variable WOFF2 subsets and OFL licenses for Unbounded and Commissioner |
| `site/assets/images/favicon.svg` | Blueprint monogram favicon |
| `site/assets/images/social-ru.png` | 1200×630 Russian Open Graph image |
| `site/assets/images/social-en.png` | 1200×630 English Open Graph image |
| `site/.nojekyll` | Preserve static files exactly in the Pages artifact |
| `site/sitemap.xml` | Absolute RU/EN URLs and hreflang alternates |
| `scripts/serve.mjs` | Local server that emulates the `/mikhail-eroshkin-portfolio/` Pages prefix |
| `scripts/copy-fonts.mjs` | Copy pinned Fontsource assets into `site/assets/fonts/` |
| `scripts/check-links.mjs` | Validate local resources, relative paths, and fragment targets |
| `scripts/generate-social-images.mjs` | Deterministically render both PNG social cards with Playwright |
| `scripts/run-lighthouse.mjs` | Invoke Lighthouse with the exact Chromium binary installed by Playwright |
| `tests/static-contract.test.mjs` | Locale parity, IDs, paths, fonts, and generated-file contracts |
| `tests/content-ru.test.mjs` | Required RU facts and forbidden EN interface copy |
| `tests/content-en.test.mjs` | Required EN facts and forbidden RU interface copy |
| `tests/seo.test.mjs` | Canonical, hreflang, JSON-LD, sitemap, and image contracts |
| `tests/site.spec.mjs` | Browser behavior, keyboard, no-JS, responsive, reduced-motion, Axe |
| `playwright.config.mjs` | Chromium projects and project-prefix web server |
| `.htmlvalidate.json` | HTML validation policy |
| `.lighthouserc.json` | Lighthouse 90+ thresholds for both locales |
| `.github/workflows/pages.yml` | Verify, package only `site/`, and deploy Pages |
| `.gitignore` | Keep worktrees, dependencies, browser output, and audit reports out of git |
| `README.md` | Local development, validation, deployment, and privacy boundaries |

## Shared section IDs

Both locale pages must contain exactly these public anchors:

```text
top
cases
case-prodamus-onboarding
case-prodamus-pay
case-obalor-mobile
case-abslegroup-platform
approach
experience
expertise
contact
```

---

### Task 1: Bootstrap deterministic development tooling

**Files:**
- Modify: `.gitignore`
- Create: `package.json`
- Create: `package-lock.json` via npm
- Create: `.htmlvalidate.json`
- Create: `playwright.config.mjs`
- Create: `scripts/serve.mjs`
- Create: `tests/tooling.test.mjs`

- [ ] **Step 1: Define ignored development artifacts**

Replace `.gitignore` with:

```gitignore
.DS_Store
Thumbs.db
.superpowers/
.worktrees/
node_modules/
dist/
playwright-report/
test-results/
lighthouse-report/
.lighthouseci/
```

- [ ] **Step 2: Create the package scripts**

Create `package.json`:

```json
{
  "name": "mikhail-eroshkin-portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/copy-fonts.mjs",
    "serve": "node scripts/serve.mjs",
    "check:static": "node --test",
    "check:html": "html-validate \"site/**/*.html\"",
    "check:links": "node scripts/check-links.mjs",
    "test:e2e": "playwright test",
    "test": "npm run check:static && npm run check:html && npm run check:links && npm run test:e2e",
    "audit": "node scripts/run-lighthouse.mjs",
    "verify": "npm run build && npm test"
  },
  "engines": {
    "node": ">=22"
  }
}
```

- [ ] **Step 3: Install development-only dependencies and lock them**

Run:

```powershell
npm install --save-dev @axe-core/playwright @fontsource-variable/commissioner @fontsource-variable/unbounded @lhci/cli @playwright/test html-validate
npx playwright install chromium
```

Expected: `package-lock.json` is created, six development packages and their transitive dependencies are installed, and Chromium installation exits with code 0.

- [ ] **Step 4: Add the HTML validation policy**

Create `.htmlvalidate.json`:

```json
{
  "extends": ["html-validate:recommended"]
}
```

- [ ] **Step 5: Add a Pages-prefix-aware local server**

Create `scripts/serve.mjs`:

```js
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const port = Number(process.env.PORT || 4173);
const host = "127.0.0.1";
const base = "/mikhail-eroshkin-portfolio";
const siteRoot = resolve("site");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (error) {
    if (error instanceof URIError) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }
    throw error;
  }

  if (pathname === base) {
    response.writeHead(308, { Location: `${base}/${url.search}${url.hash}` });
    response.end();
    return;
  }

  if (!pathname.startsWith(`${base}/`)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  let relativePath = pathname.slice(base.length + 1);
  if (!relativePath || relativePath.endsWith("/")) relativePath += "index.html";
  const filePath = resolve(siteRoot, relativePath);

  if (!filePath.startsWith(`${siteRoot}${sep}`) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mime[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Portfolio server ready at http://${host}:${port}${base}/`);
});
```

- [ ] **Step 6: Add Playwright configuration**

Create `playwright.config.mjs`:

```js
import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT || 4173);
const baseURL = `http://127.0.0.1:${port}/mikhail-eroshkin-portfolio/`;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  use: {
    baseURL: baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } }
  ],
  webServer: {
    command: "npm run serve",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
```

- [ ] **Step 7: Write and run a tooling smoke test**

Create `tests/tooling.test.mjs`:

```js
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
  for (const dependency of [
    "@axe-core/playwright",
    "@fontsource-variable/commissioner",
    "@fontsource-variable/unbounded",
    "@lhci/cli",
    "@playwright/test",
    "html-validate"
  ]) {
    assert.equal(typeof pkg.devDependencies?.[dependency], "string", `missing dev dependency ${dependency}`);
  }
});

test("tooling source files include the hardening changes", async () => {
  const ignore = await readFile(".gitignore", "utf8");
  for (const entry of [".DS_Store", "Thumbs.db", ".superpowers/", "dist/", ".worktrees/", "node_modules/", "playwright-report/", "test-results/", "lighthouse-report/", ".lighthouseci/"]) {
    assert.match(ignore, new RegExp(`^${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
  }

  const serve = await readFile("scripts/serve.mjs", "utf8");
  assert.match(serve, /try\s*\{\s*pathname = decodeURIComponent\(url\.pathname\);/);
  assert.match(serve, /error instanceof URIError/);
  assert.match(serve, /response\.writeHead\(400, \{ "Content-Type": "text\/plain; charset=utf-8" \}\);/);

  const config = await readFile("playwright.config.mjs", "utf8");
  assert.match(config, /const port = Number\(process\.env\.PORT \|\| 4173\);/);
  assert.match(config, /const baseURL = `http:\/\/127\.0\.0\.1:\$\{port\}\/mikhail-eroshkin-portfolio\/`;/);
  assert.match(config, /baseURL: baseURL,/);
  assert.match(config, /url: baseURL,/);
});
```

Run:

```powershell
node --test tests/tooling.test.mjs
node --check scripts/serve.mjs
```

Expected: 2 tests pass and both commands exit 0.

- [ ] **Step 8: Commit the toolchain**

```powershell
git add .gitignore package.json package-lock.json .htmlvalidate.json playwright.config.mjs scripts/serve.mjs tests/tooling.test.mjs
git commit -m "chore: add static site test harness"
```

---

### Task 2: Establish the bilingual semantic shell with a failing contract first

**Files:**
- Create: `tests/static-contract.test.mjs`
- Create: `site/index.html`
- Create: `site/en/index.html`
- Create: `site/.nojekyll`

- [ ] **Step 1: Write the failing static contract**

Create `tests/static-contract.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const pages = [
  { path: "site/index.html", lang: "ru", assetPrefix: "assets/", languageHref: "en/" },
  { path: "site/en/index.html", lang: "en", assetPrefix: "../assets/", languageHref: "../" }
];
const requiredIds = [
  "top", "cases", "case-prodamus-onboarding", "case-prodamus-pay",
  "case-obalor-mobile", "case-abslegroup-platform", "approach",
  "experience", "expertise", "contact"
];

function idsIn(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

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
```

- [ ] **Step 2: Run the contract and confirm the expected failure**

Run:

```powershell
node --test tests/static-contract.test.mjs
```

Expected: FAIL with `ENOENT` for `site/index.html`.

- [ ] **Step 3: Create the minimal Russian semantic shell**

Create `site/index.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Михаил Ерошкин — руководитель цифровых проектов</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <script type="module" src="assets/js/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Перейти к содержанию</a>
  <header class="site-header" data-site-header>
    <a href="#top" aria-label="На первый экран">МЕ</a>
    <nav aria-label="Основная навигация">
      <a href="#cases">Кейсы</a><a href="#experience">Опыт</a><a href="#expertise">Экспертиза</a><a href="#contact">Контакты</a>
    </nav>
    <a href="en/" data-language-link data-language-base="en/" aria-label="Переключить на английский">EN</a>
  </header>
  <main id="main">
    <section id="top"><h1>Управляю сложностью. Поставляю результат.</h1></section>
    <section id="cases" aria-labelledby="cases-title"><h2 id="cases-title">Кейсы</h2>
      <article id="case-prodamus-onboarding"></article><article id="case-prodamus-pay"></article><article id="case-obalor-mobile"></article><article id="case-abslegroup-platform"></article>
    </section>
    <section id="approach"><h2>Подход</h2></section>
    <section id="experience"><h2>Опыт</h2></section>
    <section id="expertise"><h2>Экспертиза</h2></section>
    <section id="contact"><h2>Контакты</h2></section>
  </main>
</body>
</html>
```

- [ ] **Step 4: Create the minimal English semantic shell**

Create `site/en/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mikhail Eroshkin — Senior Project Manager</title>
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script type="module" src="../assets/js/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-site-header>
    <a href="#top" aria-label="Go to the first screen">ME</a>
    <nav aria-label="Primary navigation">
      <a href="#cases">Case studies</a><a href="#experience">Experience</a><a href="#expertise">Expertise</a><a href="#contact">Contact</a>
    </nav>
    <a href="../" data-language-link data-language-base="../" aria-label="Switch to Russian">РУ</a>
  </header>
  <main id="main">
    <section id="top"><h1>I manage complexity. I deliver outcomes.</h1></section>
    <section id="cases" aria-labelledby="cases-title"><h2 id="cases-title">Case studies</h2>
      <article id="case-prodamus-onboarding"></article><article id="case-prodamus-pay"></article><article id="case-obalor-mobile"></article><article id="case-abslegroup-platform"></article>
    </section>
    <section id="approach"><h2>Delivery approach</h2></section>
    <section id="experience"><h2>Experience</h2></section>
    <section id="expertise"><h2>Expertise</h2></section>
    <section id="contact"><h2>Contact</h2></section>
  </main>
</body>
</html>
```

Create the empty file `site/.nojekyll`.

- [ ] **Step 5: Run the contract and validate the shells**

Run:

```powershell
npm run check:static
npm run check:html
```

Expected: all Node tests pass and html-validate reports no errors.

- [ ] **Step 6: Commit the autonomous locale shells**

```powershell
git add site/index.html site/en/index.html site/.nojekyll tests/static-contract.test.mjs
git commit -m "feat: add autonomous bilingual page shells"
```

---

**Execution checkpoint:** Return to the complete **Task 3** payload at the start of this document, finish and commit it, then continue with Task 4 below.

### Task 4: Populate the complete English page

**Files:**
- Create: `tests/content-en.test.mjs`
- Modify: `site/en/index.html`

- [ ] **Step 1: Write the failing English content contract**

Create `tests/content-en.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredCopy = [
  "I manage complexity. I deliver outcomes.",
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
  "Кейсы", "Смотреть кейсы", "Опыт", "Готов к релокации",
  "Обсудить задачу", "Наверх", "Переключить на английский"
];

test("English page contains the approved evidence and no Russian interface copy", async () => {
  const html = await readFile("site/en/index.html", "utf8");
  for (const text of requiredCopy) assert.ok(html.includes(text), `missing EN copy: ${text}`);
  for (const text of forbiddenInterfaceCopy) assert.ok(!html.includes(text), `mixed RU interface copy: ${text}`);
  assert.doesNotMatch(html, /[А-Яа-яЁё]/, "English page contains Cyrillic text");
  assert.equal((html.match(/<details\b[^>]*data-case/g) || []).length, 4);
  assert.equal((html.match(/<details\b[^>]*open/g) || []).length, 1);
  assert.match(html, /href="mailto:mike\.eroshkin@yandex\.ru"/);
  assert.match(html, /href="tel:\+79620233302"/);
  assert.match(html, /data-language-link[^>]+data-language-base="\.\.\/"/);
  assert.doesNotMatch(html, /\$300(?:,|\s)000/);
});
```

- [ ] **Step 2: Run the content contract and confirm RED**

Run:

```powershell
node --test tests/content-en.test.mjs
```

Expected: FAIL with `missing EN copy: 5 days → 6 hours`.

- [ ] **Step 3: Replace the English `<body>` with the approved content**

Keep the existing `<head>` and replace the entire `<body>` in `site/en/index.html` with:

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-site-header>
    <a class="brand" href="#top" aria-label="Go to the first screen"><span class="brand-mark">ME</span><span class="brand-name">Mikhail Eroshkin</span></a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="#cases" data-nav-link>Case studies</a>
      <a href="#experience" data-nav-link>Experience</a>
      <a href="#expertise" data-nav-link>Expertise</a>
      <a href="#contact" data-nav-link>Contact</a>
    </nav>
    <div class="header-actions">
      <span class="availability">Remote · Open to relocation</span>
      <a class="language-switch" href="../" data-language-link data-language-base="../" aria-label="Switch to Russian">RU</a>
    </div>
  </header>

  <main id="main">
    <section class="hero blueprint-grid" id="top" data-nav-section data-reveal>
      <div class="hero-copy">
        <p class="hero-name">Mikhail Eroshkin</p>
        <p class="eyebrow">Senior Project Manager · Delivery Manager — FinTech</p>
        <h1>I manage <span>complexity.</span> I deliver outcomes.</h1>
        <p class="hero-summary">I align business, technology, and teams—from outcome decomposition and roadmapping through launch and post-release stabilization.</p>
        <p class="hero-location">Stavropol · Remote · Open to relocation</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#cases">View case studies <span aria-hidden="true">↓</span></a>
          <a class="text-link" href="mailto:mike.eroshkin@yandex.ru">Discuss a challenge <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <aside class="impact-panel" aria-label="Key outcomes">
        <p class="panel-label">Measured impact · 2020—2026</p>
        <dl class="impact-list">
          <div><dt>Merchant onboarding</dt><dd>5 days → 6 hours</dd></div>
          <div><dt>Processing capacity</dt><dd>150 → 500 applications per day</dd></div>
          <div><dt>B2B platform ARPU</dt><dd>+113% ARPU</dd></div>
        </dl>
      </aside>
    </section>

    <section class="section cases" id="cases" data-nav-section data-reveal aria-labelledby="cases-title">
      <div class="section-heading">
        <p class="section-index">02 / Selected projects</p>
        <h2 id="cases-title">Delivery case studies</h2>
        <p>Four projects, each covering context, constraints, ownership, decisions, and measured outcomes.</p>
      </div>

      <details class="case-card case-featured" id="case-prodamus-onboarding" data-case open>
        <summary>
          <span class="case-number">01</span><span class="case-company">PRODAMUS · FinTech</span>
          <span class="case-title">Merchant onboarding and activation</span><span class="case-signal">5 days → 6 hours</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Context and scale</h3><p>A FinTech platform with approximately RUB 3 billion in annual recurring revenue and more than 100,000 merchants.</p></div>
          <div class="case-fact"><h3>Challenge and constraint</h3><p>Accelerate new-merchant verification, increase processing capacity, and reduce fraud risk at the same time.</p></div>
          <div class="case-fact"><h3>Role and ownership</h3><p>Owned delivery planning, decomposition, prioritization, dependencies, blockers, and executive reporting to the CEO and CPO.</p></div>
          <div class="case-fact"><h3>Team</h3><p>Eight specialists across engineering, analytics, design, and adjacent business functions, with dedicated coordination across risk and support.</p></div>
          <div class="case-decisions"><h3>Key decisions</h3><ul><li>Integrated a new scoring model into the product and technical landscape.</li><li>Established one delivery cadence and cross-team dependency tracking in Jira.</li><li>Introduced regular executive updates covering status, risk, and corrective action.</li></ul></div>
          <dl class="case-results"><div><dt>Onboarding speed</dt><dd>20× faster</dd></div><div><dt>Applications per day</dt><dd>150 → 500</dd></div><div><dt>Fraud rate</dt><dd>−20%</dd></div></dl>
        </div>
      </details>

      <details class="case-card" id="case-prodamus-pay" data-case>
        <summary>
          <span class="case-number">02</span><span class="case-company">PRODAMUS PAY · FinTech</span>
          <span class="case-title">Partner service migration</span><span class="case-signal">No data loss</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Context and scale</h3><p>Migration of an active partner program to a new payments platform, including live data, payouts, and business-critical processes.</p></div>
          <div class="case-fact"><h3>Challenge and constraint</h3><p>Move data and settlement processes without information loss, payout disruption, or critical downtime.</p></div>
          <div class="case-fact"><h3>Role and ownership</h3><p>Led the migration project and shaped the target process, integrations, data requirements, and cutover plan.</p></div>
          <div class="case-fact"><h3>Team</h3><p>Engineering, finance, and legal teams together with the owners of the partner product and payment platform.</p></div>
          <div class="case-decisions"><h3>Key decisions</h3><ul><li>Split the migration into verifiable stages with explicit acceptance criteria.</li><li>Aligned data formats, financial rules, and legal constraints before cutover.</li><li>Automated partner payout calculations and removed manual workload from the finance team.</li></ul></div>
          <dl class="case-results"><div><dt>Data</dt><dd>No loss</dd></div><div><dt>Critical downtime</dt><dd>None</dd></div><div><dt>Partner activation</dt><dd>+40%</dd></div></dl>
        </div>
      </details>

      <details class="case-card" id="case-obalor-mobile" data-case>
        <summary>
          <span class="case-number">03</span><span class="case-company">OBALOR · EdTech / MedTech</span>
          <span class="case-title">Mobile product in three months</span><span class="case-signal">+300% channel revenue</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Context and scale</h3><p>Concurrent delivery across an international MVP, a nationwide B2C product, and a pilot MedTech product.</p></div>
          <div class="case-fact"><h3>Challenge and constraint</h3><p>Launch a new mobile channel on a tight schedule with a distributed team and critical dependencies between mobile and backend engineering.</p></div>
          <div class="case-fact"><h3>Role and ownership</h3><p>Owned the full mobile delivery cycle: requirements, roadmap, decomposition, engineering, quality assurance, release, and stabilization.</p></div>
          <div class="case-fact"><h3>Team</h3><p>Distributed contributors in Russia, Europe, and the United States across React Native, backend engineering, quality assurance, design, and marketing.</p></div>
          <div class="case-decisions"><h3>Key decisions</h3><ul><li>Aligned mobile and backend work around critical dependencies.</li><li>Defined release-readiness criteria and one integrated launch plan.</li><li>Organized post-release support and rapid stabilization of the new channel.</li></ul></div>
          <dl class="case-results"><div><dt>Time to launch</dt><dd>3 months</dd></div><div><dt>Platforms</dt><dd>App Store and Google Play</dd></div><div><dt>Channel revenue</dt><dd>+300%</dd></div></dl>
        </div>
      </details>

      <details class="case-card" id="case-abslegroup-platform" data-case>
        <summary>
          <span class="case-number">04</span><span class="case-company">ABSELGROUP · B2B</span>
          <span class="case-title">B2B platform and API development</span><span class="case-signal">RUB 220,000 → 470,000 ARPU</span>
        </summary>
        <div class="case-body">
          <div class="case-fact"><h3>Context and scale</h3><p>A B2B platform processing approximately RUB 1 billion per month, undergoing a major functional redesign.</p></div>
          <div class="case-fact"><h3>Challenge and constraint</h3><p>Coordinate more than five workstreams, modernize the product, and maintain stable integrations with external catalog providers.</p></div>
          <div class="case-fact"><h3>Role and ownership</h3><p>Owned the roadmap, priorities, requirements, schedules, dependencies, and relationships with external vendors.</p></div>
          <div class="case-fact"><h3>Team</h3><p>Product, engineering, analytics, design, content, and external TECDOC and Laximo integration partners.</p></div>
          <div class="case-decisions"><h3>Key decisions</h3><ul><li>Aligned technical specifications, API formats, and service-level agreements with data vendors.</li><li>Established transparent communication across internal teams and integration partners.</li><li>Launched an internal SaaS product and connected platform work to commercial metrics.</li></ul></div>
          <dl class="case-results"><div><dt>ARPU</dt><dd>+113%</dd></div><div><dt>Purchase frequency</dt><dd>+160%</dd></div><div><dt>Platform volume</dt><dd>≈ RUB 1 billion / month</dd></div></dl>
        </div>
      </details>
    </section>

    <section class="section approach blueprint-grid" id="approach" data-nav-section data-reveal aria-labelledby="approach-title">
      <div class="section-heading"><p class="section-index">03 / Delivery system</p><h2 id="approach-title">How I run delivery</h2><p>Five stages from the business outcome to measurable impact.</p></div>
      <ol class="approach-steps"><li><b>Align the outcome</b><span>Success criteria and project boundaries.</span></li><li><b>Map the landscape</b><span>Teams, systems, and ownership.</span></li><li><b>Control dependencies</b><span>Risks, blockers, and decision order.</span></li><li><b>Launch</b><span>Release plan and transparent executive status.</span></li><li><b>Stabilize</b><span>Quality and business-impact metrics.</span></li></ol>
      <ul class="artifact-list" aria-label="Delivery artifacts"><li>Dependency map</li><li>Risk register</li><li>Launch plan</li><li>Executive status</li><li>Stabilization metrics</li></ul>
    </section>

    <section class="section experience" id="experience" data-nav-section data-reveal aria-labelledby="experience-title">
      <div class="section-heading"><p class="section-index">04 / 2014—2026</p><h2 id="experience-title">Career trajectory</h2></div>
      <ol class="timeline">
        <li><time>May 2024 — March 2026</time><h3>PRODAMUS</h3><p>Senior Project Manager / Product Owner · FinTech</p><span class="timeline-scale">≈ RUB 3 billion ARR · 100,000+ merchants</span><strong>Onboarding cut from 5 days to 6 hours</strong></li>
        <li><time>May 2022 — April 2024</time><h3>OBALOR</h3><p>Project Manager / Product Owner · EdTech / MedTech</p><span class="timeline-scale">3 digital products · Russia, Europe, and the United States</span><strong>Mobile product delivered in 3 months</strong></li>
        <li><time>March 2020 — May 2022</time><h3>ABSELGROUP</h3><p>Project Manager / Product Manager · B2B platform</p><span class="timeline-scale">≈ RUB 1 billion monthly volume · 5+ workstreams</span><strong>ARPU increased by 113%</strong></li>
        <li><time>March 2019 — March 2020</time><h3>NPO Alpika</h3><p>Project Manager · E-commerce</p><span class="timeline-scale">Product, analytics, and engineering teams</span><strong>Repeat purchases increased by 25%</strong></li>
        <li><time>March 2014 — September 2017</time><h3>Energomera Group</h3><p>Senior Project Manager · B2B / B2G</p><span class="timeline-scale">Enterprise and government clients</span><strong>Engineering projects for major enterprise clients</strong></li>
      </ol>
    </section>

    <section class="section expertise" id="expertise" data-nav-section data-reveal aria-labelledby="expertise-title">
      <div class="section-heading"><p class="section-index">05 / Expertise</p><h2 id="expertise-title">What I bring into the delivery landscape</h2></div>
      <div class="capability-grid">
        <article><h3>Controlled delivery</h3><ul><li>Roadmaps and priorities</li><li>Risks and dependencies</li><li>Releases and stabilization</li><li>Multiple product streams</li></ul></article>
        <article><h3>Technical landscape</h3><ul><li>APIs and external integrations</li><li>Backend and mobile engineering</li><li>System and data migrations</li><li>SQL and product analytics</li></ul></article>
        <article><h3>Leadership</h3><ul><li>Cross-functional teams</li><li>Senior executives</li><li>External vendors</li><li>International stakeholders</li></ul></article>
      </div>
      <div class="tools-grid">
        <div><h3>Delivery</h3><p>Jira · Confluence · Notion · Miro · SDLC</p></div><div><h3>Analytics</h3><p>SQL · Amplitude · Google Analytics · DataLens · Roistat</p></div><div><h3>Product practice</h3><p>Figma · JTBD · Unit economics · A/B testing</p></div><div><h3>Automation</h3><p>Claude · n8n · Make · Vercel · v0</p></div>
      </div>
      <div class="credentials"><div><h3>Education</h3><p>Skillsetter — Product Management, 2022—2023</p><p>HSE University — Business and Management, 2017—2018</p><p>North-Caucasus Federal University — Electrical Power Engineering, 2010</p></div><div><h3>Languages</h3><p>Russian — Native</p><p>English — B2, professional working communication</p></div></div>
    </section>

    <section class="section contact" id="contact" data-nav-section data-reveal aria-labelledby="contact-title">
      <p class="section-index">06 / Contact</p><h2 id="contact-title">Have a complex product landscape, migration, or delivery problem? Let's talk.</h2>
      <div class="contact-actions"><a class="button button-primary" href="mailto:mike.eroshkin@yandex.ru">mike.eroshkin@yandex.ru</a><a href="tel:+79620233302">+7 962 023-33-02</a><a href="https://linkedin.com/in/productmichaeleroshkin" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://productmike.ru" target="_blank" rel="noopener noreferrer">productmike.ru <span aria-hidden="true">↗</span></a></div>
    </section>
  </main>

  <footer class="site-footer"><span>© 2026 Mikhail Eroshkin</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
</body>
```

- [ ] **Step 4: Run the English contract, locale parity contract, and HTML validation**

Run:

```powershell
node --test tests/content-en.test.mjs tests/content-ru.test.mjs tests/static-contract.test.mjs
npm run check:html
```

Expected: all content and locale-parity tests pass; html-validate reports 0 errors.

- [ ] **Step 5: Commit the English content**

```powershell
git add site/en/index.html tests/content-en.test.mjs
git commit -m "feat: add English portfolio content"
```

---

### Task 5: Lock the approved visual contract with a failing test

**Files:**
- Create: tests/design-contract.test.mjs
- Test: site/index.html
- Test: site/en/index.html
- Test: site/assets/css/styles.css
- Test: site/assets/fonts/*

- [ ] **Step 1: Write the failing design contract**

Create tests/design-contract.test.mjs:

~~~~js
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
~~~~

- [ ] **Step 2: Run the contract and confirm RED**

Run:

~~~~powershell
node --test tests/design-contract.test.mjs
~~~~

Expected: FAIL with ENOENT for site/assets/css/styles.css. Do not weaken the assertions and do not commit the red state separately; continue directly to Task 6.

---

### Task 6: Build the local two-font Executive Blueprint design system

**Files:**
- Create: scripts/copy-fonts.mjs
- Create: site/assets/css/styles.css
- Create via build: site/assets/fonts/*
- Modify: site/index.html
- Modify: site/en/index.html
- Test: tests/design-contract.test.mjs

- [ ] **Step 1: Copy the exact Fontsource variable assets and licenses**

Create scripts/copy-fonts.mjs:

~~~~js
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
~~~~

- [ ] **Step 2: Add locale-specific font preloads**

In site/index.html, insert this exact block immediately before the existing stylesheet link:

~~~~html
  <link rel="preload" href="assets/fonts/unbounded-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/unbounded-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/commissioner-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/commissioner-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
~~~~

In site/en/index.html, insert this exact block immediately before the existing stylesheet link:

~~~~html
  <link rel="preload" href="../assets/fonts/unbounded-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="../assets/fonts/commissioner-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
~~~~

Do not preload the latin-ext or cyrillic-ext files. They remain available through unicode-range and load only if the page uses those glyphs.

- [ ] **Step 3: Create the complete warm, responsive component stylesheet**

Create site/assets/css/styles.css:

~~~~css
@font-face {
  font-family: "Unbounded Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url("../fonts/unbounded-cyrillic-ext-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

@font-face {
  font-family: "Unbounded Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url("../fonts/unbounded-cyrillic-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

@font-face {
  font-family: "Unbounded Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url("../fonts/unbounded-latin-ext-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: "Unbounded Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url("../fonts/unbounded-latin-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Commissioner Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("../fonts/commissioner-cyrillic-ext-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

@font-face {
  font-family: "Commissioner Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("../fonts/commissioner-cyrillic-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

@font-face {
  font-family: "Commissioner Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("../fonts/commissioner-latin-ext-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: "Commissioner Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("../fonts/commissioner-latin-wght-normal.woff2") format("woff2-variations");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:root {
  color-scheme: light;
  --paper: #e6e2d8;
  --surface: #f3f0e8;
  --ink: #18263f;
  --muted: #596477;
  --line: #9da3aa;
  --accent: #a04330;
  --font-display: "Unbounded Variable", sans-serif;
  --font-body: "Commissioner Variable", sans-serif;
  --content-width: 90rem;
  --page-gutter: clamp(1rem, 3vw, 3rem);
  --section-space: clamp(5rem, 10vw, 9rem);
  --header-height: 5.25rem;
  --radius: 0.375rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-width: 20rem;
  background: var(--paper);
  color: var(--ink);
  scroll-padding-top: calc(var(--header-height) + 2rem);
}

body {
  margin: 0;
  min-width: 20rem;
  overflow-x: clip;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: clamp(1rem, 0.96rem + 0.18vw, 1.125rem);
  font-weight: 430;
  line-height: 1.6;
  text-rendering: optimizeLegibility;
}

button,
input,
select,
textarea {
  font: inherit;
}

a {
  color: inherit;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.2em;
}

a:hover {
  text-decoration-color: var(--accent);
}

:focus-visible {
  outline: 0.1875rem solid var(--accent);
  outline-offset: 0.25rem;
}

::selection {
  background: var(--accent);
  color: var(--surface);
}

h1,
h2,
h3,
p,
dl,
dd,
ol,
ul {
  margin-top: 0;
}

h1,
h2,
.impact-list dd,
.case-title,
.case-results dd,
.timeline h3,
.contact h2 {
  font-family: var(--font-display);
}

h1,
h2,
h3 {
  color: var(--ink);
  text-wrap: balance;
}

h2 {
  max-width: 15ch;
  margin-bottom: 1.25rem;
  font-size: clamp(2rem, 4.3vw, 4.75rem);
  font-weight: 620;
  letter-spacing: -0.045em;
  line-height: 1.03;
}

h3 {
  margin-bottom: 0.75rem;
  font-size: clamp(1.05rem, 1rem + 0.3vw, 1.35rem);
  font-weight: 680;
  line-height: 1.25;
}

p,
li,
dd {
  max-width: 72ch;
}

.skip-link {
  position: fixed;
  z-index: 100;
  top: 0.75rem;
  left: 0.75rem;
  min-height: 2.75rem;
  padding: 0.65rem 1rem;
  transform: translateY(-180%);
  background: var(--ink);
  color: var(--surface);
  font-weight: 700;
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) auto minmax(16rem, 1fr);
  align-items: center;
  min-height: var(--header-height);
  padding: 0.75rem var(--page-gutter);
  border-bottom: 0.0625rem solid rgb(24 38 63 / 0.22);
  background: rgb(230 226 216 / 0.94);
  box-shadow: 0 0.5rem 2rem rgb(24 38 63 / 0.04);
  backdrop-filter: blur(1rem);
}

.site-header.is-compact {
  min-height: 4rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  box-shadow: 0 0.75rem 2rem rgb(24 38 63 / 0.1);
}

.brand {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  min-width: 0;
  min-height: 2.75rem;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-mark {
  display: inline-grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
  border: 0.0625rem solid var(--ink);
  background: var(--ink);
  color: var(--surface);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 650;
  letter-spacing: -0.04em;
}

.brand-name {
  overflow: hidden;
  font-weight: 720;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.3rem, 1.4vw, 1.25rem);
}

.site-nav a,
.language-switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.5rem 0.7rem;
  border-bottom: 0.125rem solid transparent;
  color: var(--muted);
  font-size: 0.875rem;
  font-weight: 680;
  text-decoration: none;
}

.site-nav a:hover,
.site-nav a[aria-current="location"] {
  border-bottom-color: var(--accent);
  color: var(--ink);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-self: end;
  min-width: 0;
  gap: 1rem;
}

.availability,
.eyebrow,
.panel-label,
.section-index,
.case-number,
.case-company,
.timeline time {
  font-size: 0.75rem;
  font-weight: 720;
  letter-spacing: 0.075em;
  line-height: 1.35;
  text-transform: uppercase;
}

.availability {
  overflow: hidden;
  color: var(--muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.language-switch {
  min-width: 3rem;
  border: 0.0625rem solid var(--line);
  color: var(--ink);
}

.language-switch:hover {
  border-color: var(--accent);
}

main {
  display: block;
}

[data-nav-section] {
  scroll-margin-top: calc(var(--header-height) + 1.5rem);
}

.hero,
.section,
.site-footer {
  width: min(100%, var(--content-width));
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.blueprint-grid {
  position: relative;
  isolation: isolate;
}

.blueprint-grid::before {
  position: absolute;
  z-index: 0;
  inset: 0 var(--page-gutter);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M0 .5H32M.5 0V32' fill='none' stroke='%2318263f' stroke-opacity='.055' stroke-width='1'/%3E%3C/svg%3E");
  background-size: 2rem 2rem;
  content: "";
  pointer-events: none;
}

.blueprint-grid > * {
  position: relative;
  z-index: 1;
}

.hero {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  min-height: calc(100svh - var(--header-height));
  gap: clamp(2rem, 4vw, 5rem);
  padding-top: clamp(4rem, 8vw, 8rem);
  padding-bottom: clamp(4rem, 8vw, 8rem);
  border-bottom: 0.0625rem solid var(--line);
}

.hero-copy {
  grid-column: 1 / span 8;
  min-width: 0;
}

.hero-name {
  margin-bottom: 0.65rem;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 1rem + 0.6vw, 1.55rem);
  font-weight: 620;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.eyebrow {
  max-width: 66ch;
  margin-bottom: clamp(1.5rem, 3vw, 3rem);
  color: var(--muted);
}

.hero h1 {
  max-width: 12ch;
  margin-bottom: clamp(1.75rem, 3.5vw, 3.5rem);
  font-size: clamp(2.4rem, 5.7vw, 5.8rem);
  font-weight: 650;
  letter-spacing: -0.06em;
  line-height: 0.99;
  overflow-wrap: anywhere;
}

.hero h1 span {
  color: var(--accent);
}

.hero-summary {
  margin-bottom: 1rem;
  color: var(--ink);
  font-size: clamp(1.125rem, 1rem + 0.55vw, 1.55rem);
  line-height: 1.5;
}

.hero-location {
  margin-bottom: 2rem;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 620;
}

.hero-actions,
.contact-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
}

.button,
.text-link,
.contact-actions > a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
}

.button {
  gap: 0.65rem;
  padding: 0.8rem 1.1rem;
  border: 0.0625rem solid var(--ink);
  font-weight: 720;
  text-decoration: none;
}

.button-primary {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--surface);
}

.button-primary:hover {
  border-color: var(--ink);
  background: var(--ink);
  text-decoration: none;
}

.text-link {
  padding-inline: 0.25rem;
  font-weight: 720;
}

.impact-panel {
  grid-column: 9 / -1;
  align-self: end;
  min-width: 0;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  border: 0.0625rem solid var(--ink);
  border-top: 0.35rem solid var(--accent);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 1.25rem 3rem rgb(24 38 63 / 0.08);
}

.panel-label {
  margin-bottom: 1.5rem;
  color: var(--muted);
}

.impact-list {
  margin-bottom: 0;
}

.impact-list > div {
  display: grid;
  gap: 0.45rem;
  padding-block: 1.2rem;
  border-top: 0.0625rem solid rgb(157 163 170 / 0.65);
}

.impact-list dt {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 650;
}

.impact-list dd {
  margin-left: 0;
  color: var(--ink);
  font-size: clamp(1.25rem, 2.4vw, 2rem);
  font-weight: 610;
  letter-spacing: -0.035em;
  line-height: 1.15;
}

.impact-list > div:first-child dd {
  color: var(--accent);
}

.section {
  padding-top: var(--section-space);
  padding-bottom: var(--section-space);
  border-bottom: 0.0625rem solid var(--line);
}

.section-heading {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  margin-bottom: clamp(2.5rem, 6vw, 5rem);
  gap: 1rem 2rem;
}

.section-heading .section-index {
  grid-column: 1 / span 3;
}

.section-heading h2 {
  grid-column: 4 / span 6;
}

.section-heading > p:last-child {
  grid-column: 10 / -1;
  align-self: end;
  margin-bottom: 0.45rem;
  color: var(--muted);
}

.section-index {
  margin-bottom: 1rem;
  color: var(--accent);
}

.case-card {
  margin-bottom: 1rem;
  border: 0.0625rem solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 0.75rem 2rem rgb(24 38 63 / 0.035);
}

.case-card summary {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  min-height: 6rem;
  gap: 0.75rem 1rem;
  padding: clamp(1rem, 2.1vw, 1.75rem);
  cursor: pointer;
  list-style: none;
}

.case-card summary::-webkit-details-marker {
  display: none;
}

.case-card summary::marker {
  content: "";
}

.case-card summary:hover {
  box-shadow: inset 0.25rem 0 var(--accent);
}

.case-card[open] {
  border-color: var(--ink);
}

.case-card[open] summary {
  border-bottom: 0.0625rem solid var(--line);
}

.case-number {
  grid-column: span 1;
  color: var(--accent);
}

.case-company {
  grid-column: span 2;
  color: var(--muted);
}

.case-title {
  grid-column: span 6;
  font-size: clamp(1.05rem, 1rem + 0.65vw, 1.6rem);
  font-weight: 590;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.case-signal {
  grid-column: span 3;
  color: var(--accent);
  font-weight: 760;
  text-align: right;
}

.case-featured summary {
  border-top: 0.35rem solid var(--accent);
  background: var(--ink);
  color: var(--surface);
}

.case-featured .case-number,
.case-featured .case-company,
.case-featured .case-title,
.case-featured .case-signal {
  color: var(--surface);
}

.case-featured .case-company {
  color: rgb(243 240 232 / 0.72);
}

.case-body {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.25rem;
  padding: clamp(1.25rem, 3vw, 2.5rem);
}

.case-fact {
  grid-column: span 3;
  min-width: 0;
  padding-top: 1rem;
  border-top: 0.0625rem solid var(--line);
}

.case-fact h3,
.case-decisions h3 {
  font-size: 0.9rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.case-fact p,
.case-decisions li {
  color: var(--muted);
}

.case-decisions {
  grid-column: 1 / span 7;
  min-width: 0;
  padding: 1.5rem;
  border-left: 0.25rem solid var(--accent);
  background: var(--paper);
}

.case-decisions ul {
  margin-bottom: 0;
  padding-left: 1.25rem;
}

.case-decisions li + li {
  margin-top: 0.6rem;
}

.case-results {
  grid-column: 8 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 0;
  border: 0.0625rem solid var(--line);
}

.case-results > div {
  min-width: 0;
  padding: 1.1rem;
}

.case-results > div + div {
  border-left: 0.0625rem solid var(--line);
}

.case-results dt {
  margin-bottom: 0.75rem;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 680;
}

.case-results dd {
  margin-left: 0;
  font-size: clamp(1rem, 1.4vw, 1.35rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.case-results > div:first-child dd {
  color: var(--accent);
}

.approach {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 2rem;
}

.approach .section-heading {
  grid-column: 1 / span 4;
  display: block;
  margin-bottom: 0;
}

.approach .section-heading h2 {
  max-width: 10ch;
}

.approach .section-heading > p:last-child {
  color: var(--muted);
}

.approach-steps {
  grid-column: 5 / -1;
  margin-bottom: 0;
  padding-left: 0;
  border-top: 0.0625rem solid var(--ink);
  counter-reset: delivery-step;
  list-style: none;
}

.approach-steps li {
  display: grid;
  grid-template-columns: 3.5rem minmax(9rem, 0.8fr) minmax(0, 1.5fr);
  align-items: baseline;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 0.0625rem solid var(--line);
  counter-increment: delivery-step;
}

.approach-steps li::before {
  color: var(--accent);
  content: "0" counter(delivery-step);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
}

.approach-steps b {
  font-size: 1.05rem;
}

.approach-steps span {
  color: var(--muted);
}

.artifact-list {
  grid-column: 5 / -1;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  border: 0.0625rem solid var(--line);
  list-style: none;
}

.artifact-list li {
  display: grid;
  place-items: center;
  min-height: 5.5rem;
  padding: 0.75rem;
  color: var(--ink);
  font-size: 0.88rem;
  font-weight: 650;
  text-align: center;
}

.artifact-list li + li {
  border-left: 0.0625rem solid var(--line);
}

.timeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 0;
  padding-left: 0;
  border-top: 0.0625rem solid var(--ink);
  list-style: none;
}

.timeline li {
  position: relative;
  min-width: 0;
  padding: 2rem 1.25rem 1.5rem;
  border-bottom: 0.0625rem solid var(--line);
}

.timeline li + li {
  border-left: 0.0625rem solid var(--line);
}

.timeline li::before {
  position: absolute;
  top: -0.35rem;
  left: 1.25rem;
  width: 0.65rem;
  height: 0.65rem;
  border: 0.125rem solid var(--paper);
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0.0625rem var(--accent);
  content: "";
}

.timeline time {
  display: block;
  margin-bottom: 1rem;
  color: var(--muted);
}

.timeline h3 {
  overflow-wrap: anywhere;
}

.timeline p {
  min-height: 4.8em;
  margin-bottom: 0.75rem;
  color: var(--muted);
}

.timeline-scale {
  display: block;
  margin-bottom: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.4;
}

.timeline strong {
  display: block;
  font-size: 0.95rem;
  line-height: 1.4;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.capability-grid article {
  min-width: 0;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  border: 0.0625rem solid var(--line);
  border-top: 0.25rem solid var(--ink);
  background: var(--surface);
}

.capability-grid ul {
  margin-bottom: 0;
  padding-left: 1.2rem;
  color: var(--muted);
}

.capability-grid li + li {
  margin-top: 0.45rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1rem;
  border: 0.0625rem solid var(--line);
}

.tools-grid > div {
  min-width: 0;
  padding: 1.25rem;
}

.tools-grid > div + div {
  border-left: 0.0625rem solid var(--line);
}

.tools-grid h3,
.credentials h3 {
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.tools-grid p,
.credentials p {
  margin-bottom: 0;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.credentials {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.credentials > div {
  min-width: 0;
  padding: 1.5rem;
  border: 0.0625rem solid var(--line);
  background: rgb(243 240 232 / 0.58);
}

.credentials p + p {
  margin-top: 0.55rem;
}

.contact {
  width: min(calc(100% - 2 * var(--page-gutter)), calc(var(--content-width) - 2 * var(--page-gutter)));
  margin-top: var(--section-space);
  margin-bottom: var(--section-space);
  padding: clamp(2rem, 6vw, 6rem);
  border-top: 0.45rem solid var(--accent);
  border-bottom: 0;
  background: var(--ink);
  color: var(--surface);
  box-shadow: 0 1.5rem 4rem rgb(24 38 63 / 0.14);
}

.contact .section-index,
.contact h2 {
  color: var(--surface);
}

.contact h2 {
  max-width: 18ch;
}

.contact-actions > a {
  min-width: 0;
  padding: 0.7rem 0.9rem;
  color: var(--surface);
  overflow-wrap: anywhere;
}

.contact-actions .button-primary {
  border-color: var(--surface);
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 6rem;
  gap: 1rem;
  border-top: 0.0625rem solid var(--line);
  color: var(--muted);
  font-size: 0.9rem;
}

.site-footer a {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
}

@media (max-width: 70rem) {
  .site-header {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 0.35rem;
  }

  .site-nav {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: flex-start;
    border-top: 0.0625rem solid rgb(157 163 170 / 0.45);
  }

  .hero {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .hero-copy {
    grid-column: 1 / span 4;
  }

  .impact-panel {
    grid-column: 5 / -1;
  }

  .section-heading {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .section-heading .section-index {
    grid-column: 1 / span 2;
  }

  .section-heading h2 {
    grid-column: 3 / span 4;
  }

  .section-heading > p:last-child {
    grid-column: 3 / -1;
  }

  .case-card summary {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .case-number {
    grid-column: span 1;
  }

  .case-company {
    grid-column: span 2;
  }

  .case-title {
    grid-column: span 3;
  }

  .case-signal {
    grid-column: 2 / -1;
    text-align: left;
  }

  .case-body {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .case-fact {
    grid-column: span 3;
  }

  .case-decisions {
    grid-column: 1 / span 4;
  }

  .case-results {
    grid-column: 5 / -1;
    grid-template-columns: 1fr;
  }

  .case-results > div + div {
    border-top: 0.0625rem solid var(--line);
    border-left: 0;
  }

  .approach {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .approach .section-heading {
    grid-column: 1 / span 2;
  }

  .approach-steps,
  .artifact-list {
    grid-column: 3 / -1;
  }

  .artifact-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .artifact-list li + li {
    border-left: 0;
  }

  .artifact-list li {
    border: 0.0625rem solid rgb(157 163 170 / 0.55);
  }

  .timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .timeline li + li {
    border-left: 0;
  }

  .timeline li:nth-child(even) {
    border-left: 0.0625rem solid var(--line);
  }

  .tools-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .tools-grid > div + div {
    border-left: 0;
  }

  .tools-grid > div:nth-child(even) {
    border-left: 0.0625rem solid var(--line);
  }

  .tools-grid > div:nth-child(n + 3) {
    border-top: 0.0625rem solid var(--line);
  }
}

@media (max-width: 48rem) {
  :root {
    --header-height: 7.5rem;
    --section-space: clamp(4rem, 16vw, 6rem);
  }

  .site-header {
    padding: 0.5rem var(--page-gutter);
  }

  .site-header.is-compact {
    padding-top: 0.35rem;
    padding-bottom: 0.35rem;
  }

  .availability {
    display: none;
  }

  .site-nav {
    justify-content: space-between;
    gap: 0.15rem;
  }

  .site-nav a {
    padding-inline: 0.4rem;
    font-size: clamp(0.72rem, 2.8vw, 0.85rem);
  }

  .hero {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-height: auto;
    gap: 2.5rem;
  }

  .hero-copy,
  .impact-panel {
    grid-column: 1 / -1;
  }

  .hero h1 {
    max-width: none;
    font-size: clamp(2.2rem, 11vw, 4rem);
  }

  .impact-panel {
    align-self: auto;
  }

  .section-heading {
    display: block;
  }

  .section-heading h2 {
    max-width: 12ch;
  }

  .section-heading > p:last-child {
    margin-bottom: 0;
  }

  .case-card summary {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-height: 8rem;
  }

  .case-number {
    grid-column: span 1;
  }

  .case-company {
    grid-column: 2 / -1;
  }

  .case-title,
  .case-signal {
    grid-column: 1 / -1;
  }

  .case-body {
    display: block;
  }

  .case-fact,
  .case-decisions,
  .case-results {
    margin-bottom: 1rem;
  }

  .case-decisions {
    padding: 1.25rem;
  }

  .case-results {
    display: grid;
    grid-template-columns: 1fr;
  }

  .approach {
    display: block;
  }

  .approach .section-heading {
    margin-bottom: 2.5rem;
  }

  .approach-steps li {
    grid-template-columns: 2.5rem minmax(0, 1fr);
  }

  .approach-steps span {
    grid-column: 2;
  }

  .artifact-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 2rem;
  }

  .timeline {
    grid-template-columns: 1fr;
  }

  .timeline li,
  .timeline li:nth-child(even) {
    border-right: 0;
    border-left: 0;
  }

  .timeline p {
    min-height: 0;
  }

  .capability-grid,
  .tools-grid,
  .credentials {
    grid-template-columns: 1fr;
  }

  .tools-grid > div,
  .tools-grid > div:nth-child(even),
  .tools-grid > div:nth-child(n + 3) {
    border-top: 0.0625rem solid var(--line);
    border-left: 0;
  }

  .tools-grid > div:first-child {
    border-top: 0;
  }

  .contact {
    width: calc(100% - 2 * var(--page-gutter));
    padding: 2rem 1.25rem;
  }

  .contact-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .contact-actions > a {
    justify-content: flex-start;
    width: 100%;
  }

  .site-footer {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 26rem) {
  .brand-name {
    display: none;
  }

  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-actions > a {
    width: 100%;
  }

  .artifact-list {
    grid-template-columns: 1fr;
  }
}
~~~~

- [ ] **Step 4: Build the fonts and turn the design contract GREEN**

Run:

~~~~powershell
npm run build
node --test tests/design-contract.test.mjs
npm run check:html
~~~~

Expected: 3 design-contract tests pass, both HTML documents validate, and site/assets/fonts contains exactly eight WOFF2 files plus two license files.

- [ ] **Step 5: Commit the visual system**

~~~~powershell
git add scripts/copy-fonts.mjs site/assets/css/styles.css site/assets/fonts site/index.html site/en/index.html tests/design-contract.test.mjs
git commit -m "feat: add warm Executive Blueprint design system"
~~~~

---

### Task 7: Add tested progressive behavior and motion-safe enhancement

**Files:**
- Create: tests/site.spec.mjs
- Create: site/assets/js/main.js
- Modify: site/assets/css/styles.css
- Test: site/index.html
- Test: site/en/index.html

- [ ] **Step 1: Write the failing browser behavior tests**

Create tests/site.spec.mjs:

~~~~js
import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

const origin = "http://127.0.0.1:4173";
const rootPath = "/mikhail-eroshkin-portfolio/";
const locales = [
  {
    path: rootPath,
    heading: "Управляю сложностью. Поставляю результат.",
    languageHref: "en/"
  },
  {
    path: rootPath + "en/",
    heading: "I manage complexity. I deliver outcomes.",
    languageHref: "../"
  }
];

test("both locale pages retain their core journey without JavaScript", async ({ browser }) => {
  for (const locale of locales) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(origin + locale.path);

    await expect(page.locator("h1")).toHaveText(locale.heading);
    await expect(page.locator("[data-case]")).toHaveCount(4);
    await expect(page.locator("[data-case]").first()).toHaveAttribute("open", "");
    await expect(page.locator('a[href="mailto:mike.eroshkin@yandex.ru"]')).toBeVisible();
    await expect(page.locator("[data-language-link]")).toHaveAttribute("href", locale.languageHref);

    const secondCase = page.locator("[data-case]").nth(1);
    await expect(secondCase).not.toHaveAttribute("open", "");
    await secondCase.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(secondCase).toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(secondCase).not.toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(secondCase).toHaveAttribute("open", "");

    await context.close();
  }
});

test("the language switch preserves the current semantic section", async ({ page }) => {
  await page.goto(rootPath + "#experience");
  const languageLink = page.locator("[data-language-link]");

  await expect(languageLink).toHaveAttribute("href", "en/#experience");
  await languageLink.click();
  await expect(page).toHaveURL(origin + rootPath + "en/#experience");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#experience")).toBeVisible();
  await expect(languageLink).toHaveAttribute("href", "../#experience");
  await languageLink.click();
  await expect(page).toHaveURL(origin + rootPath + "#experience");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});

test("scrolling compacts the header and marks the current navigation item", async ({ page }) => {
  await page.goto(rootPath);
  const header = page.locator("[data-site-header]");

  await expect(header).not.toHaveClass(/is-compact/);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(header).toHaveClass(/is-compact/);

  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-nav-link][href="#experience"]')).toHaveAttribute("aria-current", "location");
  await expect.poll(async () => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("smooth");
});

test("reveal enhancement runs only after setup and reveals an observed section", async ({ page }) => {
  await page.goto(rootPath);
  const html = page.locator("html");
  const contact = page.locator("#contact");

  await expect(html).toHaveClass(/motion-ready/);
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toHaveClass(/is-revealed/);
  await expect.poll(async () => contact.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
});

test("reduced-motion visitors receive no hidden or moving content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(rootPath);

  const state = await page.evaluate(() => ({
    rootClass: document.documentElement.className,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    reveals: [...document.querySelectorAll("[data-reveal]")].map((element) => {
      const style = getComputedStyle(element);
      return { opacity: style.opacity, transform: style.transform };
    })
  }));

  expect(state.rootClass).not.toContain("motion-ready");
  expect(state.scrollBehavior).toBe("auto");
  expect(state.reveals.length).toBeGreaterThan(0);
  for (const reveal of state.reveals) {
    expect(reveal.opacity).toBe("1");
    expect(reveal.transform).toBe("none");
  }
});

test("the responsive system has no page-level overflow at approved widths", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(rootPath);

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    }));

    expect(dimensions.document, "document overflow at " + width + "px").toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body, "body overflow at " + width + "px").toBeLessThanOrEqual(dimensions.viewport);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("[data-case]").first()).toBeVisible();
    await expect(page.locator("#contact")).toBeAttached();
  }
});

test("the first keyboard stop is a visible skip link", async ({ page }) => {
  await page.goto(rootPath);
  await page.keyboard.press("Tab");
  const skipLink = page.locator(".skip-link");

  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  const outline = await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");
});

test("both locale pages load with no console, page, or request errors", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push("console: " + message.text());
  });
  page.on("pageerror", (error) => errors.push("page: " + error.message));
  page.on("requestfailed", (request) => errors.push("request: " + request.url()));

  for (const locale of locales) await page.goto(locale.path);

  expect(errors).toEqual([]);
});

test("both locale pages have no WCAG A or AA Axe violations", async ({ page }) => {
  for (const locale of locales) {
    await page.goto(locale.path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      locale.path + ": " + results.violations.map((violation) => violation.id).join(", ")
    ).toEqual([]);
  }
});
~~~~

- [ ] **Step 2: Run the browser suite and confirm RED**

Run:

~~~~powershell
npm run test:e2e
~~~~

Expected: FAIL. The language link remains en/ instead of en/#experience, the header never receives is-compact, and the active navigation link has no aria-current value.

- [ ] **Step 3: Add the complete defensive progressive-enhancement script**

Create site/assets/js/main.js:

~~~~js
const header = document.querySelector("[data-site-header]");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("[data-nav-section]")];
const languageLink = document.querySelector("[data-language-link]");
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function sectionFromHash() {
  const id = window.location.hash.slice(1);
  if (!id) return null;
  return sections.find((section) => section.id === id) || null;
}

function sectionFromLayout() {
  if (sections.length === 0) return null;

  const marker = window.innerHeight * 0.38;
  let current = sections[0];

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom > 0) current = section;
  }

  return current;
}

function setLanguageTarget(sectionId) {
  if (!languageLink) return;

  const base = languageLink.dataset.languageBase || languageLink.getAttribute("href") || "";
  const hash = sectionId && sectionId !== "top" ? "#" + sectionId : "";
  languageLink.setAttribute("href", base + hash);
}

function setActiveSection(section) {
  if (!section) return;

  const targetHref = "#" + section.id;
  for (const link of navLinks) {
    if (link.getAttribute("href") === targetHref) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  setLanguageTarget(section.id);
}

setActiveSection(sectionFromHash() || sectionFromLayout());

if (sections.length > 0 && "IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver(
    () => setActiveSection(sectionFromLayout()),
    {
      rootMargin: "-18% 0px -62% 0px",
      threshold: [0, 0.01]
    }
  );

  for (const section of sections) navigationObserver.observe(section);
} else {
  window.addEventListener(
    "scroll",
    () => setActiveSection(sectionFromLayout()),
    { passive: true }
  );
}

window.addEventListener("hashchange", () => {
  setActiveSection(sectionFromHash() || sectionFromLayout());
});

let headerFramePending = false;

function updateCompactHeader() {
  headerFramePending = false;
  if (header) header.classList.toggle("is-compact", window.scrollY > 48);
}

function requestHeaderUpdate() {
  if (headerFramePending) return;
  headerFramePending = true;
  window.requestAnimationFrame(updateCompactHeader);
}

updateCompactHeader();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

let revealFallback = 0;

function revealEverything() {
  if (revealFallback) window.clearTimeout(revealFallback);
  document.documentElement.classList.remove("motion-ready");
  for (const target of revealTargets) target.classList.add("is-revealed");
}

function enableRevealObserver() {
  if (
    revealTargets.length === 0 ||
    reducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    revealEverything();
    return;
  }

  revealFallback = window.setTimeout(revealEverything, 6000);
  const pendingTargets = new Set();

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
        pendingTargets.delete(entry.target);
        if (pendingTargets.size === 0 && revealFallback) window.clearTimeout(revealFallback);
      }
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08
    }
  );

  for (const target of revealTargets) {
    if (target.getBoundingClientRect().top < window.innerHeight * 0.9) {
      target.classList.add("is-revealed");
    } else {
      pendingTargets.add(target);
      revealObserver.observe(target);
    }
  }

  if (pendingTargets.size === 0 && revealFallback) window.clearTimeout(revealFallback);

  window.requestAnimationFrame(() => {
    document.documentElement.classList.add("motion-ready");
  });
}

enableRevealObserver();

reducedMotion.addEventListener("change", (event) => {
  if (event.matches) revealEverything();
});
~~~~

- [ ] **Step 4: Append the complete motion contract to the stylesheet**

Append this exact block to site/assets/css/styles.css:

~~~~css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }

  .site-header {
    transition:
      min-height 220ms ease,
      padding 220ms ease,
      box-shadow 220ms ease;
  }

  .site-nav a,
  .language-switch,
  .button,
  .case-card summary {
    transition:
      color 160ms ease,
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;
  }

  .motion-ready [data-reveal] {
    opacity: 0;
    transform: translateY(1.25rem);
    transition:
      opacity 520ms ease,
      transform 520ms ease;
  }

  .motion-ready [data-reveal].is-revealed {
    opacity: 1;
    transform: none;
  }

  .case-card[open] .case-body {
    animation: case-body-enter 260ms ease-out both;
  }

  @keyframes case-body-enter {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .motion-ready [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
  }
}
~~~~

- [ ] **Step 5: Run the full behavior and regression checks**

Run:

~~~~powershell
node --check site/assets/js/main.js
npm run test:e2e
node --test tests/design-contract.test.mjs
npm run check:html
~~~~

Expected: JavaScript syntax validation exits 0, all 9 Playwright tests pass, all 3 design-contract tests stay green, and both HTML pages validate.

- [ ] **Step 6: Commit the progressive behavior**

~~~~powershell
git add site/assets/js/main.js site/assets/css/styles.css tests/site.spec.mjs
git commit -m "feat: add accessible portfolio interactions"
~~~~

---

### Task 8: Add production SEO metadata and deterministic social cards

**Files:**
- Create: `tests/seo.test.mjs`
- Create: `scripts/generate-social-images.mjs`
- Create: `site/assets/images/favicon.svg`
- Create via generator: `site/assets/images/social-ru.png`
- Create via generator: `site/assets/images/social-en.png`
- Create: `site/sitemap.xml`
- Modify: `site/index.html`
- Modify: `site/en/index.html`
- Modify: `package.json`

- [ ] **Step 1: Write the failing SEO and social-image contract**

Create `tests/seo.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the SEO contract and confirm RED**

Run:

```powershell
node --test tests/seo.test.mjs
```

Expected: FAIL because the production canonical metadata, `site/sitemap.xml`, and generated PNG files do not exist yet.

- [ ] **Step 3: Add the vector favicon**

Create `site/assets/images/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#E6E2D8"/>
  <path d="M8 16.5H56M8 32H56M8 47.5H56M16.5 8V56M32 8V56M47.5 8V56" fill="none" stroke="#9DA3AA" stroke-opacity=".28"/>
  <path d="M12 46V19L23 37L34 19V46M40 19H54M40 32H51M40 46H54M40 19V46" fill="none" stroke="#18263F" stroke-width="4.5" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M10 53H54" fill="none" stroke="#A04330" stroke-width="3"/>
</svg>
```

- [ ] **Step 4: Add the absolute bilingual sitemap**

Create `site/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/</loc>
    <xhtml:link rel="alternate" hreflang="ru" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/"/>
  </url>
  <url>
    <loc>https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/</loc>
    <xhtml:link rel="alternate" hreflang="ru" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/"/>
  </url>
</urlset>
```

- [ ] **Step 5: Add deterministic localized social-card generation**

Create `scripts/generate-social-images.mjs`:

```js
import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const fontRoot = resolve("site/assets/fonts");
const outputRoot = resolve("site/assets/images");

async function dataUrl(name) {
  const file = await readFile(resolve(fontRoot, name));
  return `data:font/woff2;base64,${file.toString("base64")}`;
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
```

Update the existing `build` script without changing the locked dependency versions:

```powershell
npm pkg set 'scripts.build=node scripts/copy-fonts.mjs && node scripts/generate-social-images.mjs'
```

- [ ] **Step 6: Replace the Russian document head with complete RU metadata**

Replace the complete existing `head` element in `site/index.html` with:

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Михаил Ерошкин — руководитель проектов и поставки в финтехе</title>
  <meta name="description" content="Управляю сложными цифровыми проектами в финтехе: миграции, кросс-функциональные команды и измеримый результат — от 5 дней до 6 часов.">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#E6E2D8">

  <link rel="canonical" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/">
  <link rel="alternate" hreflang="ru" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/">
  <link rel="alternate" hreflang="en" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/">
  <link rel="alternate" hreflang="x-default" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/">
  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/unbounded-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/unbounded-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/commissioner-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/commissioner-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/styles.css">
  <script type="module" src="assets/js/main.js"></script>

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="Михаил Ерошкин">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:url" content="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/">
  <meta property="og:title" content="Михаил Ерошкин — руководитель проектов и поставки в финтехе">
  <meta property="og:description" content="Управляю сложными цифровыми проектами в финтехе: миграции, кросс-функциональные команды и измеримый результат — от 5 дней до 6 часов.">
  <meta property="og:image" content="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/assets/images/social-ru.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Михаил Ерошкин — управляю сложностью и поставляю результат">
  <meta property="profile:first_name" content="Михаил">
  <meta property="profile:last_name" content="Ерошкин">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Михаил Ерошкин — руководитель проектов и поставки в финтехе">
  <meta name="twitter:description" content="Управляю сложными цифровыми проектами в финтехе: миграции, кросс-функциональные команды и измеримый результат — от 5 дней до 6 часов.">
  <meta name="twitter:image" content="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/assets/images/social-ru.png">
  <meta name="twitter:image:alt" content="Михаил Ерошкин — управляю сложностью и поставляю результат">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/#person",
    "name": "Михаил Ерошкин",
    "url": "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/",
    "email": "mailto:mike.eroshkin@yandex.ru",
    "telephone": "+79620233302",
    "jobTitle": "Старший руководитель проектов и руководитель поставки цифровых продуктов",
    "description": "Руководитель сложных цифровых проектов в финтехе, B2B SaaS и технологических компаниях.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ставрополь",
      "addressCountry": "RU"
    },
    "knowsLanguage": ["Русский", "Английский"],
    "sameAs": [
      "https://linkedin.com/in/productmichaeleroshkin",
      "https://productmike.ru"
    ]
  }
  </script>
</head>
```

- [ ] **Step 7: Replace the English document head with complete EN metadata**

Replace the complete existing `head` element in `site/en/index.html` with:

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mikhail Eroshkin — Senior Project and Delivery Manager in FinTech</title>
  <meta name="description" content="Senior Project and Delivery Manager for complex FinTech products, migrations and cross-functional teams, with outcomes measured in speed, scale and revenue.">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#E6E2D8">

  <link rel="canonical" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/">
  <link rel="alternate" hreflang="ru" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/">
  <link rel="alternate" hreflang="en" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/">
  <link rel="alternate" hreflang="x-default" href="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/">
  <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="../assets/fonts/unbounded-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="../assets/fonts/commissioner-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script type="module" src="../assets/js/main.js"></script>

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="Mikhail Eroshkin">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="ru_RU">
  <meta property="og:url" content="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/">
  <meta property="og:title" content="Mikhail Eroshkin — Senior Project and Delivery Manager in FinTech">
  <meta property="og:description" content="Senior Project and Delivery Manager for complex FinTech products, migrations and cross-functional teams, with outcomes measured in speed, scale and revenue.">
  <meta property="og:image" content="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/assets/images/social-en.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Mikhail Eroshkin — I manage complexity and deliver outcomes">
  <meta property="profile:first_name" content="Mikhail">
  <meta property="profile:last_name" content="Eroshkin">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Mikhail Eroshkin — Senior Project and Delivery Manager in FinTech">
  <meta name="twitter:description" content="Senior Project and Delivery Manager for complex FinTech products, migrations and cross-functional teams, with outcomes measured in speed, scale and revenue.">
  <meta name="twitter:image" content="https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/assets/images/social-en.png">
  <meta name="twitter:image:alt" content="Mikhail Eroshkin — I manage complexity and deliver outcomes">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/#person",
    "name": "Mikhail Eroshkin",
    "url": "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/en/",
    "email": "mailto:mike.eroshkin@yandex.ru",
    "telephone": "+79620233302",
    "jobTitle": "Senior Project Manager and Delivery Manager",
    "description": "Delivery leader for complex digital products in FinTech, B2B SaaS and technology companies.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Stavropol",
      "addressCountry": "RU"
    },
    "knowsLanguage": ["Russian", "English"],
    "sameAs": [
      "https://linkedin.com/in/productmichaeleroshkin",
      "https://productmike.ru"
    ]
  }
  </script>
</head>
```

- [ ] **Step 8: Generate the social cards and confirm GREEN**

Run:

```powershell
npm run build
node --test tests/seo.test.mjs
npm run check:html
```

Expected: the generator reports both 1200×630 PNG files, every SEO test passes, and html-validate reports 0 errors.

- [ ] **Step 9: Commit production metadata and social assets**

```powershell
git add package.json site/index.html site/en/index.html site/sitemap.xml site/assets/images/favicon.svg site/assets/images/social-ru.png site/assets/images/social-en.png scripts/generate-social-images.mjs tests/seo.test.mjs
git commit -m "feat: add bilingual SEO and social previews"
```

---

### Task 9: Enforce links, accessibility, responsive layout, and Lighthouse budgets

**Files:**
- Create: `tests/link-checker.test.mjs`
- Create: `scripts/check-links.mjs`
- Create: `scripts/run-lighthouse.mjs`
- Create: `tests/quality.spec.mjs`
- Create: `.lighthouserc.json`

- [ ] **Step 1: Write failing unit tests for the local-link checker**

Create `tests/link-checker.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the link-checker tests and confirm RED**

Run:

```powershell
node --test tests/link-checker.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/check-links.mjs`.

- [ ] **Step 3: Implement the dependency-free local-link checker**

Create `scripts/check-links.mjs`:

```js
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
```

- [ ] **Step 4: Run the unit and production link checks**

Run:

```powershell
node --test tests/link-checker.test.mjs
npm run build
npm run check:links
```

Expected: both unit tests pass and the CLI prints `All local links, resources, fragments, and locale IDs are valid.`

- [ ] **Step 5: Add Axe, focus, reduced-motion, touch-target, and responsive browser tests**

Create `tests/quality.spec.mjs`:

```js
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const locales = [
  { name: "RU", path: "./" },
  { name: "EN", path: "en/" }
];
const widths = [320, 375, 768, 1024, 1440];

for (const locale of locales) {
  test(`${locale.name} has no WCAG A/AA violations with every case exposed`, async ({ page }) => {
    await page.goto(locale.path);
    await page.locator("details[data-case]").evaluateAll((details) => {
      for (const item of details) item.open = true;
    });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });

  test(`${locale.name} exposes visible focus and 44px interactive targets`, async ({ page }) => {
    await page.goto(locale.path);
    await page.keyboard.press("Tab");
    const focus = await page.locator(":focus").evaluate((element) => {
      const style = getComputedStyle(element);
      return { outlineStyle: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth) };
    });
    expect(focus.outlineStyle).not.toBe("none");
    expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);

    const undersized = await page.locator("a[href], button, summary").evaluateAll((elements) =>
      elements.filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && (rect.width < 44 || rect.height < 44);
      }).map((element) => {
        const rect = element.getBoundingClientRect();
        return `${element.tagName.toLowerCase()} ${element.textContent.trim().slice(0, 50)} (${Math.round(rect.width)}×${Math.round(rect.height)})`;
      })
    );
    expect(undersized).toEqual([]);
  });

  test(`${locale.name} disables motion when the user requests it`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(locale.path);
    const motion = await page.evaluate(() => {
      const seconds = (value) => value.split(",").map((part) => {
        const item = part.trim();
        return item.endsWith("ms") ? parseFloat(item) / 1000 : parseFloat(item);
      });
      const offenders = [];
      for (const element of document.querySelectorAll("*")) {
        const style = getComputedStyle(element);
        const duration = Math.max(...seconds(style.animationDuration), ...seconds(style.transitionDuration));
        if (duration > 0.001) offenders.push(`${element.tagName.toLowerCase()}.${element.className}`);
      }
      return { scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, offenders };
    });
    expect(motion.scrollBehavior).toBe("auto");
    expect(motion.offenders).toEqual([]);
  });

  for (const width of widths) {
    test(`${locale.name} stays inside a ${width}px viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale.path);
      await page.evaluate(async () => { await document.fonts.ready; });

      const layout = await page.evaluate(() => {
        const root = document.documentElement;
        const overflow = [...document.body.querySelectorAll("*")].filter((element) => {
          const style = getComputedStyle(element);
          if (style.position === "fixed" || style.visibility === "hidden") return false;
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > root.clientWidth + 1;
        }).map((element) => `${element.tagName.toLowerCase()}.${element.className}`);
        const clippedText = [...document.querySelectorAll("h1, h2, h3, p, a, summary, dt, dd, li")].filter((element) =>
          element.scrollWidth > element.clientWidth + 1 && getComputedStyle(element).overflowX !== "visible"
        ).map((element) => `${element.tagName.toLowerCase()}.${element.className}`);
        return {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          overflow,
          clippedText
        };
      });

      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
      expect(layout.overflow).toEqual([]);
      expect(layout.clippedText).toEqual([]);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("#contact")).toBeVisible();
    });
  }
}
```

- [ ] **Step 6: Add a portable Lighthouse launcher for Playwright's Chromium**

Create `scripts/run-lighthouse.mjs`:

```js
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const executable = process.platform === "win32"
  ? resolve("node_modules/.bin/lhci.cmd")
  : resolve("node_modules/.bin/lhci");

const child = spawn(executable, ["autorun"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    CHROME_PATH: chromium.executablePath()
  }
});

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Lighthouse stopped with signal ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code || 0;
  }
});
```

- [ ] **Step 7: Add Lighthouse production budgets for both project-prefixed locales**

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run serve",
      "startServerReadyPattern": "Portfolio server ready",
      "url": [
        "http://127.0.0.1:4173/mikhail-eroshkin-portfolio/",
        "http://127.0.0.1:4173/mikhail-eroshkin-portfolio/en/"
      ],
      "numberOfRuns": 1,
      "settings": {
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage",
        "maxWaitForLoad": 45000
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": ".lighthouseci/reports"
    }
  }
}
```

- [ ] **Step 8: Run browser quality and Lighthouse checks**

Run:

```powershell
npx playwright test tests/quality.spec.mjs
npm run audit
```

Expected: all 16 Playwright quality tests pass; Lighthouse produces two reports and every Performance, Accessibility, Best Practices, and SEO score is at least 0.90.

- [ ] **Step 9: Commit the quality gates**

```powershell
git add scripts/check-links.mjs scripts/run-lighthouse.mjs tests/link-checker.test.mjs tests/quality.spec.mjs .lighthouserc.json
git commit -m "test: enforce portfolio quality gates"
```

---

### Task 10: Add the GitHub Pages delivery contract and repository runbook

**Files:**
- Create: `tests/workflow.test.mjs`
- Create: `.github/workflows/pages.yml`
- Create: `README.md`

- [ ] **Step 1: Write the failing workflow, artifact, privacy, and README contract**

Create `tests/workflow.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const execFileAsync = promisify(execFile);

test("Pages workflow verifies first and deploys only site/ with current official actions", async () => {
  const workflow = await readFile(".github/workflows/pages.yml", "utf8");
  for (const action of [
    "actions/checkout@v7",
    "actions/setup-node@v7",
    "actions/configure-pages@v6",
    "actions/upload-pages-artifact@v5",
    "actions/deploy-pages@v5"
  ]) {
    assert.ok(workflow.includes(action), `missing ${action}`);
  }
  for (const command of [
    "npm ci",
    "npx playwright install --with-deps chromium",
    "npm run verify",
    "npm run audit"
  ]) {
    assert.ok(workflow.includes(command), `missing workflow command: ${command}`);
  }
  assert.match(workflow, /path:\s+\.\/site\s*$/m);
  assert.match(workflow, /include-hidden-files:\s+true\s*$/m);
  assert.doesNotMatch(workflow, /path:\s+\.\s*$/m);
  assert.match(workflow, /pages:\s+write/);
  assert.match(workflow, /id-token:\s+write/);
  assert.match(workflow, /environment:\s*\n\s+name:\s+github-pages/);
  assert.match(workflow, /if:\s+github\.event_name != 'pull_request'/);
});

test("tracked files exclude private job-search source documents", async () => {
  const { stdout } = await execFileAsync("git", ["ls-files"], { encoding: "utf8" });
  const tracked = stdout.split(/\r?\n/).filter(Boolean);
  const forbidden = tracked.filter((path) => /\.(?:pdf|docx|csv|mhtml)$/i.test(path) || /pasted-text/i.test(path));
  assert.deepEqual(forbidden, []);
});

test("README documents exact local and Pages operations", async () => {
  const readme = await readFile("README.md", "utf8");
  for (const text of [
    "npm ci",
    "npx playwright install chromium",
    "npm run serve",
    "npm run verify",
    "npm run audit",
    "site/",
    "GitHub Actions",
    "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/",
    "PDF, DOCX, CSV"
  ]) {
    assert.ok(readme.includes(text), `README is missing: ${text}`);
  }
});
```

- [ ] **Step 2: Run the delivery contract and confirm RED**

Run:

```powershell
node --test tests/workflow.test.mjs
```

Expected: FAIL because `.github/workflows/pages.yml` and `README.md` do not exist yet.

- [ ] **Step 3: Add the verify-package-deploy Pages workflow**

Create `.github/workflows/pages.yml`:

```yaml
name: Validate and deploy GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 25
    steps:
      - name: Check out repository
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Install development dependencies
        run: npm ci

      - name: Install Chromium and Linux browser dependencies
        run: npx playwright install --with-deps chromium

      - name: Build and verify the static site
        run: npm run verify

      - name: Enforce Lighthouse budgets
        run: npm run audit

  package:
    if: github.event_name != 'pull_request'
    needs: verify
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - name: Check out repository
        uses: actions/checkout@v7

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v6

      - name: Upload only the public site directory
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./site
          include-hidden-files: true

  deploy:
    if: github.event_name != 'pull_request'
    needs: package
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy GitHub Pages artifact
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 4: Add the public repository runbook and privacy boundary**

Create `README.md`:

````markdown
# Сайт-визитка Михаила Ерошкина

Двуязычный статический сайт Senior Project Manager / Delivery Manager с кейсами поставки цифровых продуктов в финтехе, B2B SaaS и технологических компаниях.

Публичный адрес: [mikeproduct14.github.io/mikhail-eroshkin-portfolio](https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/)

## Архитектура

- `site/index.html` — полностью русская версия;
- `site/en/index.html` — полностью английская версия;
- `site/assets/` — общие стили, JavaScript, локальные шрифты и изображения;
- `scripts/` — локальный сервер, сборка ассетов и статические проверки;
- `tests/` — Node.js- и Playwright-контракты;
- `.github/workflows/pages.yml` — проверка и публикация через GitHub Actions.

Сайт не использует frontend-фреймворк, backend, CMS, аналитику или runtime-зависимости от Node.js. JavaScript только улучшает навигацию и анимацию; содержимое и контакты доступны без него.

## Локальный запуск

Требуется Node.js 22 или новее и npm; CI использует Node.js 24.

```powershell
npm ci
npx playwright install chromium
npm run build
npm run serve
```

Открыть: [http://127.0.0.1:4173/mikhail-eroshkin-portfolio/](http://127.0.0.1:4173/mikhail-eroshkin-portfolio/)

Локальный сервер намеренно воспроизводит проектный префикс GitHub Pages, поэтому относительные пути RU/EN проверяются в production-подобном адресе.

## Проверка

```powershell
npm run verify
npm run audit
```

`npm run verify` копирует закреплённые локальные шрифты, заново создаёт две социальные PNG-карточки, проверяет HTML, внутренние ссылки, локали и браузерные сценарии. `npm run audit` требует не менее 90 баллов Lighthouse по Performance, Accessibility, Best Practices и SEO для обеих языковых версий.

## Социальные изображения

Карточки `site/assets/images/social-ru.png` и `site/assets/images/social-en.png` создаются детерминированно из локальных шрифтов:

```powershell
npm run build
```

Оба файла имеют размер 1200×630 и не смешивают языки.

## Публикация

В настройках репозитория GitHub Pages используется источник **GitHub Actions**. Любой push в `main` запускает полную проверку, Lighthouse-аудит, упаковку только каталога `site/` и публикацию в окружение `github-pages`. Pull request выполняет проверки, но не публикует сайт.

В Pages-артефакт не попадают `node_modules`, тесты, скрипты, планы или исходные материалы резюме.

## Граница публичных данных

Репозиторий намеренно содержит публичные контакты и показатели, согласованные для сайта. В него нельзя добавлять исходные PDF, DOCX, CSV, сохранённые страницы, вложения Codex или рабочие документы из каталога поиска работы. Перед каждым деплоем это ограничение проверяется автоматически.
````

- [ ] **Step 5: Run the workflow and privacy contract**

Run:

```powershell
node --test tests/workflow.test.mjs
npm run check:static
```

Expected: all workflow, privacy, README, content, static, and SEO tests pass.

- [ ] **Step 6: Commit the Pages workflow and runbook**

```powershell
git add .github/workflows/pages.yml README.md tests/workflow.test.mjs
git commit -m "ci: publish verified site to GitHub Pages"
```

---

### Task 11: Run the release gate and deploy through authenticated GitHub CLI

**Files:**
- Verify only; no source files are changed in this task.

- [ ] **Step 1: Run the complete clean-room release gate**

Run from the `feature/portfolio-site` worktree:

```powershell
npm ci
npx playwright install chromium
npm run verify
npm run audit

$forbidden = git ls-files | Where-Object { $_ -match '\.(pdf|docx|csv|mhtml)$' -or $_ -match 'pasted-text' }
if ($forbidden) { throw "Forbidden private source files are tracked: $($forbidden -join ', ')" }

git diff --exit-code
git diff --cached --exit-code
if (git status --porcelain) { throw "Worktree is not clean after release verification." }
```

Expected: installation, full verification, and both Lighthouse audits exit 0; the privacy list is empty; generated assets are reproducible; the worktree is clean.

- [ ] **Step 2: Check GitHub CLI authentication without mutating remote state**

Run:

```powershell
$ghCommand = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghCommand) {
  Write-Host "BLOCKED: GitHub CLI is not installed. Local implementation is complete; install gh and rerun Task 11 Step 2."
  exit 20
}

gh auth status --hostname github.com
if ($LASTEXITCODE -ne 0) {
  Write-Host "BLOCKED: GitHub CLI is not authenticated. Local implementation is complete; run 'gh auth login --hostname github.com --git-protocol https --web', then rerun Task 11 Step 2."
  exit 20
}

Write-Host "GitHub CLI authentication is ready."
```

Expected when authenticated: exit 0 and `GitHub CLI authentication is ready.`  
Expected when unavailable or unauthenticated: exit 20 with the exact `BLOCKED` message; stop here without creating a repository, changing remotes, pushing, or claiming deployment success.

- [ ] **Step 3: Create or validate the public repository and exact origin**

Run only after Step 2 exits 0:

```powershell
$repository = "MikeProduct14/mikhail-eroshkin-portfolio"
$expectedOrigin = "https://github.com/$repository.git"

gh repo view $repository --json nameWithOwner,visibility,url *> $null
if ($LASTEXITCODE -ne 0) {
  gh repo create $repository --public --description "Bilingual Senior Project Manager and Delivery Manager portfolio" --disable-issues --disable-wiki
  if ($LASTEXITCODE -ne 0) { throw "GitHub repository creation failed." }
}

$repositoryState = gh repo view $repository --json nameWithOwner,visibility,url | ConvertFrom-Json
if ($repositoryState.nameWithOwner -ne $repository) { throw "Unexpected repository: $($repositoryState.nameWithOwner)" }
if ($repositoryState.visibility -ne "PUBLIC") { throw "Repository exists but is not public; stop before deployment." }

$origin = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
  git remote add origin $expectedOrigin
} elseif ($origin -ne $expectedOrigin) {
  throw "Existing origin '$origin' does not match '$expectedOrigin'; stop without overwriting it."
}

git remote -v
git push --dry-run origin HEAD:main
if ($LASTEXITCODE -ne 0) { throw "The main push is not a safe fast-forward; stop without forcing." }
```

Expected: the repository exists publicly, `origin` is exact, and the dry-run reports a normal create or fast-forward. Never use `--force`.

- [ ] **Step 4: Push the verified commit, enable workflow-based Pages, and watch deployment**

Run:

```powershell
$repository = "MikeProduct14/mikhail-eroshkin-portfolio"

git push origin HEAD:main
if ($LASTEXITCODE -ne 0) { throw "Push to origin/main failed." }

gh api "repos/$repository/pages" *> $null
if ($LASTEXITCODE -eq 0) {
  gh api --method PUT "repos/$repository/pages" -f build_type=workflow *> $null
} else {
  gh api --method POST "repos/$repository/pages" -f build_type=workflow *> $null
}
if ($LASTEXITCODE -ne 0) { throw "Could not configure GitHub Pages with build_type=workflow." }

$headSha = git rev-parse HEAD
$runId = $null
for ($attempt = 1; $attempt -le 10 -and -not $runId; $attempt++) {
  $runId = gh run list --repo $repository --workflow pages.yml --branch main --event push --commit $headSha --limit 1 --json databaseId --jq '.[0].databaseId'
  if (-not $runId) { Start-Sleep -Seconds 2 }
}
if (-not $runId) { throw "Could not resolve the Pages workflow triggered by the main push." }

gh run watch $runId --repo $repository --exit-status
if ($LASTEXITCODE -ne 0) { throw "GitHub Pages workflow $runId failed." }
```

Expected: the non-forced main push triggers `pages.yml`, Pages is switched to `build_type=workflow` while the verify job runs, and the watched workflow exits successfully.

- [ ] **Step 5: Smoke-test the deployed RU, EN, CSS, social image, and sitemap URLs**

Run:

```powershell
$base = "https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/"
$pages = @(
  @{ Url = $base; Marker = "Управляю сложностью. Поставляю результат." },
  @{ Url = "${base}en/"; Marker = "I manage complexity. I deliver outcomes." }
)

foreach ($page in $pages) {
  $ready = $false
  for ($attempt = 1; $attempt -le 10 -and -not $ready; $attempt++) {
    try {
      $response = Invoke-WebRequest -Uri $page.Url -MaximumRedirection 5
      $visibleText = [System.Net.WebUtility]::HtmlDecode([regex]::Replace($response.Content, '<[^>]+>', ' ')) -replace '\s+', ' '
      $ready = $response.StatusCode -eq 200 -and $visibleText.Contains($page.Marker)
    } catch {
      $ready = $false
    }
    if (-not $ready) { Start-Sleep -Seconds 3 }
  }
  if (-not $ready) { throw "Deployed page did not become ready: $($page.Url)" }
}

foreach ($url in @(
  "${base}assets/css/styles.css",
  "${base}assets/images/social-ru.png",
  "${base}assets/images/social-en.png",
  "${base}sitemap.xml"
)) {
  $response = Invoke-WebRequest -Method Head -Uri $url -MaximumRedirection 5
  if ($response.StatusCode -ne 200) { throw "Deployed resource failed: $url" }
}

Write-Host "DEPLOYED: $base"
```

Expected: all six public URLs return 200, both locale pages contain their clean-language hero message, and the command prints `DEPLOYED: https://mikeproduct14.github.io/mikhail-eroshkin-portfolio/`.
