"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  children: ReactNode;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={`inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-accent active:bg-surface disabled:pointer-events-none disabled:opacity-50 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});

export default IconButton;
