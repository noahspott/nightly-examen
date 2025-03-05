"use client";

import { useState } from "react";
import { signInWithOtp, verifyOtp } from "@/app/login/actions";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  // State management using React hooks
  // Each useState creates a state variable and its setter function
  const [email, setEmail] = useState(""); // Stores user's email
  const [otpCode, setOtpCode] = useState(""); // Stores the OTP entered by user
  const [loading, setLoading] = useState(false); // Tracks loading state during API calls
  const [showOtpInput, setShowOtpInput] = useState(false); // Controls OTP input visibility

  // Complex state for showing feedback messages to the user
  // Type definition ensures message can only be 'success' or 'error'
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Handler for the initial OTP request
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior
    setLoading(true); // Show loading state
    setMessage(null); // Clear any existing messages

    // Attempt to send OTP to user's email
    const { error } = await signInWithOtp(email);

    if (error) {
      // Handle error case
      console.error("Failed to send OTP:", error);
      setMessage({
        type: "error",
        text: "Failed to send OTP. Please try again.",
      });
    } else {
      // Success case: Show OTP input and success message
      setShowOtpInput(true);
      setMessage({
        type: "success",
        text: "Check your email for the verification code!",
      });
    }

    setLoading(false); // Reset loading state
  };

  // Handler for OTP verification
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

    // Handle success case
    setMessage({
      type: "success",
      text: "Verification successful! Redirecting...",
    });

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <form
      // Dynamically choose handler based on current form state
      onSubmit={showOtpInput ? handleVerifyOtp : handleRequestOtp}
      className="space-y-8 w-full max-w-md"
    >
      {/* Email input field */}
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

      {/* Conditional rendering of OTP input */}
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
            pattern="\d{6}" // Ensures exactly 6 digits
          />
        </div>
      )}

      {/* Conditional rendering of success/error messages */}
      {message && (
        <p
          className={`text-sm ${
            message.type === "error" ? "text-red-400" : "text-green-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Dynamic button text based on current state */}
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
