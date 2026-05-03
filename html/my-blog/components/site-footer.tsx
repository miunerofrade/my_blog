import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-20 w-full flex flex-col items-center justify-center border-t border-foreground/12 text-xs font-bold tracking-widest uppercase text-foreground/60 text-center"
      style={{ gap: '1rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div className="flex" style={{ gap: '1.5rem' }}>
        <a href="https://github.com/miunerofrade" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors duration-200">GitHub</a>
        <a href="mailto:hi@miunerofrade.com" className="hover:text-terracotta transition-colors duration-200">Email</a>
        <a href="/rss.xml" className="hover:text-terracotta transition-colors duration-200">RSS</a>
      </div>
    </footer>
  );
}
