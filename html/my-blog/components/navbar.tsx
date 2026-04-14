export default function Navbar() {
  return (
    <nav className="w-full h-[50px] border-b border-ink/10 flex justify-center bg-pampas/80 backdrop-blur-sm sticky top-0 z-[100]">
      <div className="w-full max-w-[980px] h-full flex items-center justify-between px-6">
        
        <div className="flex-1">
          <span className="text-xl font-medium tracking-[-0.56px] leading-[1.07] text-ink">
            Miunerrofrade
          </span>
        </div>

        <div className="flex-1 flex justify-center gap-8 text-[14px] font-normal tracking-[0.05em] leading-[1.07] text-ink/80">
          <a href="/" className="hover:text-ink transition-colors">首页</a>
          <a href="/posts" className="hover:text-ink transition-colors">文章</a>
          <a href="/links" className="hover:text-ink transition-colors">友链</a>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="w-8 h-8 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-[10px] text-ink/40">
            ID
          </div>
        </div>

      </div>
    </nav>
  );
}