import { createContext, useContext, useEffect, useState } from "react";
import { getTheme } from "./rankTheme";

const ThemeContext = createContext(null);

export function ThemeProvider({ rank, children }) {
  const theme = getTheme(rank || "F");

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color",      theme.color);
    root.style.setProperty("--color-dim",  theme.colorDim);
    root.style.setProperty("--bg",         theme.bg);
    root.style.setProperty("--bg-panel",   theme.bgPanel);
    root.style.setProperty("--border",     theme.border);
    root.style.setProperty("--border-dim", theme.borderDim);
    root.style.setProperty("--glow",       theme.glow);
    root.style.setProperty("--grid-color", theme.gridColor);
    document.body.style.background = theme.bg;
  }, [rank, theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext) || getTheme("F");
}