"use client";
import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      try {
        if (!localStorage.getItem("mb-theme"))
          document.documentElement.classList.toggle("dark", query.matches);
      } catch {
        document.documentElement.classList.toggle("dark", query.matches);
      }
    };
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("mb-theme", dark ? "dark" : "light");
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
            className="theme-toggle"
            onClick={toggle}
            aria-label="Toggle color theme"
          />
        }
      >
        <Sun className="sun-icon" size={16} />
        <Moon className="moon-icon" size={16} />
      </TooltipTrigger>
      <TooltipContent>Different light, same pixels.</TooltipContent>
    </Tooltip>
  );
}
