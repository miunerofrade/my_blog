"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageZoom({ src, alt, title, style, ...props }: any) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <motion.img
        layoutId={`zoom-${src}`}
        src={src}
        alt={alt}
        title={title}
        style={style}
        {...props}
        onClick={() => setIsZoomed(true)}
        className="cursor-zoom-in rounded-md transition-shadow hover:shadow-md"
      />
      <AnimatePresence>
        {isZoomed && (
          <span
            className="fixed inset-0 z-[300] flex items-center justify-center cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 block bg-background/80 backdrop-blur-md"
            />
            <motion.img
              layoutId={`zoom-${src}`}
              src={src}
              alt={alt}
              className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </span>
        )}
      </AnimatePresence>
    </>
  );
}
