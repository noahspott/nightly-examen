import { describe, expect, test } from "@jest/globals";
import { getStartOfWeek } from "../lib/weekStatsUtils";

describe("\n\n______________________\n\ngetStartOfWeek module", () => {
  test("Returns Date object for Sunday, March 9, 2025 @ 0 AM when given Date object for Wednesday, March 12, 2025", () => {
    const wednesday = new Date(2025, 2, 12);

    const sunday = new Date(2025, 2, 9);
    sunday.setHours(0, 0, 0, 0);

    expect(getStartOfWeek(wednesday)).toStrictEqual(sunday);
  });
  test("Returns Date object for Sunday, March 9, 2025 @ 0 AM when given Date object for Sunday, March 9, 2025", () => {
    const sunday = new Date(2025, 2, 9);
    sunday.setHours(0, 0, 0, 0);

    expect(getStartOfWeek(sunday)).toStrictEqual(sunday);
  });
  test("Returns Date object for Sunday, March 9, 2025 @ 0 AM when given Date object for Saturday, March 15, 2025", () => {
    const sunday = new Date(2025, 2, 9);
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(2025, 2, 15);

    expect(getStartOfWeek(sunday)).toStrictEqual(sunday);
  });
});
