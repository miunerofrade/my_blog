import NavButton from "@/components/button";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-transparent p-6 text-center text-foreground selection:bg-accent selection:text-accent-foreground md:p-12">
      <div className="flex flex-col items-center" style={{ gap: '4vh' }}>
        <h1 className="text-5xl font-black uppercase leading-[60px] tracking-normal md:text-[80px] md:leading-[96px]">
          404<span className="text-accent">.</span>
        </h1>
        <p className="max-w-2xl font-sans text-lg font-medium leading-7 text-muted md:text-2xl md:leading-[30px]">
          你探索到了虚无的边界。
        </p>
        <NavButton label="回到首页" href="/" isPrimary />
      </div>
    </main>
  );
}
