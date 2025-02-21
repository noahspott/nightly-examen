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
import { User } from "@supabase/supabase-js";

export class AuthService {
  // Singleton pattern: Ensures only one instance of AuthService exists
  // This is useful for maintaining a single source of truth for auth state
  private static instance: AuthService;
  // Caches the current user to avoid unnecessary API calls
  private currentUser: User | null = null;

  constructor() {
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        this.currentUser = null;
      } else if (session?.user) {
        this.currentUser = session.user;
      }
    });
  }

  // Singleton implementation: Private constructor prevents direct instantiation
  // Public static method provides controlled access to the single instance
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Implements passwordless authentication using One-Time Password (OTP)
   * @param email - The user's email address where the OTP will be sent
   * @param redirectUrl - The URL where the user will be redirected after email verification
   * @returns Promise containing either the authentication data or an error
   * @throws {Error} If the email format is invalid
   * @example
   * ```typescript
   * const { data, error } = await authService.signInWithOTP(
   *   'user@example.com',
   *   'https://your-app.com/auth/callback'
   * );
   * ```
   */
  async signInWithOTP(email: string, redirectUrl: string) {
    try {
      // Basic email validation before making API call
      if (!email || !email.includes("@")) {
        throw new Error("Invalid email format");
      }

      // Audit logging for security tracking
      this.logAuthAttempt("otp", email);

      // Supabase handles sending the OTP email
      // The email will contain a link that redirects to your specified URL
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      // Hook for additional success processing
      await this.handleSuccessfulAuthAttempt(email);

      // Return standardized response format
      return { data, error: null };
    } catch (error) {
      // Error handling with consistent format
      const formattedError = this.formatAuthError(error);
      return { data: null, error: formattedError };
    }
  }

  // Verifies the OTP token received via email
  // This is typically called after the user clicks the email link
  async verifyOTP(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email", // Specifies this is an email-based OTP
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { data: null, error };
    }
  }

  // Handles user logout by clearing the session
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Gets the current user, implementing a caching strategy to minimize API calls.
   * Flow:
   * 1. Check if we have a cached user
   * 2. If cached, verify their session is still valid
   * 3. If no cache or invalid session, fetch fresh user data
   * @returns Promise<User | null> - The current user or null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    console.log("getCurrentUser: Starting method", {
      hasCachedUser: !!this.currentUser,
      cachedUserEmail: this.currentUser?.email,
    });

    // Step 1: Check cached user
    if (this.currentUser) {
      console.log(
        "getCurrentUser: Found cached user, verifying session validity",
      );

      // Step 2: Verify session is still valid
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("getCurrentUser: Session check result", {
        hasValidSession: !!session,
        sessionExpiry: session?.expires_at,
      });

      if (!session) {
        console.log("getCurrentUser: Session invalid, clearing cached user");
        this.currentUser = null;
      } else {
        console.log("getCurrentUser: Session valid, using cached user");
      }
    }

    // Step 3: Fetch fresh data if needed
    if (!this.currentUser) {
      console.log("getCurrentUser: No valid cached user, fetching fresh data");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("getCurrentUser: Fresh user data result", {
        userFound: !!user,
        userEmail: user?.email,
        userMetadata: user?.user_metadata,
      });

      this.currentUser = user;
    }

    console.log("getCurrentUser: Returning result", {
      isAuthenticated: !!this.currentUser,
      userEmail: this.currentUser?.email,
    });

    return this.currentUser;
  }

  /**
   * Checks if a user is currently authenticated
   * @returns Promise<boolean> - True if user is authenticated, false otherwise
   * @example
   * ```typescript
   * if (await authService.isAuthenticated()) {
   *   // Handle authenticated user
   * } else {
   *   // Handle unauthenticated user
   * }
   * ```
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Private utility methods for internal use

  // Logs authentication attempts for security auditing
  private logAuthAttempt(method: string, identifier: string) {
    console.log(`Auth attempt: ${method} - ${identifier}`);
  }

  // Hook for adding custom logic after successful authentication
  // Could be used for analytics, user onboarding, etc.
  private async handleSuccessfulAuthAttempt(identifier: string) {
    // Add success handling logic (e.g., update local storage, trigger events)
  }

  // Standardizes error format across the service
  // Makes error handling consistent for consumers of this service
  private formatAuthError(error: any) {
    return {
      code: error.code || "UNKNOWN_ERROR",
      message: error.message || "An unknown error occurred",
      originalError: error,
    };
  }
}

// Export a singleton instance for use throughout the application
export const authService = AuthService.getInstance();
