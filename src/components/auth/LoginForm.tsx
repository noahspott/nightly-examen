"use client";

import { useState } from "react";
import { signInWithOtp, verifyOtp } from "@/app/login/actions";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState(""); 
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await signInWithOtp(email);

      if (error) {
        const errorMessage = String(error);
        const isEmailRateLimit =
          errorMessage.toLowerCase().includes("email rate limit exceeded");

        console.error("Failed to send OTP:", errorMessage);
        setMessage({
          type: "error",
          text: isEmailRateLimit
            ? "Too many sign-in requests for this email. Please wait a few minutes and try again."
            : "Failed to send OTP. Please try again.",
        });
        return;
      }

      setShowOtpInput(true);
      setMessage({
        type: "success",
        text: "Check your email for the verification code!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP.";
      const isEmailRateLimit =
        errorMessage.toLowerCase().includes("email rate limit exceeded");

      console.error("Failed to send OTP (unexpected):", errorMessage);
      setMessage({
        type: "error",
        text: isEmailRateLimit
          ? "Too many sign-in requests for this email. Please wait a few minutes and try again."
          : "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log("[OTP Verification] Starting verification process", {
      email,
      otpLength: otpCode.length,
    });

    const { error } = await verifyOtp(email, otpCode);

    if (error) {
      console.error("[OTP Verification] Error details:", {
        error,
        email,
        otpLength: otpCode.length,
        timestamp: new Date().toISOString(),
      });
      setMessage({
        type: "error",
        text: "Invalid code. Please try again.",
      });
      setLoading(false);
      return;
    }

    setMessage({
      type: "success",
      text: "Verification successful! Redirecting...",
    });

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={showOtpInput ? handleVerifyOtp : handleRequestOtp}
      className="space-y-8 w-full max-w-md"
    >
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
          disabled={showOtpInput}
        />
      </div>

      {showOtpInput && (
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium text-white/90">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otpCode}
            onChange={(e) =>
              setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 
                       rounded-md text-white tracking-widest font-mono"
            placeholder="123456"
            required
            pattern="\d{6}"
          />
        </div>
      )}

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
        {loading
          ? showOtpInput
            ? "Verifying..."
            : "Sending code..."
          : showOtpInput
            ? "Verify Code"
            : "Send Code"}
      </Button>
    </form>
  );
}
