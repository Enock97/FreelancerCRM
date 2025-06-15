"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const LOGIN_URL = `${API_URL}/api/auth/login`;


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  try {
    const res = await fetch(`${LOGIN_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Feil e-post eller passord");
    }

    const data = await res.json();
    const token = data.token;
    if (token) {
      setToken(token);
      router.push("/dashboard");
    }
      } catch (err) {
        console.error("Login error:", err);
        setError("Kunne ikke logge inn. Feil e-post eller passord. Prøv igjen.");
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-3 min-w-[280px]">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Logg inn</h2>
        <input
          type="email"
          className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:text-white"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:text-white"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Logg inn
        </button>
        {error && <div className="text-red-500 text-sm mt-2">Feil e-post eller passord</div>}
      </form>
    </div>
  );
};

export default LoginPage;
