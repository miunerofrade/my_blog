"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type LinkItem = {
  name: string;
  desc: string;
  url: string;
  avatar?: string;
};

const LINKS_DATA: LinkItem[] = [
  { name: "John Doe", desc: "A frontend developer crafting beautiful UIs.", url: "https://example.com" },
  { name: "Jane Smith", desc: "Design engineer exploring interactive design.", url: "https://jane.design" },
  { name: "Alex Chen", desc: "Full-stack developer & open source enthusiast.", url: "https://github.com",avatar: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
  { name: "Mia Johnson", desc: "Writer, thinker, and indie hacker.", url: "https://medium.com" },
  { name: "Lucas Wang", desc: "Building cool stuff with Rust & WebAssembly.", url: "https://rust-lang.org" },
  { name: "Sophia Kim", desc: "UI/UX designer with a passion for typography.", url: "https://dribbble.com" },
  { name: "哔哩哔哩", desc: "中国年轻世代高度聚集的文化社区和视频平台。", url: "https://www.bilibili.com" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function FaviconImg({ item }: { item: LinkItem }) {
  const [failed, setFailed] = useState(false);
  const domain = item.url ? new URL(item.url).hostname : "";

  if (failed) {
    return (
      <div className="w-14 h-14 rounded-2xl shrink-0 overflow-hidden bg-white dark:bg-zinc-900">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f4f4f5&color=27272a&bold=true&size=128`}
          alt={`${item.name}'s icon`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const src = item.avatar
    ? item.avatar
    : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <div className="w-14 h-14 rounded-2xl shrink-0 overflow-hidden bg-white dark:bg-zinc-900">
      <img
        src={src}
        alt={`${item.name}'s icon`}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function LinksPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center bg-transparent text-foreground selection:bg-terracotta selection:text-background"
      style={{ paddingBottom: '3rem' }}
    >
      <div className="w-full max-w-[1080px] px-8 flex flex-col">
        <header style={{ marginTop: '6vh', marginBottom: '4vh' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2rem,4.5vw,4.5rem)] md:text-[clamp(2.5rem,3vw,5rem)] font-black tracking-tighter uppercase"
          >
            Friends<span className="text-terracotta">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-6 text-lg text-foreground/50 max-w-xl leading-relaxed"
          >
            Here are some of the brilliant minds I've had the pleasure of crossing paths with in the digital world.
          </motion.p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-16"
        >
          {LINKS_DATA.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              className="group relative flex flex-col rounded-xl bg-foreground/2 backdrop-blur-md border border-foreground/10 shadow-sm hover:border-terracotta/40 hover:-translate-y-1 transition-all duration-300 ease-out"
              style={{ padding: '2rem' }}
            >
              <div className="flex items-center gap-5">
                <FaviconImg item={link} />
                <span className="text-xl font-black tracking-tight text-foreground group-hover:text-terracotta transition-colors duration-300">
                  {link.name}
                </span>
              </div>

              <span className="text-sm text-foreground/60 leading-relaxed" style={{ marginTop: '1.5rem' }}>
                {link.desc}
              </span>

              <span className="absolute top-8 right-8 text-terracotta/60 group-hover:text-terracotta opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out font-bold text-xl">
                ↗
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '3rem', marginBottom: '1rem' ,paddingTop: '1rem'}}
          className="border-t border-foreground/10 pt-12 gap-3 flex flex-col"
        >
          <h2 className="text-3xl font-black tracking-tight">如何交换友链？</h2>
          <p className="mt-4 text-foreground/80 leading-relaxed text-lg">
            如果你也想交换友链，可以按照以下格式在任意页面留言，我会尽快添加：
          </p>
          <ul className="mt-6 text-base text-foreground/85 leading-relaxed">
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">名称：</span><span className="font-medium text-foreground text-xl">Miunerofrade</span></li>
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">链接：</span><a className="underline font-semibold text-terracotta text-xl" href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a></li>
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">简介：</span><span className="font-medium text-foreground text-xl">不定时悲伤。</span></li>
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">头像：</span><a className="underline font-semibold text-terracotta text-xl" href="https://imgchr.com/i/peHkUS0" target="_blank" rel="noopener noreferrer">https://imgchr.com/i/peHkUS0</a></li>
          </ul>
        </motion.section>
      </div>
    </main>
  );
}
