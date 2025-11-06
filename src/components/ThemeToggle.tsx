import React, { useEffect, useState } from "react";

const STORAGE_KEY = "signal-decoder-theme";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return (v === "light" ? "light" : "dark");
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light-theme", "dark-theme");
    root.classList.add(theme === "light" ? "light-theme" : "dark-theme");
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      type="button"
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* small brain icon SVG + label */}
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
        <path fill="currentColor" d="M12 2C8 2 5.5 4.5 5.5 7.5 5.5 9 6.2 10.2 7.3 11 6.5 11.6 6 12.5 6 13.5 6 15 7.5 16.5 9.5 16.5h.5v1.5C10 19.9 11.1 21 12.5 21c1.4 0 2.5-1.1 2.5-2.5V16.5h.5c2 0 3.5-1.5 3.5-3.5 0-1-.5-1.9-1.2-2.5 1.1-.8 1.8-2 1.8-3.5C18.5 4.5 16 2 12 2z"/>
      </svg>
      <span className="theme-toggle-label">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
