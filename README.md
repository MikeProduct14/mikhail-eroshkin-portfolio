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
