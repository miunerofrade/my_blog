"use client";
import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import MediaLightbox from "@/components/media-lightbox";

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
      <MediaLightbox
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
        label={alt ? `放大图片：${alt}` : "放大图片"}
      >
        <motion.img
          layoutId={layoutId}
          src={src}
          alt={alt}
          className="relative z-10 max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />
      </MediaLightbox>
    </>
  );
}
