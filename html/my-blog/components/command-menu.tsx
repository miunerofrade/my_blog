"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";

export interface SearchPostEntry {
  title: string;
  slug: string;
}

interface CommandMenuProps {
  posts: SearchPostEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function CommandMenu({
  posts,
  open,
  onOpenChange,
  triggerRef,
}: CommandMenuProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);
  const [query, setQuery] = useState("");

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, onOpenChange, open]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    if (wasOpen.current) {
      wasOpen.current = false;
      requestAnimationFrame(() => {
        setQuery("");
        triggerRef.current?.focus();
      });
    }
  }, [open, triggerRef]);

  const handleSelect = useCallback(
    (slug: string) => {
      router.push(`/article/${slug}`);
      close();
    },
    [close, router],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="搜索文章标题"
      overlayClassName="command-menu-overlay fixed inset-0 z-[200] bg-background/50 backdrop-blur-sm"
      contentClassName="command-menu-dialog"
      className="w-full overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
    >
        <Dialog.Title className="sr-only">搜索文章</Dialog.Title>
        <Dialog.Description className="sr-only">
          输入文章标题进行筛选，按回车打开文章。
        </Dialog.Description>
        <Command.Input
          ref={inputRef}
          value={query}
          onValueChange={setQuery}
          aria-label="搜索文章标题"
          placeholder="搜索文章..."
          className="command-menu-input w-full border-0 bg-transparent text-xl font-semibold leading-8 text-foreground outline-none placeholder:text-muted md:text-2xl"
        />
        <Command.List className="command-menu-list max-h-[min(320px,calc(100dvh-180px))] overflow-y-auto">
          <Command.Empty className="flex min-h-12 items-center justify-center px-6 text-sm leading-[22px] text-muted">
            未找到文章
          </Command.Empty>
          {posts.map((post) => (
            <Command.Item
              key={post.slug}
              value={post.title}
              onSelect={() => handleSelect(post.slug)}
              className="command-menu-item flex min-h-16 cursor-pointer items-center rounded-lg text-lg leading-7 text-foreground transition-colors aria-selected:bg-surface-hover aria-selected:font-semibold aria-selected:text-accent"
            >
              {post.title}
            </Command.Item>
          ))}
        </Command.List>
    </Command.Dialog>
  );
}
