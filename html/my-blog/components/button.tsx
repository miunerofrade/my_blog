"use client";
export default function NavButton({ 
  label, 
  href = "#",
  isPrimary = false 
}: { 
  label: string; 
  href?: string;
  isPrimary?: boolean; 
}) {
  return (
    <a href={href} className="inline-block w-auto">
      <button className={`
        group 
        cursor-pointer
        w-auto min-w-[240px] hover:min-w-[270px] 
        h-[60px] hover:h-[63px] 
        px-12 hover:px-16 
        
        flex items-center justify-center shrink-0 whitespace-nowrap
        rounded-full border-2
        
        text-base md:text-lg tracking-widest uppercase font-black 
        transition-all duration-300 ease-out
        
        ${isPrimary 
          ? "border-terracotta text-terracotta bg-terracotta/5 shadow-[0_0_20px_-5px_rgba(217,119,87,0.4)]" 
          : "bg-transparent border-foreground/30 text-foreground hover:border-terracotta hover:text-terracotta hover:bg-terracotta/5"
        }
      `}>
        
        <div className="flex items-center justify-center gap-0 group-hover:gap-4 transition-all duration-300 ease-out">
          <span>{label}</span>

          <span className="
            inline-block max-w-0 opacity-0 -translate-x-2
            group-hover:max-w-[24px] group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-300 ease-out
          ">
            →
          </span>
        </div>
      </button>
    </a>
  );
}