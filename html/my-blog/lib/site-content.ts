import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const AboutSchema = z.object({
  title: z.string().default("About"),
  subtitle: z.string().default("关于我。"),
});

export function getAboutContent() {
  const filePath = path.join(process.cwd(), "content", "about.md");
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  return { ...AboutSchema.parse(data), content };
}
