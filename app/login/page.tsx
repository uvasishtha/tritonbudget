"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Incorrect email or password.");
        return;
      }

      router.replace("/transactions");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to log in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-12 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Organic Background Shapes */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-[45%_55%_60%_40%] bg-blue-100/70 blur-2xl" />

      <div className="pointer-events-none absolute -right-32 top-1/4 h-80 w-80 rotate-12 rounded-[60%_40%_35%_65%] bg-indigo-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 -rotate-12 rounded-[55%_45%_40%_60%] bg-sky-100/60 blur-3xl" />

      {/* Decorative Organic Outline */}
      <div className="pointer-events-none absolute right-[12%] top-[15%] h-32 w-44 rotate-12 rounded-[60%_40%_55%_45%] border border-blue-200/50" />

      <div className="group relative w-full max-w-md">

        {/* Welcome Badge */}
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:text-blue-600">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Welcome back to TritonBudget</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative w-full rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/40"
        >

          {/* Logo */}
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082f6b] shadow-md shadow-blue-900/15 transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 40 40"
                className="h-6 w-6 fill-none stroke-[#f6c343]"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 5v27" />
                <path d="M12 11v8c0 5 3 8 8 8s8-3 8-8v-8" />
                <path d="M8 11l4-5 4 5" />
                <path d="M24 11l4-5 4 5" />
                <path d="M16 8l4-5 4 5" />
                <path d="M16 32h8" />
              </svg>
            </div>

            <div>
              <span className="block text-xl font-black tracking-tight text-[#071f49]">
                Triton<span className="text-blue-700">Budget</span>
              </span>
            </div>
          </div>

          {/* Header */}
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Log in to keep your spending on track.
          </p>

          {/* Form */}
          <div className="mt-6 space-y-4">

            {/* Email */}
            <div className="group/input">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors group-focus-within/input:text-blue-700"
              >
                Email
              </label>

              <div className="relative mt-1.5">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group/input">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors group-focus-within/input:text-blue-700"
              >
                Password
              </label>

              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-14 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-medium text-red-600">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group/btn relative mt-6 w-full overflow-hidden rounded-xl bg-[#082f6b] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-all duration-200 hover:bg-[#071f49] hover:shadow-lg hover:shadow-blue-900/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <span>Log in</span>
                <span className="transition-transform duration-200 group-hover/btn:translate-x-1">
                  →
                </span>
              </span>
            )}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}