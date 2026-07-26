const BILIBILI_CARD_API =
  "https://api.bilibili.com/x/web-interface/card?mid=36081646";

type BilibiliCardResponse = {
  code: number;
  data?: {
    card?: {
      face?: string;
    };
  };
};

export async function GET() {
  const profileResponse = await fetch(BILIBILI_CARD_API, {
    headers: {
      Referer: "https://space.bilibili.com/36081646",
      "User-Agent": "Mozilla/5.0",
    },
    next: { revalidate: 3600 },
  });

  if (!profileResponse.ok) {
    return new Response("Unable to load profile", { status: 502 });
  }

  const profile = (await profileResponse.json()) as BilibiliCardResponse;
  const face = profile.data?.card?.face;
  if (profile.code !== 0 || !face) {
    return new Response("Avatar is unavailable", { status: 502 });
  }

  const faceUrl = new URL(face);
  if (
    faceUrl.protocol !== "https:" ||
    !faceUrl.hostname.endsWith(".hdslb.com")
  ) {
    return new Response("Unexpected avatar source", { status: 502 });
  }

  const avatarResponse = await fetch(faceUrl, {
    headers: {
      Referer: "https://space.bilibili.com/36081646",
      "User-Agent": "Mozilla/5.0",
    },
    next: { revalidate: 3600 },
  });

  if (!avatarResponse.ok || !avatarResponse.body) {
    return new Response("Unable to load avatar", { status: 502 });
  }

  return new Response(avatarResponse.body, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type":
        avatarResponse.headers.get("content-type") ?? "image/webp",
    },
  });
}
