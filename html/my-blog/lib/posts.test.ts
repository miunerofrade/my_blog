import { describe, expect, it } from "vitest";
import {
  CardColorSchema,
  CoverPathSchema,
  PostSchema,
  decodePostSlug,
  getPostData,
} from "./posts";

describe("post slugs", () => {
  it("decodes a URL-encoded Chinese slug before reading the post", () => {
    const encodedSlug = encodeURIComponent("AI时代的自主权");

    expect(decodePostSlug(encodedSlug)).toBe("AI时代的自主权");
    expect(getPostData(encodedSlug).slug).toBe("AI时代的自主权");
  });

  it.each(["../secret", "..%2Fsecret", "%2E%2E%5Csecret"])(
    "rejects a slug that escapes the posts directory: %s",
    (slug) => {
      expect(() => decodePostSlug(slug)).toThrow("Invalid post slug");
    },
  );
});

describe("CoverPathSchema", () => {
  it.each([
    ["/images/post.webp", "/images/post.webp"],
    [" /photos/cover.png ", "/photos/cover.png"],
    ["", undefined],
    ["   ", undefined],
    [undefined, undefined],
  ])("normalizes %s to %s", (input, expected) => {
    expect(CoverPathSchema.parse(input)).toBe(expected);
  });

  it.each([
    "https://example.com/cover.webp",
    "//example.com/cover.webp",
    "images/cover.webp",
    "/images/cover.svg",
    "/images/../cover.webp",
  ])("rejects unsupported cover path %s", (input) => {
    expect(() => CoverPathSchema.parse(input)).toThrow();
  });
});

describe("CardColorSchema", () => {
  it.each([
    ["66ccff", "#66CCFF"],
    [" 2563EB ", "#2563EB"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(CardColorSchema.parse(input)).toBe(expected);
  });

  it.each(["#66ccff", "66cff", "66ccff00", "GGCCFF", ""])(
    "rejects unsupported card color %s",
    (input) => {
      expect(() => CardColorSchema.parse(input)).toThrow();
    },
  );

  it("allows color without theme and keeps both fields independent", () => {
    const base = {
      title: "Color card",
      date: "2026-07-26",
      excerpt: "Test",
    };

    const colorOnly = PostSchema.parse({ ...base, color: "66ccff" });
    expect(colorOnly.color).toBe("#66CCFF");
    expect(colorOnly.theme).toBeUndefined();
    expect(
      PostSchema.parse({ ...base, color: "2563eb", theme: "16a34a" }),
    ).toMatchObject({
      color: "#2563EB",
      theme: "#16A34A",
    });
  });
});
