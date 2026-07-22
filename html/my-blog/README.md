# My Blog Web App

博客的 Next.js 应用。项目读取 `content/posts` 中的 Markdown 文件生成文章页面，不依赖数据库或外部后端服务。

## 环境要求

- Node.js 20.9 或更高版本
- pnpm（推荐通过 Node.js 自带的 Corepack 调用）

## 开发

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

开发服务器默认运行在 <http://localhost:3000>。

## 构建和运行

```powershell
corepack pnpm build
corepack pnpm start
```

## 代码检查

```powershell
corepack pnpm lint
```

## 目录

- `app`：App Router 页面和布局
- `components`：共享 React 组件
- `content/posts`：Markdown 文章
- `lib`：文章解析和 Remark 插件
- `public`：静态资源
