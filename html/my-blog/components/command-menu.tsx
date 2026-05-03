"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";

interface PostEntry {
  title: string;
  slug: string;
}

export default function CommandMenu({ posts }: { posts: PostEntry[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (slug: string) => {
      router.push(`/article/${slug}`);
      setOpen(false);
    },
    [router]
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[200]"
          onClick={() => setOpen(false)}
        />
      )}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="搜索文章"
        className="fixed top-[18%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] border border-foreground/10 shadow-2xl rounded-xl bg-background overflow-hidden"
      >
        <Dialog.Title className="sr-only">搜索文章</Dialog.Title>
        <Command.Input
          placeholder="搜索文章..."
          style={{ padding: '1.5rem 2rem' }}
          className="w-full text-2xl font-semibold bg-transparent border-b border-foreground/10 outline-none text-foreground placeholder:text-foreground/25"
        />
        <Command.List style={{ padding: '0.75rem 0', maxHeight: '20rem', overflowY: 'auto' }}>
          <Command.Empty style={{ padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--foreground)' }} className="text-foreground/40">
            未找到文章
          </Command.Empty>
          {posts.map((post) => (
            <Command.Item
              key={post.slug}
              value={post.title}
              onSelect={() => handleSelect(post.slug)}
              style={{ padding: '0.5rem 1.25rem', cursor: 'pointer' }}
              className="text-base text-foreground/80 aria-selected:bg-foreground/[0.03] aria-selected:text-terracotta aria-selected:font-semibold transition-colors"
            >
              {post.title}
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
