---
title: "表格与链接深度解析"
date: "2026-05-01"
excerpt: "展示表格、对齐与链接的编写技巧。"
readTime: "4 min read"
---

# 表格与链接测试



## 表格示例

| 姓名 | 年龄 | 城市 | 职业 |
| :--- | :---: | ---: | :--- |
| 张三 | 28 | 北京 | 工程师 |
| 李四 | 35 | 上海 | 设计师 |
| 王五 | 42 | 深圳 | 产品经理 |

<Spacer h={16} />

## 带对齐的复杂表格

| 左对齐 | 居中对齐 | 右对齐 | 默认左对齐 |
| :----- | :------: | -----: | ---------- |
| 单元格 | 单元格 | 单元格 | 单元格 |
| 长文本内容演示 | 中心内容 | 数值内容 | 常规文本 |

<Spacer h={16} />

## 链接测试

这是一个[内联链接](https://www.example.com)。

这是一个[带标题的链接](https://www.example.com "悬停时显示标题")。

这是一个参考式链接：[示例网站][ref]。

[ref]: https://www.example.com "参考链接详情"

## 图片测试

![替代文本，图片无法显示时出现](https://picsum.photos/200/100 "title=图片标题,align=center")


## 自动链接

[https://www.example.com](https://www.example.com)

电子邮件：[test@example.com](mailto:test@example.com)