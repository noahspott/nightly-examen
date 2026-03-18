// Lib
import { getRandomBibleVerse } from "@/utils";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/server";

// Components
import UserStats from "@/app/dashboard/components/UserStats";
import { Main, Header, LinkButton } from "@/components/ui";
import { Quote } from "@/components/examen";

/**
 * Dashboard Page
 *
 * This dashboard page is the home for the logged-in user.
 * - displays user stats
 * - allows logout
 * - allows Examen start
 */
export default async function Dashboard() {
  const supabase = await createClient();
  const user = await getUser(supabase);

  const bibleVerse = getRandomBibleVerse();

  return (
    <Main>
      <Header />
      <div className="px-4 flex flex-col gap-8">
        <h1 className="text-3xl text-white font-bold mt-4">Dashboard</h1>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
          <UserStats userId={user.id} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Daily Wisdom</h2>
          <div className="dashboard--card">
            <Quote>
              <div className="flex flex-col gap-4">
                <p className="">{bibleVerse.text}</p>
                <div className="text-xl">
                  <p className="inline">{bibleVerse.book}</p>
                  <p className="inline">{` ${bibleVerse.chapter}`}</p>
                  <p className="inline">:</p>
                  <p className="inline">{bibleVerse.verse}</p>
                </div>
              </div>
            </Quote>
          </div>
        </div>

        <LinkButton
          href="/examen/classic"
          className="w-full button--primary--lg mb-16 mt-4"
        >
          Start Examen
        </LinkButton>
      </div>
    </Main>
  );
}
