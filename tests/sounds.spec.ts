import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    cuelumeSourceStarts: number;
  }
}

test("Cuelume sounds cover the portfolio interactions", async ({ page, isMobile }) => {
  test.skip(isMobile, "Hover sound coverage requires a fine pointer.");

  await page.addInitScript(() => {
    window.cuelumeSourceStarts = 0;

    function trackStarts<T extends { start: (...args: number[]) => void }>(prototype: T) {
      const originalStart = prototype.start;
      prototype.start = function (...args: number[]) {
        window.cuelumeSourceStarts += 1;
        return originalStart.apply(this, args);
      };
    }

    trackStarts(OscillatorNode.prototype);
    trackStarts(AudioBufferSourceNode.prototype);
  });

  await page.goto("/");
  await page.getByText("Barcelona, ES").click();

  async function expectSound(action: () => Promise<unknown>) {
    const starts = await page.evaluate(() => window.cuelumeSourceStarts);
    await action();
    await expect
      .poll(() => page.evaluate(() => window.cuelumeSourceStarts))
      .toBeGreaterThan(starts);
  }

  const portrait = page.getByRole("button", { name: "Reveal portrait", exact: true });
  await expectSound(() => portrait.hover());
  await expectSound(() => page.mouse.move(0, 0));

  const inlineLink = page.locator(".inline-link").first();
  await expect(inlineLink).toHaveAttribute("data-cuelume-hover", "tick");
  await page.waitForTimeout(160);
  await expectSound(() => inlineLink.hover());

  const work = page.locator(".current-work");
  await expectSound(() => work.locator("summary").click());
  await expect(work).toHaveAttribute("open", "");
  await expectSound(() => work.locator("summary").click());
  await expect(work).not.toHaveAttribute("open");

  const motionToggle = page.getByRole("button", { name: "Pause previews" });
  await expect(motionToggle).toHaveAttribute("data-cuelume-toggle", "toggle");
  await expectSound(() => motionToggle.click());
  await expectSound(() => page.getByRole("button", { name: "Play previews" }).click());

  const clipTrigger = page.getByRole("button", { name: "Watch Image generation", exact: true });
  await expectSound(() => clipTrigger.click());
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expectSound(() => dialog.getByRole("button", { name: "Close", exact: true }).click());

  const sideProject = page.locator(".project-row").first();
  await expect(sideProject).toHaveAttribute("data-cuelume-hover", "sparkle");
  await page.waitForTimeout(160);
  await expectSound(() => sideProject.hover());

  const checkbox = page.getByRole("checkbox", { name: "Move pixels" });
  await expectSound(() => checkbox.click());
  await expect(checkbox).toBeChecked();

  const backToTop = page.getByRole("link", { name: "Back to top", exact: true });
  await expect(backToTop).not.toHaveAttribute("data-cuelume-hover");
  await expect(backToTop).toHaveAttribute("data-cuelume-toggle", "page");
  await expectSound(() => backToTop.click());

  const themeToggle = page.getByRole("button", { name: "Toggle color theme" });
  await expect(themeToggle).toHaveAttribute("data-cuelume-toggle", "toggle");
  await expectSound(() => themeToggle.click());
});
