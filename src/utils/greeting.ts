export function getGreeting() {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
}
