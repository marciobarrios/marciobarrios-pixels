import { test, expect, type Page } from "@playwright/test";

type HintTransition = {
  phase: "enter" | "exit";
  property: string;
  duration: number;
  transforms: string[];
};

declare global {
  interface Window {
    hintTransitions: HintTransition[];
    portraitPointerEvents: string[];
  }
}

async function observeMotion(page: Page) {
  await page.goto("/");
  // Let the page entrance settle before measuring the portrait's own hit area.
  await page.locator(".identity").evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  await page.evaluate(() => {
    window.hintTransitions = [];
    window.portraitPointerEvents = [];
    const portrait = document.querySelector(".portrait")!;
    for (const type of ["pointerenter", "pointerleave"]) {
      portrait.addEventListener(type, () => window.portraitPointerEvents.push(type));
    }
    document.addEventListener("transitionrun", (event) => {
      if (!(event.target instanceof HTMLElement) || !event.target.matches(".secret-hint")) {
        return;
      }
      const transition = event.target
        .getAnimations()
        .find(
          (animation) =>
            animation instanceof CSSTransition &&
            animation.transitionProperty === event.propertyName,
        );
      window.hintTransitions.push({
        phase: event.target.hasAttribute("data-ending-style") ? "exit" : "enter",
        property: event.propertyName,
        duration: Number(transition?.effect?.getTiming().duration),
        transforms:
          (transition?.effect as KeyframeEffect | null)
            ?.getKeyframes()
            .map((frame) => String(frame.transform ?? "none")) ?? [],
      });
    });
  });
}

test("hovering the portrait edge stays stable, including when the hint flips sides", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Requires a hover-capable pointer.");
  await page.setViewportSize({ width: 1280, height: 320 });
  await observeMotion(page);
  const portrait = page.locator(".portrait");
  const before = (await portrait.boundingBox())!;
  await portrait.hover({ position: { x: before.width / 2, y: before.height - 1 } });
  const hint = page.locator(".secret-hint");
  await expect(hint).toHaveAttribute("data-side", "right");
  // Observe a stationary cursor longer than a complete hover/open/close cycle.
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.portraitPointerEvents)).toEqual(["pointerenter"]);
  expect(await portrait.boundingBox()).toEqual(before);
  await expect(hint).toBeVisible();

  const entrance = await page.evaluate(() => window.hintTransitions);
  expect(entrance.map((event) => event.property).sort()).toEqual(["opacity", "transform"]);
  for (const event of entrance) expect(event.duration).toBe(180);
  for (const transform of entrance.find((event) => event.property === "transform")!.transforms) {
    const translation = await page.evaluate((value) => {
      const matrix = new DOMMatrix(value);
      return [matrix.m41, matrix.m42];
    }, transform);
    expect(translation).toEqual([0, 0]);
  }

  await page.mouse.move(4, 4);
  await expect(hint).not.toBeAttached();
  const exit = await page.evaluate(() => window.hintTransitions.filter((e) => e.phase === "exit"));
  expect(exit.map((event) => event.property).sort()).toEqual(["opacity", "transform"]);
  for (const event of exit) expect(event.duration).toBe(125);
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`keyboard disclosure and dismissal stay instant with ${reducedMotion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await observeMotion(page);
    const hint = page.locator(".secret-hint");
    await page.keyboard.press("Tab");
    await page.locator(".portrait").focus();
    await hint.waitFor({ state: "attached" });
    expect(await hint.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    await page.keyboard.press("Escape");
    await expect(hint).not.toBeAttached();
    await page.keyboard.press("Enter");
    await hint.waitFor({ state: "attached" });
    expect(await hint.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    await page.keyboard.press("Space");
    await expect(hint).not.toBeAttached();
    expect(await page.evaluate(() => window.hintTransitions)).toEqual([]);
  });
}

test("reduced-motion pointer disclosure fades without moving the hint or portrait", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await observeMotion(page);
  const portrait = page.locator(".portrait");
  const image = page.locator(".portrait-image");
  const restingTransform = await image.evaluate((element) => getComputedStyle(element).transform);
  if (isMobile) await portrait.tap();
  else await portrait.hover();
  const hint = page.locator(".secret-hint");
  await expect.poll(() => page.evaluate(() => window.hintTransitions.length)).toBe(1);
  expect(await hint.evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  expect(await image.evaluate((element) => getComputedStyle(element).transform)).toBe(
    restingTransform,
  );
  await hint.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  if (isMobile) await page.touchscreen.tap(4, 4);
  else await page.mouse.move(4, 4);
  await expect(hint).not.toBeAttached();
  expect(
    await page.evaluate(() =>
      window.hintTransitions.map(({ phase, property, duration }) => ({
        phase,
        property,
        duration,
      })),
    ),
  ).toEqual([
    { phase: "enter", property: "opacity", duration: 180 },
    { phase: "exit", property: "opacity", duration: 125 },
  ]);
});
