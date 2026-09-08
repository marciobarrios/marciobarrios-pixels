"use client";

import { bind, play, setVolume } from "cuelume";
import { useEffect, type ComponentProps } from "react";

const UI_SOUND_VOLUME = 0.35;

export function SoundEffects() {
  useEffect(() => {
    setVolume(UI_SOUND_VOLUME);
    bind();
  }, []);

  return null;
}

export function SoundDetails({ onToggle, ...props }: ComponentProps<"details">) {
  return (
    <details
      {...props}
      onToggle={(event) => {
        onToggle?.(event);
        play(event.currentTarget.open ? "bloom" : "droplet");
      }}
    />
  );
}
