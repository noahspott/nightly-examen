/**
 * @fileoverview Auth service for the application.
 * @module src/lib/auth/authService
 *
 * @description
 * This service provides methods for signing in with OTP, verifying OTPs,
 * and signing out.
 *
 */

import { supabase } from "@/lib/supabase/client";

export class AuthService {
  async signInWithOTP(email: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("OTP sign-in error:", error);
      return { data: null, error };
    }
  }

  async verifyOTP(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { data: null, error };
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
}

export const authService = new AuthService();
