import { describe, expect, test, jest, beforeEach, it } from "@jest/globals";
import { resetUserStreak } from "../lib/userStreakUtils";

describe("resetUserStreak", () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully reset user streak", async () => {
    mockSupabase.eq.mockResolvedValueOnce({ error: null });

    await resetUserStreak(mockSupabase as any, "test-user-id");

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockSupabase.update).toHaveBeenCalledWith({ examen_streak: 0 });
    expect(mockSupabase.eq).toHaveBeenCalledWith("id", "test-user-id");
  });

  it("should throw error when update fails", async () => {
    mockSupabase.eq.mockResolvedValueOnce({
      error: new Error("Database error"),
    });

    await expect(
      resetUserStreak(mockSupabase as any, "test-user-id"),
    ).rejects.toThrow("Error resetting userStreak");
  });
});
