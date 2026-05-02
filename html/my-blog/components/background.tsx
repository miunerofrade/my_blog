export function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[#D97757]/8 blur-[120px]"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[150px]"></div>
    </div>
  );
}

export function BackgroundGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <div 
        className="absolute inset-0 bg-foreground/[0.08] dark:bg-foreground/[0.03]"
        style={{
          maskImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.2' fill='black'/%3E%3C/svg%3E")`,
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.2' fill='black'/%3E%3C/svg%3E")`,
          maskSize: '40px 40px',
          WebkitMaskSize: '40px 40px'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
    </div>
  );
}