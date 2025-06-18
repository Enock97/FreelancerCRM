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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Could not register your user. Try again.");

      const data = await res.json();
      const token = data.token;
      if (token) {
        setToken(token);
        router.push("/dashboard");
      }
    } catch (err) {
        console.error("Registering error:", err);
      setError("Could not register your user. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-4 min-w-[300px] border border-gray-100 dark:border-gray-700 transition-colors"
      >
        <h2 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white text-center">Registrer deg</h2>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-400"
          placeholder="E-post"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Passord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          Register
        </button>
        {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
