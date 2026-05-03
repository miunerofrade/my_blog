import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  year: string;
  tags?: string[];
}

export interface PostDataWithContent extends PostData {
  content: string;
  headings: HeadingItem[];
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

export function getGroupedPosts(): { year: string; posts: PostData[] }[] {
  // 1. 获取所有 .md 文件
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // 解析 Markdown 头部的元数据
      const { data } = matter(fileContents);
      const date = data.date as string;
      const year = date.split('-')[0]; // 提取年份用于分组

      return {
        slug,
        year,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        readTime: data.readTime,
        tags: data.tags || [],
      } as PostData;
    });

  // 2. 按日期从新到旧排序
  const sortedPosts = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));

  // 3. 按年份分组
  const groups = sortedPosts.reduce((acc, post) => {
    const year = post.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, PostData[]>);

  // 4. 转换为数组格式并按年份倒序排
  return Object.keys(groups)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((year) => ({
      year,
      posts: groups[year],
    }));
}

// 获取所有文章的 slug，用于生成静态路由
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => ({
      slug: fileName.replace(/\.md$/, '')
    }));
}

// 根据 slug 获取单篇文章的完整内容
export function getPostData(slug: string): PostDataWithContent {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // matter 会把头部数据放在 data 里，把 Markdown 正文放在 content 里
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    title: data.title as string,
    date: data.date as string,
    readTime: data.readTime as string,
    excerpt: (data.excerpt as string) || '',
    year: (data.date as string).split('-')[0],
    tags: data.tags || [],
    headings: extractHeadings(content),
  };
}

export function getAllPosts(): PostData[] {
  const groups = getGroupedPosts();
  return groups.flatMap((g) => g.posts);
}

export interface TagInfo {
  tag: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const allPosts = getAllPosts();

  const tagMap = new Map<string, number>();
  for (const post of allPosts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostData[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}