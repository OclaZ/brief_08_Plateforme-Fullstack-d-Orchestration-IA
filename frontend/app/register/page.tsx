"use client";

import React, { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          createdat: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // FASTAPI RETURNS DIFFERENT SHAPES:
        // detail: "string"
        // detail: [{ msg: "...", loc: [...], input: ... }]
        let message = "Unknown error";

        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail[0].msg || "Invalid input";
        }

        setError(message);
        return;
      }

      setMessage("Account created successfully!");
      setUsername("");
      setPassword("");

    } catch (err) {
      setError("Network or server error");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-10">

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {message && <p className="text-green-600 mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>Username</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
