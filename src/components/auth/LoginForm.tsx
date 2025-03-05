"use client";

import { useState } from "react";
import { signInWithEmail } from "@/app/login/actions";
import { Button } from "@/components/ui";

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

    const { data, error } = await signInWithEmail(email);

    if (error) {
      console.log("signInWithEmail error: ", error);
      setMessage({
        type: "error",
        text: "Failed to send magic link. Please try again.",
      });
    } else {
      console.log("singInWithEmail data: ", data);
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

      <Button
        type="submit"
        disabled={loading}
        className="w-full disabled:opacity-50 button--primary"
      >
        {loading ? "Sending magic link..." : "Login"}
      </Button>
    </form>
  );
}
