"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="group mb-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-medium leading-[22px] text-muted transition-colors hover:bg-surface-hover hover:text-accent"
    >
      <ArrowLeft aria-hidden="true" size={24} strokeWidth={2} className="transition-transform group-hover:-translate-x-1" />
      返回上一页
    </button>
  );
}
