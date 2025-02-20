// app/page.tsx - Landing Page

export default function Home() {
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
          <a
            href="/examen"
            className="text-lg w-full  px-6 py-3 bg-white/10 text-white 
                     hover:bg-white/20 transition-colors duration-200 
                      font-medium rounded-full"
          >
            Start Examen
          </a>
          <a
            href="/login"
            className="text-lg w-full px-6 py-3 border-2 border-white text-white 
                     hover:bg-white/20 transition-colors duration-200 
                      font-medium rounded-full"
          >
            Sign up
          </a>
        </div>
      </div>
      <p className=" text-white/50 max-w-md mx-auto mt-24 px-4 text-center">
        *Your reflections are private. Any information you enter exists only in
        the browser only for the duration of your Examen.
      </p>
    </main>
  );
}
