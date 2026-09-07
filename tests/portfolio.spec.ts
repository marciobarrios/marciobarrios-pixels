import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("content, media, and metadata load without runtime errors", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle("Marcio Barrios ⋅ Design Engineer");
  await expect(page.locator(".project-row")).toHaveCount(7);
  await expect(page.locator(".current-work")).not.toHaveAttribute("open");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const source of await page
    .locator(".clip-trigger video")
    .evaluateAll((videos) => videos.map((v) => v.getAttribute("src")!))) {
    const response = await request.get(source);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("video/mp4");
  }
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  expect(errors).toEqual([]);
});

test("motion transitions cover every property their states change", async ({ page }) => {
  await page.goto("/");

  const transitions = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing motion target: ${selector}`);
      const style = getComputedStyle(element);
      return {
        property: style.transitionProperty,
        duration: style.transitionDuration,
        timing: style.transitionTimingFunction,
      };
    };

    return {
      favicon: read(".inline-link .favicon"),
      inlineUnderline: read(".inline-link > span:not(.favicon):not(.sr-only)"),
      externalArrow: read(".external-arrow"),
      portrait: read(".portrait-visual"),
      workChevron: read(".work-chevron"),
      workDetail: read(".work-detail"),
      clipVideo: read(".clip-trigger video"),
      clipExpand: read(".clip-expand"),
      projectRow: read(".project-row"),
      projectCategory: read(".project-category"),
      projectArrow: read(".project-arrow"),
      pixel: read(".pixel-toy i"),
    };
  });

  expect(transitions.favicon).toEqual({
    property: "translate, rotate, scale, filter",
    duration: "0.22s, 0.22s, 0.22s, 0.18s",
    timing:
      "cubic-bezier(0.2, 0.8, 0.2, 1), cubic-bezier(0.2, 0.8, 0.2, 1), cubic-bezier(0.2, 0.8, 0.2, 1), ease",
  });
  expect(transitions.inlineUnderline).toEqual({
    property: "text-decoration-color",
    duration: "0.16s",
    timing: "ease",
  });
  expect(transitions.externalArrow).toEqual({
    property: "translate, opacity",
    duration: "0.18s",
    timing: "ease",
  });
  expect(transitions.portrait.property).toBe("transform, translate, scale, rotate");
  expect(transitions.portrait.duration).toBe("0.15s");
  expect(transitions.workChevron.property).toBe("transform, translate, scale, rotate");
  expect(transitions.workChevron.duration).toBe("0.2s");
  expect(transitions.workDetail).toEqual({
    property: "grid-template-rows, opacity, visibility",
    duration: "0.22s",
    timing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });
  expect(transitions.clipVideo.property).toBe("transform, translate, scale, rotate");
  expect(transitions.clipVideo.duration).toBe("0.35s");
  for (const transition of [
    transitions.clipExpand,
    transitions.projectCategory,
    transitions.projectArrow,
  ]) {
    expect(transition).toEqual({
      property: "translate, opacity",
      duration: "0.18s",
      timing: "ease",
    });
  }
  expect(transitions.projectRow).toEqual({
    property: "background-color",
    duration: "0.18s",
    timing: "ease",
  });
  expect(transitions.pixel.property).toBe("transform");
  expect(transitions.pixel.duration).toBe("0.64s");
  expect(transitions.pixel.timing).toBe("cubic-bezier(0.2, 0.8, 0.3, 1.25)");
});

test("theme persists and both themes meet accessibility checks", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page
    .locator(".reveal")
    .evaluateAll((elements) =>
      Promise.all(
        elements.flatMap((element) =>
          element.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
  const light = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(light.violations).toEqual([]);
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page
    .locator(".reveal")
    .evaluateAll((elements) =>
      Promise.all(
        elements.flatMap((element) =>
          element.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
  const dark = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(dark.violations).toEqual([]);
});

test("theme follows the system until the visitor chooses one", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mb-theme"))).toBe("dark");

  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("clip viewers play, close, and return focus", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Image generation", "Stacked updates", "Canvas toolbar"]) {
    const trigger = page.getByRole("button", { name: `Watch ${name}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect
      .poll(() => dialog.locator("video").evaluate((v) => (v as HTMLVideoElement).readyState))
      .toBeGreaterThanOrEqual(2);
    await expect
      .poll(() => dialog.locator("video").evaluate((v) => (v as HTMLVideoElement).currentTime))
      .toBeGreaterThan(0);
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.getByRole("button", { name: "Watch Canvas toolbar", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("keyboard controls expand work and move pixels without shifting the page", async ({
  page,
}) => {
  await page.goto("/");
  const summary = page.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".current-work")).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(page.locator(".current-work")).not.toHaveAttribute("open");
  const checkbox = page.getByRole("checkbox", { name: "Move pixels" });
  await expect(checkbox).toBeVisible();
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.focus();
  const position = await page.evaluate(() => scrollY);
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await expect(page.getByText("You’re a natural. Uncheck to tidy up.")).toBeVisible();
  expect(Math.abs((await page.evaluate(() => scrollY)) - position)).toBeLessThan(2);
  await page.keyboard.press("Space");
  await expect(checkbox).not.toBeChecked();
});

test("work disclosure respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const workDetail = page.locator(".work-detail");
  await expect(workDetail).toHaveCSS("transition-property", "none");
  await page.locator("summary").click();
  await expect(workDetail).toBeVisible();
  await expect(page.locator(".current-work")).toHaveAttribute("open", "");
});

test("reduced motion pauses clips and portrait supports taps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".craft-section").scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Play previews" })).toBeVisible();
  expect(
    await page
      .locator(".clip-trigger video")
      .evaluateAll((videos) => videos.every((video) => (video as HTMLVideoElement).paused)),
  ).toBe(true);
  await page.getByRole("button", { name: "Watch Image generation" }).click();
  expect(
    await page.locator(".expanded-video").evaluate((v) => (v as HTMLVideoElement).paused),
  ).toBe(true);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Reveal portrait", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pixelate portrait", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pixelate portrait", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reveal portrait", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("narrow screens and unavailable WebGL keep content usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await expect(page.locator(".portrait img")).toBeVisible();
  expect(
    await page.locator(".portrait img").evaluate((img) => (img as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Back to top", exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});
