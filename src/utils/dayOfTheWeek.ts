export function getDayOfWeek(index: number, size: "sm" | "md") {
  const days = {
    sm: ["S", "M", "T", "W", "T", "F", "S"],
    md: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  };

  return days[size][index];
}
