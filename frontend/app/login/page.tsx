'use client';
import { apiLogin } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import React, { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiLogin(username, password);
      saveToken(data.access_token);
      window.location.href = "/analyze";
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto mt-10">
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;