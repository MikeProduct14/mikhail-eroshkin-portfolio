import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

const locales = [
  {
    path: "",
    heading: "Управляю сложностью. Поставляю результат.",
    languageHref: "en/"
  },
  {
    path: "en/",
    heading: "I manage complexity. I deliver outcomes.",
    languageHref: "../"
  }
];

function localeUrl(testInfo, path = "") {
  return new URL(path || ".", testInfo.project.use.baseURL).toString();
}

test("both locale pages retain their core journey without JavaScript", async ({ browser }, testInfo) => {
  for (const locale of locales) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(localeUrl(testInfo, locale.path));

    await expect(page.locator("h1")).toHaveText(locale.heading);
    await expect(page.locator("[data-case]")).toHaveCount(4);
    await expect(page.locator("[data-case]").first()).toHaveAttribute("open", "");
    await expect(page.locator('a[href="mailto:mike.eroshkin@yandex.ru"]').first()).toBeVisible();
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

test("the language switch preserves the current semantic section", async ({ page }, testInfo) => {
  await page.goto(localeUrl(testInfo, "#experience"));
  const languageLink = page.locator("[data-language-link]");

  await expect(languageLink).toHaveAttribute("href", "en/#experience");
  await languageLink.click();
  await expect(page).toHaveURL(localeUrl(testInfo, "en/#experience"));
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#experience")).toBeVisible();
  await expect(languageLink).toHaveAttribute("href", "../#experience");
  await languageLink.click();
  await expect(page).toHaveURL(localeUrl(testInfo, "#experience"));
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});

test("scrolling compacts the header and marks the current navigation item", async ({ page }, testInfo) => {
  await page.goto(localeUrl(testInfo));
  const header = page.locator("[data-site-header]");

  await expect(header).not.toHaveClass(/is-compact/);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(header).toHaveClass(/is-compact/);

  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-nav-link][href="#experience"]')).toHaveAttribute("aria-current", "location");
  await expect.poll(async () => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("smooth");
});

test("reveal enhancement runs only after setup and reveals an observed section", async ({ page }, testInfo) => {
  await page.goto(localeUrl(testInfo));
  const html = page.locator("html");
  const contact = page.locator("#contact");

  await expect(html).toHaveClass(/motion-ready/);
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toHaveClass(/is-revealed/);
  await expect.poll(async () => contact.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
});

test("reduced-motion visitors receive no hidden or moving content", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(localeUrl(testInfo));

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

test("the responsive system has no page-level overflow at approved widths", async ({ page }, testInfo) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(localeUrl(testInfo));

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    }));

    expect(dimensions.document, `document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body, `body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("[data-case]").first()).toBeVisible();
    await expect(page.locator("#contact")).toBeAttached();
  }
});

test("the first keyboard stop is a visible skip link", async ({ page }, testInfo) => {
  await page.goto(localeUrl(testInfo));
  await page.keyboard.press("Tab");
  const skipLink = page.locator(".skip-link");

  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  const outline = await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");
});

test("both locale pages load with no console, page, request, or response errors", async ({ page }, testInfo) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("requestfailed", (request) => errors.push(`request: ${request.url()}`));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`response ${response.status()}: ${response.url()}`);
  });

  for (const locale of locales) await page.goto(localeUrl(testInfo, locale.path));

  expect(errors).toEqual([]);
});

test("both locale pages have no WCAG A or AA Axe violations", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const locale of locales) {
    await page.goto(localeUrl(testInfo, locale.path));
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      `${locale.path}: ${results.violations.map((violation) => violation.id).join(", ")}`
    ).toEqual([]);
  }
});
