"use client";
import { useState, type CSSProperties } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const cursor = [
  "10000000",
  "11000000",
  "10100000",
  "10010000",
  "10001000",
  "10000100",
  "10000010",
  "10011111",
  "10101000",
  "11001000",
  "00000100",
];
const pixels = cursor.flatMap((row, y) =>
  [...row].flatMap((value, x) => (value === "1" ? [{ x, y }] : [])),
);

export function PixelPlayground() {
  const [moved, setMoved] = useState(false);
  return (
    <div className="pixel-playground" data-moved={moved}>
      <div className="pixel-toy" aria-hidden="true">
        {pixels.map(({ x, y }, i) => (
          <i
            key={`${x}-${y}`}
            style={
              {
                left: `${x * 6 + 30}px`,
                top: `${y * 6 + 16}px`,
                "--dx": `${((i * 37) % 91) - 45}px`,
                "--dy": `${((i * 23) % 67) - 33}px`,
                "--rotation": `${((i * 71) % 180) - 90}deg`,
                "--delay": `${i * 6}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="pixel-controls">
        <label className="pixel-label" htmlFor="move-pixels">
          <Checkbox
            id="move-pixels"
            checked={moved}
            onCheckedChange={(checked) => setMoved(Boolean(checked))}
          />
          <span>Move pixels</span>
        </label>
        <p aria-live="polite">
          {moved ? "You’re a natural. Uncheck to tidy up." : "Go on. It’s basically my job."}
        </p>
      </div>
    </div>
  );
}
