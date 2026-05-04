import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "友链 | Miunerofrade",
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
