import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import NavbarServer from "@/components/navbar-server";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";
import PageTransition from "@/components/page-transition";
import "@fontsource-variable/noto-serif-sc";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
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
  return (
    <html
      lang="zh-CN" 
      suppressHydrationWarning
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground ">

        <Providers>
          <NavbarServer />
          <main className="w-full min-w-0 flex-grow">
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
