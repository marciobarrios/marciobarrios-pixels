"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Popover } from "@base-ui/react/popover";
import { Backpack, Camera, Dumbbell, Gamepad2, Globe2, Heart, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const konamiCode = [
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
const keyLabels = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"];
const controls = [
  { key: "ArrowUp", label: "Up", symbol: "↑" },
  { key: "ArrowLeft", label: "Left", symbol: "←" },
  { key: "ArrowDown", label: "Down", symbol: "↓" },
  { key: "ArrowRight", label: "Right", symbol: "→" },
  { key: "b", label: "B", symbol: "B" },
  { key: "a", label: "A", symbol: "A" },
];

function PersonalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

// The six personal details below are from the section after
// “Still here? Do you want to know more about me?” on https://marciobarrios.com/.
const personalDetails = [
  {
    title: "Roots",
    icon: Globe2,
    content: (
      <>
        I am half Spanish, half{" "}
        <PersonalLink href="http://madeinhonduras.net/">Honduran</PersonalLink>.
      </>
    ),
  },
  { title: "Home", icon: Sun, content: <>I live in sunny Barcelona.</> },
  {
    title: "Good company",
    icon: Heart,
    content: (
      <>
        I love to spend time with{" "}
        <PersonalLink href="https://www.instagram.com/p/BuYCIw1lBwi/">family</PersonalLink> and{" "}
        <PersonalLink href="https://www.instagram.com/p/BsVtyjWFkzo/">friends</PersonalLink>.
      </>
    ),
  },
  {
    title: "Going places",
    icon: Backpack,
    content: (
      <>
        I{" "}
        <PersonalLink href="https://www.instagram.com/viajoluegoexisto.co/">
          travel a lot
        </PersonalLink>{" "}
        as a backpacker (my biggest passion by far), I even took a year off to travel around Asia
        and Latin America.
      </>
    ),
  },
  {
    title: "Keeping moving",
    icon: Dumbbell,
    content: (
      <>
        I <PersonalLink href="https://www.instagram.com/p/B03ucijBkEO/">practice</PersonalLink>{" "}
        <PersonalLink href="https://www.instagram.com/p/BphlEfBldLr/">different</PersonalLink>{" "}
        <PersonalLink href="https://www.instagram.com/p/BtZJeRnFIvJ/">sports</PersonalLink> (I like
        to work out too, but that’s not a sport, is it?)
      </>
    ),
  },
  {
    title: "Through my lens",
    icon: Camera,
    content: (
      <>
        I like photography and writing, and the result of both is{" "}
        <PersonalLink href="https://www.viajoluegoexisto.co/blog">Viajo Luego Existo</PersonalLink>,
        a travel blog.
      </>
    ),
  },
];

export function PortraitSecret({ children }: { children: ReactElement }) {
  const triggerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const restoringFocusRef = useRef(false);
  const sequenceRef = useRef<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintInstant, setHintInstant] = useState(false);
  const [open, setOpen] = useState(false);

  function resetCode() {
    sequenceRef.current = [];
    setProgress(0);
  }

  function enterKey(key: string) {
    // Keep the longest matching prefix so an extra Up does not swallow a new attempt.
    const sequence = [...sequenceRef.current, key].slice(-konamiCode.length);
    let matched = sequence.length;
    while (
      matched > 0 &&
      !sequence.slice(-matched).every((value, index) => value === konamiCode[index])
    ) {
      matched--;
    }
    sequenceRef.current = matched ? sequence.slice(-matched) : [];
    setProgress(matched);

    if (matched === konamiCode.length) {
      const active = document.activeElement;
      returnFocusRef.current =
        active instanceof HTMLElement &&
        active !== document.body &&
        !popupRef.current?.contains(active)
          ? active
          : triggerRef.current;
      setHintOpen(false);
      setOpen(true);
      resetCode();
    }
    return matched > 0;
  }

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target;
    if (
      open ||
      document.querySelector('[data-slot="dialog-content"][data-open]') ||
      event.defaultPrevented ||
      event.isComposing ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      (target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest(
            "input, textarea, select, [role='textbox'], [role='slider'], [role='combobox'], video",
          ) ||
          (target.closest("[role='dialog'], [role='alertdialog']") &&
            !popupRef.current?.contains(target))))
    ) {
      resetCode();
      return;
    }
    // Holding a key should neither advance the sequence nor scroll during an attempt.
    if (event.repeat) {
      if (sequenceRef.current.length > 0 && event.key.startsWith("Arrow")) event.preventDefault();
      return;
    }
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (hintOpen) setHintInstant(true);
    if (enterKey(key) && key.startsWith("Arrow")) event.preventDefault();
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", resetCode);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", resetCode);
    };
  }, []);

  return (
    <>
      <Popover.Root
        open={hintOpen && !open}
        triggerId={triggerId}
        onOpenChange={(nextOpen, details) => {
          // Focus changes and keyboard-generated clicks should disclose the hint immediately.
          setHintInstant(
            details.event instanceof KeyboardEvent ||
              details.reason === "trigger-focus" ||
              details.reason === "focus-out" ||
              (details.event instanceof MouseEvent &&
                details.event.type === "click" &&
                details.event.detail === 0),
          );
          setHintOpen(nextOpen);
        }}
      >
        <Popover.Trigger
          id={triggerId}
          ref={triggerRef}
          render={children}
          openOnHover
          delay={250}
          closeDelay={150}
          onFocus={(event) => {
            if (restoringFocusRef.current) {
              restoringFocusRef.current = false;
              return;
            }
            if (!open && event.currentTarget.matches(":focus-visible")) {
              setHintInstant(true);
              setHintOpen(true);
            }
          }}
        />
        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="start"
            sideOffset={14}
            collisionPadding={16}
            className="secret-hint-positioner"
          >
            <Popover.Popup
              ref={popupRef}
              className="secret-hint"
              data-keyboard={hintInstant ? "" : undefined}
              initialFocus={false}
              finalFocus={false}
            >
              <div className="secret-eyebrow">
                <Gamepad2 size={15} aria-hidden="true" /> A little secret
              </div>
              <Popover.Title className="secret-hint-title">
                There’s more behind the pixels.
              </Popover.Title>
              <Popover.Description className="secret-hint-copy">
                Enter the Konami code to unlock a little more about me.
                <span className="sr-only">
                  {" "}
                  Up, Up, Down, Down, Left, Right, Left, Right, B, A.
                </span>
              </Popover.Description>
              <div className="secret-code" aria-hidden="true">
                {keyLabels.map((label, index) => (
                  <kbd key={index} data-entered={index < progress}>
                    {label}
                  </kbd>
                ))}
              </div>
              <p className="secret-keyboard-note">Use your keyboard. Curiosity rewarded.</p>
              <div className="secret-touch-controls">
                <p>Tap the controls in the order above.</p>
                <fieldset className="secret-gamepad" aria-label="Konami code controls">
                  {controls.map(({ key, label, symbol }) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="secret-gamepad-key"
                      data-key={key}
                      aria-label={label}
                      onClick={() => enterKey(key)}
                    >
                      {symbol}
                    </Button>
                  ))}
                </fieldset>
                <output className="sr-only">{progress} of 10 keys entered.</output>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="secret-dialog"
          initialFocus={titleRef}
          finalFocus={() => {
            restoringFocusRef.current = returnFocusRef.current === triggerRef.current;
            return returnFocusRef.current;
          }}
        >
          <div className="secret-dialog-header">
            <div className="secret-eyebrow">
              <Gamepad2 size={16} aria-hidden="true" /> Easter egg unlocked
            </div>
            <DialogTitle ref={titleRef} tabIndex={-1} className="secret-dialog-title">
              Beyond the pixels.
            </DialogTitle>
            <DialogDescription className="secret-dialog-description">
              A few things about the person behind the screen.
            </DialogDescription>
          </div>
          <ul className="secret-details">
            {personalDetails.map(({ title, icon: Icon, content }) => (
              <li key={title}>
                <span className="secret-detail-icon">
                  <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{content}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="secret-dialog-footer">
            <span>Thanks for being curious.</span>
            <DialogClose render={<Button variant="outline" />}>Back to the pixels</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
