import {
  describe,
  expect,
  test,
  jest,
  beforeAll,
  afterAll,
} from "@jest/globals";
import {
  calculateNewStreak,
  getTodayString,
  getYesterdayString,
  formatDateToString,
} from "../lib/userStreakUtils";
import { DatabaseSession } from "../types/types";

describe("calculateNewStreak", () => {
  test("New user, no sessions should return 0", () => {
    const sessions: DatabaseSession[] = [];
    const currentStreak = 0;
    const lastStreakIncrement = undefined;

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(0);
  });

  test("User completes their first session - should return 1", () => {
    const sessions: DatabaseSession[] = [{ completed_at: getTodayString() }];
    const currentStreak = 0;
    const lastStreakIncrement = undefined;

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(1);
  });

  test("User arrives at dashboard. They completed their first session yesterday. The function should return 1", () => {
    const sessions: DatabaseSession[] = [
      { completed_at: getYesterdayString() },
    ];
    const currentStreak = 1;
    const lastStreakIncrement = getYesterdayString();

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(1);
  });

  test("User completed their first session yesterday. The function should return 1", () => {
    const sessions: DatabaseSession[] = [
      { completed_at: getYesterdayString() },
    ];
    const currentStreak = 1;
    const lastStreakIncrement = getYesterdayString();

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(1);
  });

  test("User just completed a session today. They also completed 1 session yesterday. The function should return 2", () => {
    const sessions: DatabaseSession[] = [
      { completed_at: getTodayString() },
      { completed_at: getYesterdayString() },
    ];
    const currentStreak = 1;
    const lastStreakIncrement = getYesterdayString();

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(2);
  });

  test("User just completed a session today. They also completed a session 2 days ago. The function should return 1", () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoString = formatDateToString(twoDaysAgo);

    const sessions: DatabaseSession[] = [
      { completed_at: getTodayString() },
      { completed_at: twoDaysAgoString },
    ];
    const currentStreak = 1;
    const lastStreakIncrement = twoDaysAgoString;

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(1);
  });

  test("User had a streak, but missed a day. They completed 2 sessions. The function should return 0", () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoString = formatDateToString(twoDaysAgo);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoString = formatDateToString(threeDaysAgo);

    const sessions: DatabaseSession[] = [
      { completed_at: twoDaysAgoString },
      { completed_at: threeDaysAgoString },
    ];
    const currentStreak = 2;
    const lastStreakIncrement = twoDaysAgoString;

    expect(
      calculateNewStreak(sessions, currentStreak, lastStreakIncrement),
    ).toBe(0);
  });
});
