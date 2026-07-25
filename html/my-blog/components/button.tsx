"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NavButton({
  label,
  href = "#",
  isPrimary = false
}: {
  label: string;
  href?: string;
  isPrimary?: boolean;
}) {
  const isExternal = href.startsWith("http");

  const className = `
    group
    cursor-pointer
    inline-flex items-center justify-center shrink-0 whitespace-nowrap
    h-12 w-auto min-w-[240px]
    rounded-xl border-2 px-12
    text-base md:text-lg leading-6 md:leading-7 tracking-widest uppercase font-black
    transition-all duration-300 ease-out
    ${isPrimary
      ? "border-accent bg-accent text-accent-foreground shadow-sm hover:shadow-md"
      : "border-border bg-transparent text-foreground hover:border-accent hover:bg-surface-hover hover:text-accent"
    }
  `;

  const content = (
    <div className="flex items-center justify-center gap-0 group-hover:gap-4 transition-all duration-300 ease-out">
      <span>{label}</span>
      <span className="
        inline-block max-w-0 opacity-0 -translate-x-2
        group-hover:max-w-[24px] group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-300 ease-out
      " aria-hidden="true">
        <ArrowRight size={24} strokeWidth={2} />
      </span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
