import { describe, expect, it } from "vitest";
import {
  getContrastingForeground,
  ThemeColorSchema,
} from "./theme";

describe("ThemeColorSchema", () => {
  it.each([
    ["#3b82f6", "#3B82F6"],
    ["3b82f6", "#3B82F6"],
    ["  A1b2C3  ", "#A1B2C3"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(ThemeColorSchema.parse(input)).toBe(expected);
  });

  it.each(["#FFF", "12345G", "#1234567", "", 123456])(
    "rejects invalid theme value %s",
    (input) => {
      expect(() => ThemeColorSchema.parse(input)).toThrow();
    },
  );
});

describe("getContrastingForeground", () => {
  it("uses black on a light accent", () => {
    expect(getContrastingForeground("#FFFF00")).toBe("#000000");
  });

  it("uses white on a dark accent", () => {
    expect(getContrastingForeground("#1D4ED8")).toBe("#FFFFFF");
  });
});
