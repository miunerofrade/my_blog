# Miunerofrade's Blog

Miunerofrade 的个人博客，使用 Next.js App Router 构建。文章来自仓库中的 Markdown 文件，不依赖数据库；页面由 Vercel 托管，并在 `main` 分支更新后自动部署。

## 在线地址

- 正式域名：<https://miunerofrade.com>
- `www` 地址：<https://www.miunerofrade.com>
- 源代码：<https://github.com/miunerofrade/my_blog>

域名在 Spaceship 注册并管理 DNS，根域名与 `www` 均指向 Vercel。目前根域名会通过 Vercel 重定向至 `www` 地址，HTTPS 证书由 Vercel 自动签发和续期。

## 当前功能

- 响应式首页与 GitHub Recent focus
- 列表和卡片两种文章浏览方式
- Markdown、GFM、KaTeX 和 Mermaid 渲染
- 代码高亮与复制按钮
- 图片和 Mermaid 图表灯箱
- 文章目录、阅读进度与上下篇导航
- 浅色和 One Dark 暗色主题
- 桌面导航与移动端右侧抽屉导航
- About、Tags 和 Friends 页面

GitHub Recent focus 使用公开 GitHub API。遇到匿名请求限流或网络错误时会返回空列表，不影响首页主体内容。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- next-mdx-remote
- Mermaid
- KaTeX
- pnpm

## 仓库结构

仓库根目录包含其他项目文件，博客应用位于：

```text
html/my-blog
```

Vercel 项目的 Root Directory 也必须设置为 `html/my-blog`。

主要目录：

- `app`：App Router 页面、布局和全局样式
- `components`：导航、文章、灯箱和其他共享组件
- `content/posts`：Markdown 文章
- `lib`：文章读取、GitHub 请求和 Remark 插件
- `public`：静态资源

## 本地开发

环境要求：Node.js 20.9 或更高版本，并通过 Corepack 使用 pnpm。

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

开发服务器默认运行在 <http://localhost:3000>。

代码检查：

```powershell
corepack pnpm lint
corepack pnpm exec tsc --noEmit
```

## 内容管理

在 `content/posts` 中添加 Markdown 文件即可发布文章。文件需要包含 front matter：

```md
---
title: "文章标题"
date: "2026-07-22"
excerpt: "文章摘要"
readTime: "5 min read"
tags: ["Blog"]
---
```

文件名会成为文章路由，例如 `finally-built-the-blog.md` 对应：

```text
/article/finally-built-the-blog
```

## 部署

Vercel 已连接 GitHub 仓库的 `main` 分支。推送提交后，Vercel 会自动安装依赖、运行生产构建并发布新版本，无需手动上传构建产物。

部署配置：

```text
Framework Preset: Next.js
Root Directory: html/my-blog
Install Command: pnpm install
Build Command: pnpm build
```

`.next`、`node_modules`、环境变量文件和 Vercel 本地配置均不会提交到仓库。
