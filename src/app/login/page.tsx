"use client";
import { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean>(true);

  useEffect(() => {
    const checkCookieSupport = () => {
      try {
        // Try to set a test cookie
        document.cookie = "cookieTest=1";
        const cookieEnabled = document.cookie.indexOf("cookieTest") !== -1;

        // Clean up the test cookie
        document.cookie = "cookieTest=1; expires=Thu, 01 Jan 1970 00:00:01 GMT";

        setCookiesEnabled(cookieEnabled);
      } catch (e) {
        setCookiesEnabled(false);
      }
    };

    checkCookieSupport();
  }, []);

  // Check for error parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      console.error("Authentication error:", errorDescription);
      // You could set an error state here to show to the user
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center gap-6 mb-6">
        <h1 className="text-4xl font-medium">Log in or sign up</h1>
        {!cookiesEnabled && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
            Our auth system relies on cookies to keep you logged in. Please
            enable cookies in your browser to use this application.
          </div>
        )}
      </div>

      {cookiesEnabled ? (
        <>
          <LoginForm />
          <p className="text-center text-sm text-white/50 mt-4">
            Enter your email to receive a verification code
          </p>
          <div className="text-center text-xs text-white/30 mt-2">
            The code will expire in 10 minutes
          </div>
        </>
      ) : null}
    </main>
  );
}

// export function Loading() {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-8 h-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin" />
//         <p className="text-white/50">Verifying your login...</p>
//       </div>
//     </div>
//   );
// }
