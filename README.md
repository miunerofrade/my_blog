# My Blog

一个基于 Next.js 16 的个人博客，使用 App Router、React 19、Tailwind CSS 4 和本地 Markdown 内容。

## 功能

- 响应式文章列表、标签页和文章目录
- 深色模式与页面过渡动画
- Markdown、GFM、数学公式和 Mermaid 图表
- Shiki 代码高亮与图片缩放

## 技术栈

- Next.js 16.2.3（App Router）
- React 19.2.4
- Tailwind CSS 4
- Framer Motion
- next-mdx-remote、Remark 和 Rehype

## 本地运行

需要 Node.js 20.9 或更高版本。项目使用 pnpm 锁定依赖；已安装 Node.js 自带的 Corepack 时，无需单独全局安装 pnpm。

```powershell
cd html/my-blog
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

打开 <http://localhost:3000>。

## 常用命令

```powershell
corepack pnpm dev
corepack pnpm build
corepack pnpm start
corepack pnpm lint
```

博客文章存放在 `html/my-blog/content/posts`，添加 Markdown 文件即可新增文章。
