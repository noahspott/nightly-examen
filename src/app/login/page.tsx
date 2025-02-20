import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center gap-6 mb-6">
        <h1 className="text-4xl font-medium">Log in or sign up</h1>
      </div>
      <LoginForm />

      <p className="text-center text-sm text-white/50 mt-4">
        You'll receive a link to sign in
      </p>
    </main>
  );
}
