import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LinksPage from "./page";

describe("LinksPage friend themes", () => {
  it("applies the Luo Tianyi theme only while the card is active", () => {
    render(<LinksPage />);

    const card = screen.getByRole("link", { name: /洛天依/ });
    const title = screen.getByText("洛天依");
    const highlight = card.querySelector("[data-friend-highlight]");
    const arrow = card.querySelector(".friend-card-arrow");

    expect(card.style.getPropertyValue("--friend-theme")).toBe("#66CCFF");
    expect(card.style.getPropertyValue("--friend-name-color")).toBe("");
    expect(title).toHaveStyle({
      color: "var(--friend-name-color, var(--text-color))",
    });
    expect(arrow).toHaveStyle({
      color: "var(--friend-theme, var(--color-terracotta))",
    });
    expect(highlight).toHaveStyle({
      backgroundColor: "var(--friend-theme, var(--accent-color))",
    });

    fireEvent.pointerEnter(card, { clientX: 0 });
    expect(card.style.getPropertyValue("--friend-name-color")).toBe(
      "var(--friend-theme, var(--color-terracotta))",
    );

    fireEvent.pointerLeave(card);
    expect(card.style.getPropertyValue("--friend-name-color")).toBe("");
  });
});
