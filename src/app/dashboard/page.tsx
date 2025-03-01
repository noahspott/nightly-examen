// Utils
import { getGreeting } from "@/utils/greeting";

// Components
import UserStats from "@/components/UserStats";
import LinkButton from "@/components/ui/LinkButton";
import Header from "@/components/ui/Header";

/**
 * Dashboard Page
 *
 * This dashboard page is the home for the logged-in user.
 * - displays user stats
 * - allows logout
 * - allows Examen start
 */
export default function Dashboard() {
  const greeting = getGreeting();

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
          <LinkButton href="/examen/classic">Start Examen</LinkButton>
        </div>
      </div>
    </>
  );
}
