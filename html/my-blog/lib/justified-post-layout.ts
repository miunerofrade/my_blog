import createJustifiedLayout from "justified-layout";
import type { PostData } from "./posts";

export const DEFAULT_POST_ASPECT_RATIO = 3 / 2;
export const DEFAULT_POST_ASPECT_RATIOS = [
  16 / 9,
  3 / 2,
  4 / 3,
  5 / 4,
  6 / 5,
] as const;
export const MIN_POST_ASPECT_RATIO = 4 / 5;
export const POST_GRID_BREAKPOINT = 960;
export const POST_GRID_GAP = 24;
export const POST_GRID_TARGET_HEIGHT = 260;
export const POST_GRID_MAX_HEIGHT = 320;
export const COVER_ROW_SHARE = 0.6;

export interface JustifiedPostItem {
  index: number;
  width: number;
  visualHeight: number;
  aspectRatio: number;
}

export interface JustifiedPostRow {
  top: number;
  items: JustifiedPostItem[];
}

type PostLayoutInput = Pick<PostData, "coverAspectRatio"> &
  Partial<Pick<PostData, "slug">>;

function getStableSlugIndex(slug: string) {
  let hash = 0;

  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }

  return hash % DEFAULT_POST_ASPECT_RATIOS.length;
}

export function getPostLayoutAspectRatio(
  post: PostLayoutInput,
) {
  const fallbackAspectRatio = post.slug
    ? DEFAULT_POST_ASPECT_RATIOS[getStableSlugIndex(post.slug)]
    : DEFAULT_POST_ASPECT_RATIO;

  return Math.max(
    post.coverAspectRatio ?? fallbackAspectRatio,
    MIN_POST_ASPECT_RATIO,
  );
}

export function createJustifiedPostRows(
  posts: PostLayoutInput[],
  containerWidth: number,
): JustifiedPostRow[] {
  if (containerWidth <= 0 || posts.length === 0) {
    return [];
  }

  const aspectRatios = posts.map(getPostLayoutAspectRatio);

  if (containerWidth <= POST_GRID_BREAKPOINT || posts.length === 1) {
    return aspectRatios.map((aspectRatio, index) => ({
      top: index,
      items: [
        {
          index,
          width: containerWidth,
          visualHeight: Math.min(
            POST_GRID_MAX_HEIGHT,
            containerWidth / aspectRatio,
          ),
          aspectRatio,
        },
      ],
    }));
  }

  const rows: JustifiedPostRow[] = [];

  const appendJustifiedRows = (start: number, end: number) => {
    if (start >= end) {
      return;
    }

    const segmentAspectRatios = aspectRatios.slice(start, end);
    const layout = createJustifiedLayout(segmentAspectRatios, {
      containerWidth,
      containerPadding: 0,
      boxSpacing: {
        horizontal: POST_GRID_GAP,
        vertical: POST_GRID_GAP,
      },
      targetRowHeight: POST_GRID_TARGET_HEIGHT,
      targetRowHeightTolerance:
        (POST_GRID_MAX_HEIGHT - POST_GRID_TARGET_HEIGHT) /
        POST_GRID_TARGET_HEIGHT,
      showWidows: true,
      widowLayoutStyle: "left",
    });

    layout.boxes.forEach((box, localIndex) => {
      const previousRow = rows.at(-1);
      const row =
        previousRow &&
        previousRow.top === start + box.top
          ? previousRow
          : (() => {
              const nextRow = {
                top: start + box.top,
                items: [] as JustifiedPostItem[],
              };
              rows.push(nextRow);
              return nextRow;
            })();

      row.items.push({
        index: start + localIndex,
        width: box.width,
        visualHeight: Math.min(box.height, POST_GRID_MAX_HEIGHT),
        aspectRatio: box.aspectRatio,
      });
    });
  };

  let segmentStart = 0;
  let index = 0;

  while (index < posts.length) {
    if (posts[index].coverAspectRatio === undefined) {
      index += 1;
      continue;
    }

    appendJustifiedRows(segmentStart, index);

    const availableWidth = containerWidth - POST_GRID_GAP;
    const nextIndex = index + 1;

    if (nextIndex < posts.length) {
      const coverWidth = availableWidth * COVER_ROW_SHARE;
      const companionWidth = availableWidth - coverWidth;
      const visualHeight = Math.min(
        POST_GRID_MAX_HEIGHT,
        coverWidth / aspectRatios[index],
        companionWidth / aspectRatios[nextIndex],
      );

      rows.push({
        top: index,
        items: [
          {
            index,
            width: coverWidth,
            visualHeight,
            aspectRatio: aspectRatios[index],
          },
          {
            index: nextIndex,
            width: companionWidth,
            visualHeight,
            aspectRatio: aspectRatios[nextIndex],
          },
        ],
      });
      index += 2;
    } else {
      rows.push({
        top: index,
        items: [
          {
            index,
            width: containerWidth,
            visualHeight: Math.min(
              POST_GRID_MAX_HEIGHT,
              containerWidth / aspectRatios[index],
            ),
            aspectRatio: aspectRatios[index],
          },
        ],
      });
      index += 1;
    }

    segmentStart = index;
  }

  appendJustifiedRows(segmentStart, posts.length);

  return rows;
}
