"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading }] = useMutation(LOGIN);
    const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ variables: { email, password } });
      const token = res.data?.login?.token;
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
          disabled={loading}
        >
          {loading ? "Logger inn..." : "Logg inn"}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">Feil e-post eller passord</div>}
      </form>
    </div>
  );
};

export default LoginPage;
