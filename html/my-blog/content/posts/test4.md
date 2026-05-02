---
title: "代码与数学：在博客中写技术内容"
date: "2026-05-01"
excerpt: "包含代码示例与 LaTeX 公式的实用写法。"
readTime: "6 min read"
---

# 代码与数学公式测试

## 代码块

### 无语言标识
```
这是一个通用代码块
可以直接展示原始文本
  保留缩进格式
```

### JavaScript 语法高亮
```javascript
function greet(name) {
  // 这是一个注释
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet('World');
```

### Python 语法高亮
```python
def fibonacci(n):
    """返回斐波那契数列的第n项"""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fibonacci(i) for i in range(10)])
```

## 数学公式 (LaTeX)

如果渲染器支持，行内公式：$E = mc^2$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\frac{d}{dx} \left( \int_{a}^{x} f(t)\, dt \right) = f(x)
$$

矩阵示例：

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$
