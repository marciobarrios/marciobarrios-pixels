import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";

// Use the image decoder shipped with Next; no extra runtime dependency is needed.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const { data, info } = await sharp(new URL("../public/media/marcio.jpg", import.meta.url).pathname)
  .removeAlpha()
  .toColourspace("srgb")
  .raw()
  .toBuffer({ resolveWithObject: true });

const grid = 28;
const sample = (x, y, channel) =>
  data[
    (Math.min(info.height - 1, Math.max(0, y)) * info.width +
      Math.min(info.width - 1, Math.max(0, x))) *
      info.channels +
      channel
  ];
const cells = [];

for (let y = 0; y < grid; y++) {
  for (let x = 0; x < grid; x++) {
    // Match the WebGL texture's linear sampling at each cell's center.
    const sx = ((x + 0.5) / grid) * info.width - 0.5;
    const sy = ((y + 0.5) / grid) * info.height - 0.5;
    const ix = Math.floor(sx),
      iy = Math.floor(sy);
    const fx = sx - ix,
      fy = sy - iy;
    const rgb = [0, 1, 2].map(
      (c) =>
        (sample(ix, iy, c) * (1 - fx) + sample(ix + 1, iy, c) * fx) * (1 - fy) +
        (sample(ix, iy + 1, c) * (1 - fx) + sample(ix + 1, iy + 1, c) * fx) * fy,
    );
    const luma = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
    const color = rgb
      .map((c) =>
        Math.round(luma * 0.35 + c * 0.65)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("");
    cells.push(`<path fill="#${color}" d="M${x} ${y}h1v1h-1z"/>`);
  }
}

await writeFile(
  new URL("../public/media/marcio-pixelated.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${grid} ${grid}" shape-rendering="crispEdges">${cells.join("")}</svg>\n`,
);
