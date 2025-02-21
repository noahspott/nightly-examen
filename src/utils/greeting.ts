export function getGreeting() {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 12) return "Good morning";
  if (hours < 18) return "Good afternoon";
  return "Good evening";
}
