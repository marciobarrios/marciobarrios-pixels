"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const phrases = [
  "move pixels",
  "shape ideas",
  "sweat details",
  "make it click",
  "build for humans",
];
const rotationInterval = 3600;
const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(callback: () => void) {
  const query = matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function reducedMotionSnapshot() {
  return matchMedia(motionQuery).matches;
}

function serverMotionSnapshot() {
  return true;
}

export function RotatingTagline() {
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    reducedMotionSnapshot,
    serverMotionSnapshot,
  );
  const moving = !reducedMotion;
  const active = reducedMotion ? 0 : step % phrases.length;
  const previous = step > 0 && moving ? (step - 1) % phrases.length : -1;

  useEffect(() => {
    const tagline = taglineRef.current;
    if (!tagline || !moving) return;

    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (visible && !document.hidden) {
        timer = setInterval(() => setStep((current) => current + 1), rotationInterval);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(tagline);
    document.addEventListener("visibilitychange", sync);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [moving]);

  return (
    <p
      className="tagline mt-2.5 flex w-fit items-center text-[12px] text-primary max-[600px]:mt-2 [&[data-animated=true]_[data-state=active]_.tagline-word]:animate-tagline-in [&[data-animated=true]_[data-state=exiting]_.tagline-word]:animate-tagline-out"
      ref={taglineRef}
      data-animated={step > 0 && moving}
    >
      <span className="sr-only">{phrases.map((phrase) => `I ${phrase}.`).join(" ")}</span>
      <span className="tagline-copy inline-flex leading-[1.5]" aria-hidden="true">
        <span>I&nbsp;</span>
        <span className="tagline-phrases inline-grid overflow-hidden">
          {phrases.map((phrase, index) => (
            <span
              className="tagline-phrase invisible [grid-area:1/1] whitespace-nowrap data-[state=active]:visible data-[state=exiting]:visible"
              key={phrase}
              data-state={index === active ? "active" : index === previous ? "exiting" : "idle"}
            >
              {phrase.split(" ").map((word, wordIndex, words) => (
                <span key={`${wordIndex}-${word}`}>
                  {wordIndex > 0 ? " " : null}
                  <span
                    className="tagline-word inline-block"
                    style={{ animationDelay: `${wordIndex * 35}ms` }}
                  >
                    {word}
                    {wordIndex === words.length - 1 ? (
                      <span className="pixel-period ml-0.5 inline-block font-bold">.</span>
                    ) : null}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>
    </p>
  );
}
