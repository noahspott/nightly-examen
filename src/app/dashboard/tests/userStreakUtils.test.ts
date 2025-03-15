import {
  describe,
  expect,
  test,
  jest,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { calculateNewStreak } from "../lib/userStreakUtils";
import { DatabaseSession } from "../types/types";

describe("calculateNewStreak", () => {
  // Helper to create a session at a specific date
  const createSession = (dateString: string): DatabaseSession => ({
    completed_at: new Date(dateString).toISOString(),
    // Add other required DatabaseSession properties with dummy values
  });

  // Mock today's date to make tests deterministic
  const TODAY = "2024-03-15";
  const YESTERDAY = "2024-03-14";
  const TWO_DAYS_AGO = "2024-03-13";

  beforeAll(() => {
    // Mock Date.now() to return a fixed date
    jest.useFakeTimers();
    jest.setSystemTime(new Date(TODAY));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("returns 0 when no sessions exist", async () => {
    const result = calculateNewStreak([], 5);
    expect(result).toBe(0);
  });

  test("returns 0 when sessions is null or undefined", async () => {
    const result = calculateNewStreak(null as any, 5);
    expect(result).toBe(0);
  });

  describe("single session scenarios", () => {
    test("returns 1 when single session is today", async () => {
      const sessions = [createSession(TODAY)];
      const result = calculateNewStreak(sessions, 0);
      expect(result).toBe(1);
    });

    test("returns 0 when single session is from yesterday", async () => {
      const sessions = [createSession(YESTERDAY)];
      const result = calculateNewStreak(sessions, 5);
      expect(result).toBe(0);
    });
  });

  describe("two sessions scenarios", () => {
    test("maintains streak when both sessions are today", async () => {
      const sessions = [createSession(TODAY), createSession(TODAY)];
      const currentStreak = 5;
      const result = calculateNewStreak(sessions, currentStreak);
      expect(result).toBe(currentStreak);
    });

    test("increments streak when sessions are from today and yesterday", async () => {
      const sessions = [createSession(TODAY), createSession(YESTERDAY)];
      const currentStreak = 5;
      const result = calculateNewStreak(sessions, currentStreak);
      expect(result).toBe(currentStreak + 1);
    });

    test("resets to 1 when latest is today but previous is older than yesterday", async () => {
      const sessions = [createSession(TODAY), createSession(TWO_DAYS_AGO)];
      const result = calculateNewStreak(sessions, 5);
      expect(result).toBe(1);
    });

    test("resets to 0 when latest session is not today", async () => {
      const sessions = [createSession(YESTERDAY), createSession(TWO_DAYS_AGO)];
      const result = calculateNewStreak(sessions, 5);
      expect(result).toBe(0);
    });
  });
});
