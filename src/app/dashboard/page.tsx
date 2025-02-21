// app/page.tsx - Home Page

// Auth
import { authService } from "@/lib/auth/authService";

// Utils
import { getGreeting } from "@/utils/greeting";

// Components
import UserStats from "@/components/UserStats";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const greeting = getGreeting();

  const isAuthenticated = await authService.isAuthenticated();

  if (!isAuthenticated) {
    console.log("not authenticated");
  } else {
    console.log("authenticated");
  }

  return (
    <>
      <Header />
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
    </>
  );
}
