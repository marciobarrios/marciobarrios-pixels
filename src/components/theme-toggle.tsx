"use client";
import { useLayoutEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const THEME_STORAGE_KEY = "mb-theme";

export function ThemeToggle() {
  useLayoutEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark" || (savedTheme !== "light" && query.matches),
        );
      } catch {
        document.documentElement.classList.toggle("dark", query.matches);
      }
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      /* Theme still works if storage is disabled. */
    }
  }
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="theme-toggle size-11 rounded-full text-(--secondary)"
            onClick={toggle}
            aria-label="Toggle color theme"
            data-cuelume-toggle="toggle"
          />
        }
      >
        <Sun className="sun-icon dark:hidden" size={16} />
        <Moon className="moon-icon hidden dark:block" size={16} />
      </TooltipTrigger>
      <TooltipContent>Different light, same pixels.</TooltipContent>
    </Tooltip>
  );
}
