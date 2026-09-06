import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const code = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
const secretName = "Beyond the pixels.";

async function enterCode(page: Page, keys = code) {
  for (const key of keys) await page.keyboard.press(key);
}

async function ready(page: Page) {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.locator(".portrait").focus();
  await expect(
    page.getByRole("heading", { name: "There’s more behind the pixels." }),
  ).toBeVisible();
}

test("portrait reveals the hint on hover or tap, and on keyboard focus", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const portrait = page.getByRole("button", { name: "Reveal portrait", exact: true });
  const hint = page.getByRole("dialog", { name: "There’s more behind the pixels." });
  if (isMobile) await portrait.tap();
  else await portrait.hover();
  await expect(hint).toBeVisible();
  await expect(hint.locator("kbd")).toHaveCount(10);
  await expect(hint).toContainText("Enter the Konami code");
  await expect(page.getByRole("dialog", { name: secretName })).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(hint).not.toBeVisible();
  await page.keyboard.press("Tab");
  await page.locator(".portrait").focus();
  await expect(hint).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Tab");
  await expect(page.locator(".portrait")).not.toBeFocused();
});

test("the complete code unlocks all six personal details and restores focus", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await ready(page);
  const position = await page.evaluate(() => scrollY);
  await enterCode(page, code.slice(0, -1));
  await expect(page.locator(".secret-code [data-entered='true']")).toHaveCount(9);
  await expect(page.getByRole("dialog", { name: secretName })).not.toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBe(position);
  await page.keyboard.press("a");

  const dialog = page.getByRole("dialog", { name: secretName });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: secretName })).toBeFocused();
  await expect(dialog.locator("li")).toHaveCount(6);
  await expect(dialog).toContainText("Half Spanish, half Honduran");
  await expect(dialog.getByRole("link", { name: /Made in Honduras/ })).toHaveAttribute(
    "href",
    "http://madeinhonduras.net/",
  );
  await expect(dialog).toContainText("is an old side project of mine");
  await expect(dialog).toContainText("I live close to the sea in sunny Badalona");
  await expect(dialog).toContainText("I love spending time with family");
  await expect(dialog).toContainText("a year off to travel around Asia and Latin America");
  await expect(dialog).toContainText("and work out too");
  await expect(dialog.getByRole("link", { name: /Viajo Luego Existo/ })).toHaveAttribute(
    "href",
    "https://www.viajoluegoexisto.co/blog",
  );
  await expect(dialog.getByRole("link")).toHaveCount(8);
  await expect(dialog).not.toContainText("Before joining Sketch");
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(".portrait")).toBeFocused();
  await expect(page.locator(".secret-hint")).not.toBeVisible();

  // The global listener also works when the portrait hint is closed.
  await enterCode(page);
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Back to the pixels" }).click();
  await expect(dialog).not.toBeVisible();
  await enterCode(page);
  await expect(dialog).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(dialog).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("wrong keys reset progress, held keys are ignored, and uppercase letters work", async ({
  page,
}) => {
  await ready(page);
  await enterCode(page, ["ArrowUp", "ArrowUp", "x", ...code.slice(2)]);
  await expect(page.getByRole("dialog", { name: secretName })).not.toBeVisible();
  await page.keyboard.down("ArrowUp");
  await page.keyboard.down("ArrowUp");
  await page.keyboard.up("ArrowUp");
  await expect(page.locator(".secret-code [data-entered='true']")).toHaveCount(1);
  await page.keyboard.press("x");
  // An extra Up overlaps with the start of a fresh, valid attempt.
  await enterCode(page, ["ArrowUp", ...code.slice(0, -2), "B", "A"]);
  await expect(page.getByRole("dialog", { name: secretName })).toBeVisible();
});

test("typing, shortcuts, and other dialogs do not unlock the secret", async ({ page }) => {
  await ready(page);
  await page.keyboard.press("Escape");
  for (const tag of ["input", "textarea", "div"]) {
    await page.evaluate((tagName) => {
      const field = document.createElement(tagName);
      field.id = "typing-test";
      if (tagName === "div") field.contentEditable = "true";
      document.body.appendChild(field);
      field.focus();
    }, tag);
    await enterCode(page);
    await expect(page.getByRole("dialog", { name: secretName })).not.toBeVisible();
    await page.locator("#typing-test").evaluate((element) => element.remove());
  }
  await page.locator(".portrait").focus();
  await enterCode(page, ["ArrowUp", "Control+ArrowUp", ...code.slice(2)]);
  await expect(page.getByRole("dialog", { name: secretName })).not.toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Watch Image generation", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Image generation", exact: true })).toBeVisible();
  await enterCode(page);
  await expect(page.getByRole("dialog", { name: "Image generation", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog", { name: secretName })).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Image generation", exact: true }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Watch Image generation", exact: true }),
  ).toBeFocused();
  await enterCode(page);
  await expect(page.getByRole("dialog", { name: secretName })).toBeVisible();
});

test("touch controls unlock the secret and narrow screens keep it scrollable", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Uses the touch-device controller.");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.getByRole("button", { name: "Reveal portrait", exact: true }).tap();
  const hint = page.getByRole("dialog", { name: "There’s more behind the pixels." });
  await expect(hint.getByRole("group", { name: "Konami code controls" })).toBeVisible();
  for (const key of ["Up", "Up", "Down", "Down", "Left", "Right", "Left", "Right", "B", "A"]) {
    await hint.getByRole("button", { name: key, exact: true }).tap();
  }
  const dialog = page.getByRole("dialog", { name: secretName });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(640);
  const blog = dialog.getByRole("link", { name: /Viajo Luego Existo/ });
  await blog.scrollIntoViewIfNeeded();
  await expect(blog).toBeInViewport();
  await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeInViewport();
  await expect(dialog.getByRole("button", { name: "Back to the pixels" })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await dialog.getByRole("button", { name: "Close", exact: true }).tap();
  await expect(dialog).not.toBeVisible();
});

test("secret surfaces meet accessibility checks in both themes and respect reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (mode) => document.documentElement.classList.toggle("dark", mode === "dark"),
      theme,
    );
    await page.keyboard.press("Tab");
    await page.locator(".portrait").focus();
    await expect(page.locator(".secret-hint")).toBeVisible();
    const hint = await new AxeBuilder({ page })
      .include(".secret-hint")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(hint.violations).toEqual([]);
    await enterCode(page);
    const dialog = page.getByRole("dialog", { name: secretName });
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate((element) => parseFloat(getComputedStyle(element).animationDuration)),
    ).toBeLessThan(0.01);
    const result = await new AxeBuilder({ page })
      .include(".secret-dialog")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
});
