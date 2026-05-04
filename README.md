
这是一个基于 **Next.js 15** 构建的极简个人博客系统。它不仅是文字的载体，更是一个通过 AI 协作（Claude Code & Gemini）深度打磨出来的实验性项目。

## 项目亮点

- **极简美学**：参考 Apple 设计语言，采用大字号排版与高呼吸感布局，支持全自动深色模式切换。
- **极致阅读体验**：代码块支持自动语言标签识别、平滑的 SVG 复制按钮交互，由自定义 Rehype 插件驱动。
- **沉浸式动效**：集成 `Framer Motion` 实现环境光背景（Background Glow）与丝滑的页面过渡。
- **现代技术栈**：全面采用 React Server Components (RSC) 与 App Router，确保极致的加载性能。

## 技术架构

- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **内容**: [MDX](https://mdxjs.com/) + [Shiki](https://shiki.style/) (代码高亮)
- **工程化**: 自定义 Rehype 插件处理 AST 变换

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
