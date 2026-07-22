"use client";
import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageZoomProps {
  src?: string | Blob;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
}

export default function ImageZoom({ src, alt, title, width, height, style }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const layoutId = `zoom-${typeof src === "string" ? src : "image"}`;

  return (
    <>
      <motion.img
        layoutId={layoutId}
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        style={style}
        onClick={() => setIsZoomed(true)}
        className="cursor-zoom-in rounded-xl transition-shadow hover:shadow-md"
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
              layoutId={layoutId}
              src={src}
              alt={alt}
              className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </span>
        )}
      </AnimatePresence>
    </>
  );
}
