"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="group flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors mb-2 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform" aria-hidden="true">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      返回上一页
    </button>
  );
}