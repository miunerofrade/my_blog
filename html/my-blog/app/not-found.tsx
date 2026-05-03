import NavButton from "@/components/button";

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-[calc(100vh-50px)] bg-transparent text-foreground selection:bg-terracotta selection:text-background flex flex-col items-center justify-center p-6 md:p-12 text-center">
      <div className="flex flex-col items-center" style={{ gap: '4vh' }}>
        <h1 className="text-[clamp(3.5rem,8vw,8rem)] font-black tracking-tighter leading-none uppercase">
          404<span className="text-terracotta">.</span>
        </h1>
        <p className="relative left-[0.5em] text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium opacity-80 leading-loose max-w-2xl font-sans">
          你探索到了虚无的边界。
        </p>
        <NavButton label="回到首页" href="/" isPrimary />
      </div>
    </main>
  );
}
