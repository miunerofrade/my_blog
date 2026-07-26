"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  getContrastingForeground,
  type ThemeColor,
} from "@/lib/theme";

const ArticleThemeContext = createContext<ThemeColor | undefined>(undefined);

export function useArticleTheme() {
  return useContext(ArticleThemeContext);
}

export default function ArticleTheme({
  children,
  theme,
}: {
  children: ReactNode;
  theme?: ThemeColor;
}) {
  const foreground = theme ? getContrastingForeground(theme) : undefined;

  return (
    <ArticleThemeContext.Provider value={theme}>
      {theme && (
        <style data-article-theme={theme}>
          {`:root { --accent-color: ${theme}; --accent-foreground-color: ${foreground}; }`}
        </style>
      )}
      {children}
    </ArticleThemeContext.Provider>
  );
}
