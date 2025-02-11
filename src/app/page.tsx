// app/page.tsx - Home Page

// Utils
import { getGreeting } from "@/utils/greeting";

// Components
import UserStats from "@/components/UserStats";
import Button from "@/components/Button";

export default function Home() {
  const greeting = getGreeting();

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      {/* Greeting */}
      <h2 className="text-xl font-bold my-4">{greeting}</h2>

      {/* User Stats */}
      <UserStats />

      {/* Start Examen Button */}
      <div className="flex justify-center mt-8">
        <Button href="/examen">Start Examen</Button>
      </div>
    </div>
  );
}