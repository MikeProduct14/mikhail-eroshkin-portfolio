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
