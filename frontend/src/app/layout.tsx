// src/app/layout.tsx
import "../styles/globals.css";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { DarkModeProvider } from "../context/DarkModeContext";
import Navbar from "../components/Navbar";

// App router layout for Next.js 13+ (med html/body på toppnivå)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-950 min-h-screen">
        <AuthProvider>
          <DarkModeProvider>
            <Navbar />
            <main className="max-w-6xl mx-auto w-full py-8 px-2">
              {children}
            </main>
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
