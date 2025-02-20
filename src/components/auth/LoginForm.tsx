"use client";

import { useState } from "react";
import { authService } from "@/lib/auth/authService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await authService.signInWithOTP(email);

    if (error) {
      setMessage({
        type: "error",
        text: "Failed to send magic link. Please try again.",
      });
    } else {
      setMessage({
        type: "success",
        text: "Check your email for the magic link!",
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white/90">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 
                     rounded-md text-white"
          placeholder="you@example.com"
          required
        />
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-6 rounded-full  font-medium text-black bg-white disabled:opacity-50"
      >
        {loading ? "Sending magic link..." : "Login"}
      </button>
    </form>
  );
}
