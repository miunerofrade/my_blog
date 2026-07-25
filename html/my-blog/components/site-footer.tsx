"use client";

import { Mail } from "lucide-react";
import { GithubIcon, QqIcon } from "./brand-icons";

const contactClass =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-accent";

export default function SiteFooter() {
  const copy = (value: string) => {
    try {
      void navigator.clipboard.writeText(value);
    } catch {}
  };

  return (
    <footer className="relative z-20 flex w-full flex-col items-center justify-center gap-4 border-t border-border py-6 text-center text-xs font-bold uppercase leading-[18px] tracking-widest text-muted">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://github.com/miunerofrade"
          target="_blank"
          rel="noopener noreferrer"
          className={contactClass}
        >
          <GithubIcon className="h-6 w-6" />
          GitHub
        </a>
        <button type="button" title="复制邮箱地址" className={contactClass} onClick={() => copy("miunerofrade@gmail.com")}>
          <Mail aria-hidden="true" size={24} strokeWidth={2} />
          Gmail
        </button>
        <button type="button" title="复制 QQ 号" className={contactClass} onClick={() => copy("2822425981")}>
          <QqIcon className="h-6 w-6" />
          QQ
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p>© 2026 Miunerofrade. All Rights Reserved.</p>
        <p>Built with Next.js. Powered by Miunerofrade.</p>
      </div>
    </footer>
  );
}
