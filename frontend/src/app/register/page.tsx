"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const REGISTER_URL = `${API_URL}/api/auth/register`;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  try {
    const res = await fetch(`${REGISTER_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Kunne ikke registrere din bruker. Prøv igjen.");
    }

    const data = await res.json();
    const token = data.token;
    if (token) {
      setToken(token);
      router.push("/dashboard");
    }
      } catch (err) {
        console.error("Registrerings error:", err);
        setError("Kunne ikke registrere din bruker. Prøv igjen.");
      }
    };


  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-3 min-w-[280px]">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Registrer deg</h2>
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
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Registrer
        </button>
        {error && <div className="text-red-500 text-sm mt-2">Noe gikk galt – prøv igjen</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
