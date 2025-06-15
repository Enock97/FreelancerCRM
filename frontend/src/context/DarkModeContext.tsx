"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Init once: check localStorage, else system preference
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("darkMode") : null;
    if (saved !== null) {
      setDarkMode(saved === "true");
    } else if (typeof window !== "undefined") {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Toggle html class & save preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within a DarkModeProvider");
  return ctx;
};
