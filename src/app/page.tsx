import LinkButton from "@/components/ui/LinkButton";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/server";

/**
 * Landing Page (Home)
 *
 * The main marketing page for NightlyExamen. Presents the app's core value proposition
 * and primary call-to-action buttons for starting an examen or signing up.
 *
 * @route / (root)
 * @component Home
 * @returns React component rendering the landing page layout
 */
export default async function Home() {
  const supabase = await createClient();
  const user = await getUser(supabase);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center text-center gap-8">
        <h1 className="text-white text-4xl sm:text-5xl font-bold mt-24">
          NightlyExamen
        </h1>
        <p className="text-white/70 text-xl max-w-md mx-auto">
          The nightly examen journaling app for Christians looking to grow in
          their faith.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ">
          <LinkButton href="/examen/classic" className="w-full">
            Start Examen
          </LinkButton>
          <LinkButton
            href={!user ? "/login" : "/dashboard"}
            className="w-full"
            variant="secondary"
          >
            {!user ? "Sign up" : "Dashboard"}
          </LinkButton>
        </div>
      </div>
      <p className=" text-white/50 max-w-md mx-auto mt-24 px-4 text-center">
        *Your reflections are private. Any information you enter exists only in
        the browser only for the duration of your Examen.
      </p>
    </main>
  );
}
