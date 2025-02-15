// app/page.tsx - Landing Page

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-30 animate-gradient bg-gradient-radial from-gray-900 via-purple-900/30 to-black" />
      </div>

      <div className="relative text-center space-y-6 z-10">
        <h1 className="text-white text-4xl sm:text-5xl font-bold">
          NightlyExamen
        </h1>
        <p className="text-white/70 text-xl max-w-md mx-auto">
          The nightly examen journaling app for Christians looking to grow in
          their faith.
        </p>
        <a
          href="/examen"
          className="inline-block text-lg px-8 py-3 bg-white/10 text-white 
                     hover:bg-white/20 transition-colors duration-200 
                      font-medium"
        >
          Start Examen
        </a>
      </div>
    </main>
  );
}
