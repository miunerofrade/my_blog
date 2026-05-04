"use client";

import { motion } from "framer-motion";
import NavButton from "@/components/button";
import { BackgroundGlow, BackgroundGrid } from "@/components/background";

const NAVIGATION_ITEMS = [
  { label: "Read My Blogs", href: "/article" },
  { label: "About Me", href: "/about" },
  { label: "Projects", href: "#" },
];

export default function Home() {
  return (
    <main className="relative z-10 min-h-[calc(100vh-50px)] bg-transparent text-foreground selection:bg-terracotta selection:text-background flex flex-col items-center p-6 md:p-12 text-center">
      <BackgroundGlow />
      <BackgroundGrid />
      <div className="w-full max-w-[1080px] flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingTop: 'calc((100vh - 50px) / 4)' }}
          className="flex flex-col items-center gap-[3vh] w-full"
        >

          <h1 className="relative left-[0.2ch] text-[clamp(3.5rem,8vw,8rem)] font-black tracking-tighter leading-none uppercase max-w-5xl mx-auto">
            Welcome<span className="text-terracotta">.</span>
          </h1>
          
          <p className="relative left-[0.5em] text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium opacity-80 leading-loose max-w-2xl font-sans">
            欢迎。
          </p>

          <div className="flex flex-col items-center gap-[3vh] w-full max-w-[320px]">
            {NAVIGATION_ITEMS.map((item, index) => (
              <NavButton 
                key={index} 
                label={item.label}
                href={item.href} 
                isPrimary={index === 0} 
              />
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}