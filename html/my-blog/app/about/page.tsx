"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
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
            About<span className="text-terracotta">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-6 text-lg text-foreground/50 max-w-xl leading-relaxed"
          >
            关于我。
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="prose prose-lg dark:prose-invert prose-neutral max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
          prose-a:text-terracotta
          prose-p:leading-8 prose-p:text-foreground dark:prose-p:text-foreground
          prose-strong:text-foreground
          prose-ul:list-inside prose-ul:pl-5 prose-li:my-0.5 prose-li:text-foreground"
          style={{ marginTop: '1rem' }}
        >
          <p>你好，我是 Miunerofrade，一个热爱技术和设计的开发者。</p>
          <p>这个博客是我用来记录思考、分享知识和探索创意的地方。我相信简洁、精致的设计能带来更好的阅读体验。</p>
          <h2>技术栈</h2>
          <ul>
            <li>Next.js 16 + React 19</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Framer Motion</li>
          </ul>
          <h2>联系我</h2>
          <p>你可以通过 GitHub 或邮件与我取得联系，详情见站底。</p>
        </motion.div>

      </div>
    </main>
  );
}
