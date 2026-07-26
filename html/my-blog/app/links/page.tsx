"use client";

import {
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

type LinkItem = {
  name: string;
  desc: string;
  url: string;
  avatar?: string;
  theme?: string;
};

const LINKS_DATA: LinkItem[] = [
  { name: "GitHub", desc: "全球最大的开源软件开发与协作平台。", url: "https://github.com/miunerofrade", avatar: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
  {
    name: "洛天依",
    desc: "Vsinger 旗下虚拟歌手，世界首位中文 V 家虚拟歌手。",
    url: "https://space.bilibili.com/36081646",
    avatar: "/api/avatars/luo-tianyi",
    theme: "66ccff",
  },
];

type FriendCardStyle = CSSProperties & {
  "--friend-theme"?: string;
};

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

function updateCardHighlightOrigin(event: PointerEvent<HTMLAnchorElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const position = ((event.clientX - bounds.left) / bounds.width) * 100;
  event.currentTarget.style.setProperty("--hover-origin", `${position}%`);
}

function activateCardTheme(event: PointerEvent<HTMLAnchorElement>) {
  updateCardHighlightOrigin(event);
  event.currentTarget.style.setProperty(
    "--friend-name-color",
    "var(--friend-theme, var(--color-terracotta))",
  );
}

function deactivateCardTheme(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.removeProperty("--friend-name-color");
}

function getFriendCardStyle(theme?: string): FriendCardStyle | undefined {
  if (!theme) return undefined;
  const value = theme.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Invalid friend theme: ${theme}`);
  }
  return { "--friend-theme": `#${value.toUpperCase()}` };
}

function FaviconImg({ item }: { item: LinkItem }) {
  const [failed, setFailed] = useState(false);
  const domain = item.url ? new URL(item.url).hostname : "";

  if (failed) {
    return (
      <div className="friend-avatar friend-avatar-fallback">
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f4f4f5&color=27272a&bold=true&size=128`}
          alt={`${item.name}'s icon`}
          width={56}
          height={56}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const src = item.avatar
    ? item.avatar
    : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <div className="friend-avatar">
      <Image
        src={src}
        alt={`${item.name}'s icon`}
        width={56}
        height={56}
        unoptimized
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function LinksPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center bg-transparent text-foreground selection:bg-accent selection:text-accent-foreground"
      style={{ paddingBottom: '3rem' }}
    >
      <div className="secondary-page-shell w-full max-w-[1080px] flex flex-col">
        <header style={{ marginTop: '6vh', marginBottom: '4vh' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-5xl font-bold uppercase leading-[60px] tracking-normal md:text-[80px] md:leading-[96px]"
          >
            Friends<span className="text-accent">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-6 max-w-xl text-lg leading-7 text-muted"
          >
            这里记录着我在数字世界中有幸遇见的朋友们。
          </motion.p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="friend-grid"
        >
          {LINKS_DATA.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={activateCardTheme}
              onPointerMove={updateCardHighlightOrigin}
              onPointerLeave={deactivateCardTheme}
              style={getFriendCardStyle(link.theme)}
              className="friend-card group"
            >
              <span
                className="friend-card-arrow"
                style={{
                  color: "var(--friend-theme, var(--color-terracotta))",
                }}
                aria-hidden="true"
              >
                <ExternalLink size={24} strokeWidth={2} />
              </span>

              <div className="friend-card-header">
                <FaviconImg item={link} />
                <span className="friend-card-identity">
                  <span
                    className="friend-card-name"
                    style={{
                      color:
                        "var(--friend-name-color, var(--text-color))",
                    }}
                  >
                    {link.name}
                  </span>
                  <span className="friend-card-domain">
                    {new URL(link.url).hostname.replace(/^www\./, "")}
                  </span>
                </span>
              </div>

              <span className="friend-card-description">
                {link.desc}
              </span>
              <span
                data-friend-highlight
                className="absolute bottom-0 left-0 h-[var(--divider-highlight-size)] w-full scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{
                  backgroundColor:
                    "var(--friend-theme, var(--accent-color))",
                  transformOrigin: "var(--hover-origin, 50%) center",
                }}
                aria-hidden="true"
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '3rem', marginBottom: '1rem' ,paddingTop: '1rem'}}
          className="flex flex-col gap-4 border-t border-border pt-12"
        >
          <h2 className="text-[32px] font-black leading-[40px] tracking-normal">如何交换友链？</h2>
          <p className="mt-4 text-lg leading-7 text-foreground">
            如果你也想交换友链，可以按照以下格式联系我，我会尽快添加：
          </p>
          <ul className="mt-6 text-base leading-6 text-foreground">
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">名称：</span><span className="font-medium text-foreground text-xl">Miunerofrade</span></li>
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">链接：</span><a className="underline font-semibold text-accent text-xl" href="https://miunerofrade.com" target="_blank" rel="noopener noreferrer">https://miunerofrade.com</a></li>
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">简介：</span><span className="font-medium text-foreground text-xl">不定时悲伤。</span></li>
            <li style={{ marginBottom: '0.5rem' }}><span className="font-semibold text-foreground text-lg">头像：</span><a className="underline font-semibold text-accent text-xl" href="https://imgchr.com/i/peHkUS0" target="_blank" rel="noopener noreferrer">https://imgchr.com/i/peHkUS0</a></li>
          </ul>
        </motion.section>
      </div>
    </main>
  );
}
