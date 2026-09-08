import { test, expect } from "@playwright/test";

test.use({ video: "on" });

type EntranceFrame = {
  opacity: number;
  filter: string;
  transform: string;
  x: number;
  y: number;
  width: number;
  height: number;
}[];

declare global {
  interface Window {
    entranceFrames: EntranceFrame[];
    entranceFinished: boolean;
  }
}

test.describe("cold text entrance", () => {
  test("text stays sharp and stationary through load and reload", async ({ page }, testInfo) => {
    // Routing disables the HTTP cache in both Chromium and WebKit.
    await page.route("**/*", (route) => route.continue());
    await page.addInitScript(() => {
      window.entranceFrames = [];
      window.entranceFinished = false;
      let firstFrame: number | undefined;
      function sample(now: number) {
        const elements = [...document.querySelectorAll(".reveal")];
        if (elements.length === 4) {
          firstFrame ??= now;
          window.entranceFrames.push(
            elements.map((el) => {
              const style = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return {
                opacity: Number(style.opacity),
                filter: style.filter,
                transform: style.transform,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
              };
            }),
          );
          if (now - firstFrame > 900) {
            window.entranceFinished = true;
            return;
          }
        }
        requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });

    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      if (theme === "light") await page.goto("/");
      else await page.reload();
      await expect.poll(() => page.evaluate(() => window.entranceFinished)).toBe(true);
      const frames = await page.evaluate(() => window.entranceFrames);
      await testInfo.attach(`${theme}-entrance-frames`, {
        body: JSON.stringify(frames),
        contentType: "application/json",
      });
      expect(frames.length).toBeGreaterThan(2);
      expect(frames.some((frame) => frame.some((el) => el.opacity > 0 && el.opacity < 1))).toBe(
        true,
      );
      for (let group = 0; group < 4; group++) {
        const settled = frames.at(-1)![group];
        expect(settled.opacity).toBe(1);
        let previousOpacity = 0;
        for (const frame of frames) {
          const el = frame[group];
          expect(el.filter).toBe("none");
          expect(el.transform).toBe("none");
          expect(el.opacity).toBeGreaterThanOrEqual(previousOpacity - 0.001);
          previousOpacity = el.opacity;
          for (const dimension of ["x", "y", "width", "height"] as const) {
            expect(Math.abs(el[dimension] - settled[dimension])).toBeLessThan(1);
          }
        }
      }
      expect(
        await page
          .locator(".reveal")
          .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
      ).toBe(0);
    }
  });
});

test("portrait stays pixelated while its texture loads and after readiness", async ({ page }) => {
  let release!: () => void;
  const texture = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested = false;
  await page.route("**/media/marcio.jpg", async (route) => {
    requested = true;
    await texture;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect.poll(() => requested).toBe(true);
    const poster = page.locator(".portrait img");
    const canvas = page.locator(".portrait canvas");
    await expect(poster).toHaveAttribute("src", "/media/marcio-pixelated.svg");
    await expect
      .poll(() => poster.evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    await expect(canvas).toHaveCSS("opacity", "0");
    release();
    await expect(canvas).toHaveAttribute("data-ready", "true");
    await expect(canvas).toHaveCSS("opacity", "0");
    await expect(poster).toBeVisible();
  } finally {
    release();
  }
});

test("portrait remembers a keyboard reveal requested before the texture is ready", async ({
  page,
}) => {
  let release!: () => void;
  const texture = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested = false;
  await page.route("**/media/marcio.jpg", async (route) => {
    requested = true;
    await texture;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect.poll(() => requested).toBe(true);
    const portrait = page.locator(".portrait");
    await portrait.focus();
    await expect(portrait).toBeFocused();
    await expect(portrait).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".portrait-hint")).toHaveCSS("opacity", "1");
    await page.keyboard.press("Enter");
    release();
    await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "1");
    await page.keyboard.press("Tab");
    await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "0");
    await portrait.focus();
    await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "1");
    await expect(page.locator(".portrait-hint")).toHaveCSS("opacity", "0");
    await page.keyboard.press("Space");
    await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "0");
  } finally {
    release();
  }
});

test("portrait unlocks hover reveals only after its first click", async ({ page, isMobile }) => {
  test.skip(isMobile, "Fine-pointer hover is a desktop interaction.");
  await page.goto("/");
  const portrait = page.locator(".portrait");
  const canvas = portrait.locator("canvas");
  const hint = page.locator(".portrait-hint");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await expect(hint).toHaveCSS("opacity", "0");
  const box = await portrait.boundingBox();

  // A different user gesture can enable audio, but it must not unlock the portrait.
  await page.getByText("Barcelona, ES").click();
  await portrait.hover();
  await expect(hint).toHaveCSS("opacity", "1");
  await expect(portrait.locator(".portrait-visual")).toHaveCSS("rotate", /^(none|0deg)$/);
  await expect(canvas).toHaveCSS("opacity", "0");
  await expect(portrait).toHaveAttribute("aria-pressed", "false");
  expect(await portrait.boundingBox()).toEqual(box);

  await portrait.click();
  await expect(canvas).toHaveCSS("opacity", "1");
  await expect(hint).toHaveCSS("opacity", "0");
  await expect(portrait).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(0, 0);
  await expect(canvas).toHaveCSS("opacity", "0");
  await portrait.hover();
  await expect(canvas).toHaveCSS("opacity", "1");
  await expect(hint).toHaveCSS("opacity", "0");
  expect(await portrait.boundingBox()).toEqual(box);

  await page.mouse.move(0, 0);
  await page.reload();
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await portrait.hover();
  await expect(hint).toHaveCSS("opacity", "1");
  await expect(canvas).toHaveCSS("opacity", "0");
});

test("touch portrait shows a one-time hint and stays revealed after a tap", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Touch interaction uses the mobile browser.");
  await page.goto("/");
  const portrait = page.locator(".portrait");
  const canvas = portrait.locator("canvas");
  const hint = portrait.locator(".portrait-hint");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await expect(hint).toHaveCSS("opacity", "1");
  await expect(portrait.locator(".portrait-hint-tap")).toBeVisible();
  await expect(portrait.locator(".portrait-hint-click")).toBeHidden();
  const box = await portrait.boundingBox();
  await portrait.tap();
  await expect(canvas).toHaveCSS("opacity", "1");
  await expect(hint).toHaveCSS("opacity", "0");
  await expect(portrait).toHaveAttribute("aria-pressed", "true");
  expect(await portrait.boundingBox()).toEqual(box);
  await portrait.tap();
  await expect(canvas).toHaveCSS("opacity", "0");
  await expect(hint).toHaveCSS("opacity", "0");
  await portrait.tap();
  await expect(canvas).toHaveCSS("opacity", "1");
});

test("portrait hover keeps every edge of the hit target stationary", async ({ page, isMobile }) => {
  test.skip(isMobile, "Fine-pointer hover is a desktop interaction.");
  await page.goto("/");
  const portrait = page.locator(".portrait");
  const visual = page.locator(".portrait-visual");
  const box = (await portrait.boundingBox())!;
  await expect(visual).toHaveCSS("pointer-events", "none");
  for (const [x, y] of [
    [1, 1],
    [box.width - 1, 1],
    [1, box.height - 1],
    [box.width - 1, box.height - 1],
  ]) {
    await page.mouse.move(box.x + x, box.y + y);
    await expect(visual).toHaveCSS("rotate", /^(none|0deg)$/);
    expect(await portrait.boundingBox()).toEqual(box);
    expect(await portrait.evaluate((el) => el.matches(":hover"))).toBe(true);
    await page.mouse.move(0, 0);
  }
  await expect(visual).toHaveCSS("rotate", "-3deg");
  expect(await portrait.boundingBox()).toEqual(box);
});

test("reduced motion keeps text visible and portrait geometry stationary", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const reveal of await page.locator(".reveal").all()) {
    await expect(reveal).toHaveCSS("opacity", "1");
    await expect(reveal).toHaveCSS("animation-name", "none");
    await expect(reveal).toHaveCSS("filter", "none");
  }
  const visual = page.locator(".portrait-visual");
  const box = await visual.boundingBox();
  if (!isMobile) await page.locator(".portrait").hover();
  await expect(visual).toHaveCSS("rotate", "-3deg");
  expect(await visual.boundingBox()).toEqual(box);
  await page.locator(".portrait").click();
  await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "1");
  await page.locator(".portrait").click();
  await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "0");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the initial pixel portrait and text remain visible", async ({ page }) => {
    await page.goto("/");
    const poster = page.locator(".portrait img");
    await expect(poster).toHaveAttribute("src", "/media/marcio-pixelated.svg");
    await expect(poster).toBeVisible();
    await expect
      .poll(() => poster.evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    await expect(page.locator(".intro-copy")).toHaveCSS("opacity", "1");
    await expect(page.locator(".portrait canvas")).toHaveCSS("opacity", "0");
  });
});
