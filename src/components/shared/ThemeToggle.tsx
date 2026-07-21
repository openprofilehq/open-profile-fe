"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-bg-override");
    const isDarkTheme = savedTheme === "dark";
    setTimeout(() => {
      setIsDark(isDarkTheme);
      setMounted(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      localStorage.setItem("theme-bg-override", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme-bg-override", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-[10px] border border-transparent bg-slate-100 dark:bg-neutral-800" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="border-primary-foreground-b text-primary-text hover:bg-hover-bg relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border bg-white transition-all hover:shadow-sm active:scale-95 dark:border-white/10 dark:bg-transparent dark:text-white"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 90 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute flex items-center justify-center"
      >
        <Sun className="h-[18px] w-[18px]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -90, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute flex items-center justify-center"
      >
        <Moon className="h-[18px] w-[18px]" />
      </motion.div>
    </button>
  );
}
