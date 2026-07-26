import { describe, expect, it } from "vitest";
import {
  createJustifiedPostRows,
  COVER_ROW_SHARE,
  DEFAULT_POST_ASPECT_RATIOS,
  getPostLayoutAspectRatio,
  MIN_POST_ASPECT_RATIO,
  POST_GRID_GAP,
  POST_GRID_MAX_HEIGHT,
} from "./justified-post-layout";

describe("justified post layout", () => {
  it("keeps input order while filling desktop rows", () => {
    const posts = [1.6, 0.9, 2.1, 1.2, 1.5, 1].map(
      (coverAspectRatio) => ({ coverAspectRatio }),
    );
    const rows = createJustifiedPostRows(posts, 1032);
    const indexes = rows.flatMap((row) => row.items.map((item) => item.index));

    expect(indexes).toEqual([0, 1, 2, 3, 4, 5]);
    expect(rows.length).toBeGreaterThan(1);

    for (const row of rows.slice(0, -1)) {
      const occupiedWidth =
        row.items.reduce((total, item) => total + item.width, 0) +
        (row.items.length - 1) * POST_GRID_GAP;
      expect(occupiedWidth).toBeCloseTo(1032, 0);
    }
  });

  it("avoids narrow cards at the standard article width", () => {
    const posts = [
      { slug: "test-math-cover", coverAspectRatio: 1716 / 1080 },
      { slug: "test-math-theme" },
      { slug: "test-math-default" },
      { slug: "finally-built-the-blog" },
      { slug: "test-math-series" },
      { slug: "test-math-geometry" },
    ];
    const rows = createJustifiedPostRows(posts, 1032);
    const widths = rows.flatMap((row) => row.items.map((item) => item.width));

    expect(Math.min(...widths)).toBeGreaterThanOrEqual(290);
  });

  it("gives covered posts the larger side of a desktop row", () => {
    const rows = createJustifiedPostRows(
      [
        { slug: "covered", coverAspectRatio: 16 / 10 },
        { slug: "companion" },
        { slug: "plain" },
      ],
      1200,
    );
    const [cover, companion] = rows[0].items;

    expect(rows[0].items).toHaveLength(2);
    expect(cover.index).toBe(0);
    expect(cover.width).toBeCloseTo((1200 - POST_GRID_GAP) * COVER_ROW_SHARE);
    expect(cover.width).toBeGreaterThan(companion.width);
    expect(cover.visualHeight).toBe(companion.visualHeight);
  });

  it("crops extreme portrait ratios and caps visual height", () => {
    expect(getPostLayoutAspectRatio({ coverAspectRatio: 0.4 })).toBe(
      MIN_POST_ASPECT_RATIO,
    );

    const [row] = createJustifiedPostRows(
      [{ coverAspectRatio: 0.4 }],
      420,
    );
    expect(row.items[0].visualHeight).toBe(POST_GRID_MAX_HEIGHT);
  });

  it("uses one full-width item per row below the desktop breakpoint", () => {
    const rows = createJustifiedPostRows(
      [{ coverAspectRatio: 1.6 }, {}, { coverAspectRatio: 1 }],
      720,
    );

    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.items.length === 1)).toBe(true);
    expect(rows.every((row) => row.items[0].width === 720)).toBe(true);
  });

  it("lets a single post fill the desktop container", () => {
    const rows = createJustifiedPostRows(
      [{ slug: "only-post" }],
      1032,
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].items[0].width).toBe(1032);
    expect(rows[0].items[0].visualHeight).toBeLessThanOrEqual(
      POST_GRID_MAX_HEIGHT,
    );
  });

  it("assigns stable varied ratios to posts without covers", () => {
    const posts = [
      { slug: "test-math-theme" },
      { slug: "test-math-default" },
      { slug: "finally-built-the-blog" },
      { slug: "test-math-geometry" },
    ];
    const ratios = posts.map(getPostLayoutAspectRatio);

    expect(new Set(ratios).size).toBeGreaterThan(1);
    expect(Math.min(...ratios)).toBeGreaterThanOrEqual(6 / 5);
    expect(ratios.every((ratio) => DEFAULT_POST_ASPECT_RATIOS.includes(
      ratio as (typeof DEFAULT_POST_ASPECT_RATIOS)[number],
    ))).toBe(true);
    expect(posts.map(getPostLayoutAspectRatio)).toEqual(ratios);
  });

  it("always prefers the natural cover ratio", () => {
    expect(
      getPostLayoutAspectRatio({
        slug: "test-math-theme",
        coverAspectRatio: 1.42,
      }),
    ).toBe(1.42);
  });
});
