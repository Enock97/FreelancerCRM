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
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
      <div className="flex items-center space-x-6">
        <Link href="/"><span className="font-bold text-lg dark:text-white">FreelancerCRM</span></Link>
        {token && (
          <>
            <Link href="/dashboard" className="dark:text-white">Dashboard</Link>
            <Link href="/contacts" className="dark:text-white">Kontakter</Link>
            <Link href="/profile" className="dark:text-white">Profil</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 dark:text-white"
          onClick={toggleDarkMode}
        >
          {darkMode ? "☀️ Lys" : "🌙 Mørk"}
        </button>
        {token ? (
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Logg ut
          </button>
        ) : (
          <>
            <Link href="/login" className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Logg inn</Link>
            <Link href="/register" className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">Registrer</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
