"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent } from "react";
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
  const [scale, setScale] = useState(1);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

  const clampScale = (value: number) => Math.min(4, Math.max(1, value));

  const close = useCallback(() => {
    setScale(1);
    pointers.current.clear();
    pinchStart.current = null;
    onClose();
  }, [onClose]);

  const handleWheel = (event: WheelEvent<HTMLSpanElement>) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    setScale((current) => clampScale(current - event.deltaY * 0.01));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (pointers.current.size === 2) {
      const points = [...pointers.current.values()];
      pinchStart.current = {
        distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y),
        scale,
      };
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size !== 2 || !pinchStart.current) return;
    const points = [...pointers.current.values()];
    const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    setScale(clampScale(pinchStart.current.scale * (distance / pinchStart.current.distance)));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <span
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[300] flex cursor-zoom-out items-center justify-center"
          onClick={close}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 block bg-background/80 backdrop-blur-md"
          />
          <span
            className="relative z-10 flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            style={{ transform: `scale(${scale})`, transition: "transform 120ms ease-out" }}
          >
            {children}
          </span>
        </span>
      )}
    </AnimatePresence>
  );
}
