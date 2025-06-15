"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setDarkMode(saved === "true");
      console.log("Console Log: console.log(' saved !== null: ' + darkMode): Output: " + darkMode)
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(systemDark);
      console.log("Console Log: console.log(' saved === null: ' + darkMode): Output: " + darkMode)
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode, mounted]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  if (!mounted) return null;

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
