"use client";

import { motion } from "framer-motion";

const LINKS_DATA = [
  { name: "John Doe", desc: "A frontend developer crafting beautiful UIs.", url: "https://example.com", avatar: "https://github.com/shadcn.png" },
  { name: "Jane Smith", desc: "Design engineer exploring interactive design.", url: "https://example.com", avatar: "https://github.com/shadcn.png" },
  { name: "Alex Chen", desc: "Full-stack developer & open source enthusiast.", url: "https://example.com", avatar: "https://github.com/shadcn.png" },
  { name: "Mia Johnson", desc: "Writer, thinker, and indie hacker.", url: "https://example.com", avatar: "https://github.com/shadcn.png" },
  { name: "Lucas Wang", desc: "Building cool stuff with Rust & WebAssembly.", url: "https://example.com", avatar: "https://github.com/shadcn.png" },
  { name: "Sophia Kim", desc: "UI/UX designer with a passion for typography.", url: "https://example.com", avatar: "https://github.com/shadcn.png" },
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
                <div className="w-14 h-14 rounded-2xl shrink-0 overflow-hidden bg-foreground/10">
                  <img
                    src={link.avatar}
                    alt={`${link.name}'s avatar`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
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
      </div>
    </main>
  );
}
