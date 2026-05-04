import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import NavbarServer from "@/components/navbar-server";
import SiteFooter from "@/components/site-footer";
import CommandMenu from "@/components/command-menu";
import BackToTop from "@/components/back-to-top";
import PageTransition from "@/components/page-transition";
import { getAllPosts } from "@/lib/posts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Miunerofrade's Blog",
  description: "Miunerofrade 的个人博客。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts().map((p) => ({ title: p.title, slug: p.slug }));
  return (
    <html
      lang="zh-CN" 
      suppressHydrationWarning
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground ">

        <Providers>
          <NavbarServer />
          <CommandMenu posts={posts} />
          <main className="flex-grow">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <SiteFooter />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
