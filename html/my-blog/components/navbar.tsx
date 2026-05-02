"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './theme-toggle';


const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/article", label: "文章" },
  { href: "/links", label: "友链" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      
      className={`
        w-full h-[50px] flex justify-center sticky top-0 z-[100] 
        transition-all duration-300 ease-out
        ${isScrolled 
          ? "bg-background/70 backdrop-blur-md border-b border-foreground/10" // 滚动后：浮现毛玻璃和底色
          : "bg-transparent border-transparent"                               // 在顶部：绝对透明，极致沉浸
        }
      `}
    >
      <div className="w-full max-w-[1080px] h-full flex items-center justify-between px-6">
        
        <div className="flex-1 flex justify-start">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            Miunerofrade
          </Link>
        </div>

        <div className="flex-1 flex justify-center gap-12 text-base font-bold tracking-widest uppercase">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`relative py-1 transition-colors duration-300 ${isActive ? 'text-terracotta' : 'text-foreground/80 hover:text-terracotta'}`}
              >
                {link.label}
                
                {isActive && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-terracotta rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>

      </div>
    </motion.nav>
  );
}