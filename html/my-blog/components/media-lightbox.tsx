"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MediaLightbox({
  isOpen,
  onClose,
  children,
  label,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <span
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[300] flex cursor-zoom-out items-center justify-center"
          onClick={onClose}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 block bg-background/80 backdrop-blur-md"
          />
          {children}
        </span>
      )}
    </AnimatePresence>
  );
}
