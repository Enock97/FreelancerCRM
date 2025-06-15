"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white select-none">FreelancerCRM</span>
        </Link>
        {token && (
          <>
            <Link href="/dashboard" className="font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4">Dashboard</Link>
            <Link href="/contacts" className="font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4">Kontakter</Link>
            <Link href="/profile" className="font-medium text-gray-800 dark:text-gray-200 hover:underline underline-offset-4">Profil</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <button
          className="text-lg px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleDarkMode}
          aria-label="Bytt mellom mørk og lys modus"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        {token ? (
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Logg ut
          </button>
        ) : (
          <>
            <Link href="/login" className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">Logg inn</Link>
            <Link href="/register" className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors">Registrer</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
