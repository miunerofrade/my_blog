"use client";

import { useTheme } from "@teispace/next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import IconButton from "./icon-button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) return <div className="h-11 w-11" aria-hidden="true" />;

  const isDark = theme === "dark";

  return (
    <IconButton
      onClick={() => setTheme(isDark ? "light" : "dark")}
      label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      aria-pressed={isDark}
      className="z-50"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 8, opacity: 0, rotate: 45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -8, opacity: 0, rotate: -45 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex"
        >
          {isDark ? (
            <Sun aria-hidden="true" size={24} strokeWidth={2} />
          ) : (
            <Moon aria-hidden="true" size={24} strokeWidth={2} />
          )}
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
}
