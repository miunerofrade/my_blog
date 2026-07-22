---
title: "一次 Next.js 请求经过了什么"
date: "2026-07-21"
excerpt: "从路由、服务端数据到客户端交互，拆解一个博客页面的完整请求路径。"
readTime: "9 min read"
tags: ["Next.js", "React", "Engineering"]
---

打开一个页面时，浏览器看到的只是最终结果；在这之前，路由匹配、数据读取、服务端渲染与客户端激活已经依次发生。理解这条路径，可以帮助我们判断代码应该放在服务端还是客户端。

## 从路由开始

在 App Router 中，目录结构就是路由结构。下面的文件会处理 `/article/[slug]`：

```text
app/
  article/
    [slug]/
      page.tsx
```

动态参数以 Promise 的形式传入页面。读取文章数据的逻辑可以留在服务端组件中，因此 Markdown 文件和文件系统 API 不会进入浏览器代码。

```tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostData(slug);

  return <Article post={post} />;
}
```

## 服务端与客户端如何分工

一个实用原则是：数据尽量留在服务端，交互靠近真正需要交互的组件。

| 工作 | 推荐位置 | 原因 |
| --- | --- | --- |
| 读取 Markdown | 服务端 | 避免暴露文件系统并减少客户端代码 |
| 生成元数据 | 服务端 | 搜索引擎可直接读取完整结果 |
| 主题切换 | 客户端 | 需要响应点击与浏览器状态 |
| 阅读进度 | 客户端 | 依赖滚动位置 |
| 标题目录提取 | 服务端 | 内容在渲染前已经确定 |

不要因为某个页面包含一个按钮，就把整个页面都标记为 `"use client"`。更小的客户端边界意味着更少的 JavaScript，也意味着更少的水合工作。

## 缓存不是越多越好

远程数据适合设置重新验证时间，但本地文章通常可以在请求或构建阶段直接读取。对于 GitHub 仓库列表，可以使用定时重新验证：

```ts
const response = await fetch(apiUrl, {
  headers: {
    Accept: "application/vnd.github+json",
  },
  next: { revalidate: 3600 },
});
```

这段配置表达的是：一小时内可以复用结果，超过一小时后允许框架重新获取。它不是传统意义上的 `setInterval`，也不会要求某个浏览器页面持续打开。

### 失败时应该显示什么

外部接口不可用并不应该拖垮整个首页。对于非关键内容，返回空数组通常比抛出全页错误更合适：

```ts
try {
  return await loadRepositories();
} catch (error) {
  console.error("Unable to load repositories", error);
  return [];
}
```

但“吞掉错误”并不是终点。日志仍然要保留，否则线上出现问题时只能看到一个空白区域，却不知道请求在哪里失败。

## 水合之后

服务端返回 HTML 后，React 会在浏览器中连接需要交互的组件。这个过程称为水合。若服务端和客户端首次渲染结果不同，就可能出现 hydration mismatch。

常见风险包括：

- 首次渲染直接读取 `window`；
- 使用当前时间生成不稳定文本；
- 服务端与浏览器使用不同语言环境格式化日期；
- 在渲染期间生成随机数。

解决这些问题的关键不是加入更多 `suppressHydrationWarning`，而是让首次输出保持确定，等组件挂载后再读取浏览器专属状态。

## 一条更清晰的路径

最终，一个文章页面的请求可以概括为：路由匹配参数，服务端读取内容并生成 HTML，浏览器接收页面，然后只激活需要交互的局部组件。

这条路径越清晰，代码的职责边界就越自然。性能优化往往不是从某个复杂技巧开始，而是从“不把不需要的代码发送给浏览器”开始。
