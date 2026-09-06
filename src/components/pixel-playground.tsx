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
    <div
      className="pixel-playground group/pixel-playground mt-[26px] mb-6 flex min-h-[108px] items-center gap-2.5 max-[600px]:gap-1"
      data-moved={moved}
    >
      <div
        className="pixel-toy relative h-[100px] w-[114px] shrink-0 max-[600px]:w-[100px]"
        aria-hidden="true"
      >
        {pixels.map(({ x, y }, i) => (
          <i
            className="absolute size-[5px] bg-primary transition-transform duration-640 ease-[cubic-bezier(0.2,0.8,0.3,1.25)] [transition-delay:var(--delay)] group-data-[moved=true]/pixel-playground:[transform:translate(var(--dx),var(--dy))_rotate(var(--rotation))]"
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
        <label
          className="pixel-label flex min-h-11 w-fit cursor-pointer items-center gap-[9px] text-[11px]"
          htmlFor="move-pixels"
        >
          <Checkbox
            id="move-pixels"
            checked={moved}
            onCheckedChange={(checked) => setMoved(Boolean(checked))}
          />
          <span>Move pixels</span>
        </label>
        <p
          className="min-h-[31px] text-[10px] leading-[1.7] text-muted-foreground"
          aria-live="polite"
        >
          {moved ? "You’re a natural. Uncheck to tidy up." : "Go on. It’s basically my job."}
        </p>
      </div>
    </div>
  );
}
