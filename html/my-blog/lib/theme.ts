import { z } from "zod";

export const ThemeColorSchema = z
  .string()
  .trim()
  .regex(/^#?[0-9a-fA-F]{6}$/, "theme must be a six-digit hexadecimal color")
  .transform((value) => `#${value.replace(/^#/, "").toUpperCase()}`);

export type ThemeColor = z.infer<typeof ThemeColorSchema>;

function toLinearChannel(channel: number) {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

export function getContrastingForeground(
  color: ThemeColor,
): "#000000" | "#FFFFFF" {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  const luminance =
    0.2126 * toLinearChannel(red) +
    0.7152 * toLinearChannel(green) +
    0.0722 * toLinearChannel(blue);
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);

  return blackContrast >= whiteContrast ? "#000000" : "#FFFFFF";
}
