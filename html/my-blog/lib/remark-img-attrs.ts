import { visit } from "unist-util-visit";
import { imageSize } from "image-size";
import { readFileSync } from "fs";
import path from "path";

export const remarkImgAttrs = () => (tree: any) => {
  visit(tree, "image", (node: any) => {
    const params: Record<string, any> = {};

    if (node.url && !node.url.startsWith("http")) {
      try {
        const abs = path.join(process.cwd(), "public", node.url);
        const buf = readFileSync(abs);
        const { width, height } = imageSize(buf);
        params.w = width;
        params.h = height;
      } catch {
      }
    }

    if (node.title) {
      const isAlreadyJson = node.title.startsWith("{");
      if (!isAlreadyJson) {
        node.title.split(",").forEach((part: string) => {
          const eqIdx = part.indexOf("=");
          if (eqIdx === -1) return;
          const k = part.slice(0, eqIdx).trim();
          const v = part.slice(eqIdx + 1).trim();
          if (k && v) params[k] = v;
        });
      }
    }

    if (Object.keys(params).length > 0) {
      node.title = JSON.stringify(params);
    }
  });
};