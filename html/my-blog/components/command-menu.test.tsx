import { useRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CommandMenu, { type SearchPostEntry } from "./command-menu";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const posts: SearchPostEntry[] = [
  { title: "Building the blog", slug: "building-the-blog" },
  { title: "Next.js notes", slug: "nextjs-notes" },
];

function Harness() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Search trigger
      </button>
      <CommandMenu posts={posts} open={open} onOpenChange={setOpen} triggerRef={triggerRef} />
      <button type="button">Outside</button>
    </div>
  );
}

describe("CommandMenu", () => {
  beforeEach(() => push.mockReset());

  it("opens from the trigger, focuses the input, and filters titles", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Search trigger" }));
    const input = await screen.findByRole("combobox", { name: "搜索文章标题" });
    await waitFor(() => expect(input).toHaveFocus());

    await user.type(input, "Next.js");
    expect(screen.getByText("Next.js notes")).toBeVisible();
    expect(screen.queryByText("Building the blog")).not.toBeInTheDocument();
  });

  it("opens with Ctrl+K and closes with Escape while restoring focus", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.keyboard("{Control>}k{/Control}");
    expect(await screen.findByRole("dialog", { name: "搜索文章" })).toBeInTheDocument();
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "搜索文章" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Search trigger" })).toHaveFocus();
    });
  });

  it("navigates to the selected article and closes", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Search trigger" }));
    await user.click(await screen.findByText("Building the blog"));

    expect(push).toHaveBeenCalledWith("/article/building-the-blog");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "搜索文章" })).not.toBeInTheDocument());
  });

  it("shows an empty state when no title matches", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Search trigger" }));
    await user.type(await screen.findByRole("combobox", { name: "搜索文章标题" }), "not available");

    expect(await screen.findByText("未找到文章")).toBeVisible();
  });

  it("closes when the user clicks outside", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Search trigger" }));
    const overlay = document.querySelector("[cmdk-overlay]");
    expect(overlay).not.toBeNull();
    await user.click(overlay!);

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "搜索文章" })).not.toBeInTheDocument());
  });
});
