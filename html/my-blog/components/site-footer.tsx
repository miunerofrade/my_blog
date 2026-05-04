"use client";

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
  </svg>
);

const GmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.91 12 9.548l6.545-4.637 1.528-1.418C21.691 2.28 24 3.434 24 5.457z" />
  </svg>
);

const QQIcon = () => (
  <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor">
    <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" />
  </svg>
);

export default function SiteFooter() {
  return (
    <footer className="relative z-20 w-full flex flex-col items-center justify-center border-t border-foreground/12 text-xs font-bold tracking-widest uppercase text-foreground/60 text-center"
      style={{ gap: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div className="flex items-center" style={{ gap: '1.5rem' }}>
        <a href="https://github.com/miunerofrade" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-terracotta transition-colors duration-200">
          <span aria-hidden="true"><GitHubIcon /></span>
          GitHub
        </a>
        <span title="复制邮箱地址" tabIndex={0} role="button" className="inline-flex items-center gap-1.5 cursor-pointer hover:text-terracotta transition-colors duration-200" onClick={() => { try { navigator.clipboard.writeText('miunerofrade@gmail.com'); } catch {} }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); try { navigator.clipboard.writeText('miunerofrade@gmail.com'); } catch {} } }}>
          <span aria-hidden="true"><GmailIcon /></span>
          Gmail
        </span>
        <span title="复制 QQ 号" tabIndex={0} role="button" className="inline-flex items-center gap-1.5 cursor-pointer hover:text-terracotta transition-colors duration-200" onClick={() => { try { navigator.clipboard.writeText('2822425981'); } catch {} }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); try { navigator.clipboard.writeText('2822425981'); } catch {} } }}>
          <span aria-hidden="true"><QQIcon /></span>
          QQ
        </span>
      </div>
      <div className="flex flex-col items-center" style={{ gap: '0.25rem' }}>
        <p className="text-xs text-foreground/30" style={{ margin: 0 }}>© 2026 Miunerofrade. All Rights Reserved.</p>
        <p className="text-xs text-foreground/30" style={{ margin: 0 }}>Built with Next.js. Powered by Miunerofrade.</p>
      </div>
    </footer>
  );
}
