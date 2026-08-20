"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Live Password Strength Gauge
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background Subtle Gradient Glows */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

      {/* Main Form Card Container with Hover Lift & Glow */}
      <div className="group relative w-full max-w-md">
        {/* Floating Interactive Feature Pill above Card */}
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:text-blue-600">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Auto-claims past emailed receipts instantly</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative w-full rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/40"
        >
          {/* Header with Navbar Trident Logo */}
          <div className="flex items-center gap-3 mb-2">
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
              <span className="text-xl font-black text-[#071f49] tracking-tight block">
                Triton<span className="text-blue-700">Budget</span>
              </span>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start tracking your spending and auto-logging transactions.
          </p>

          {/* Form Fields */}
          <div className="mt-6 space-y-4">
            {/* Name Input */}
            <div className="group/input">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 group-focus-within/input:text-blue-700 transition-colors">
                Name
              </label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Triton"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group/input">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 group-focus-within/input:text-blue-700 transition-colors">
                Email
              </label>
              <div className="relative mt-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group/input">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 group-focus-within/input:text-blue-700 transition-colors">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-14 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Minimal Strength Indicator on Typing */}
              {password && (
                <div className="mt-2 space-y-1.5 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 1 ? "w-1/4 bg-red-500" : "w-0"
                      }`}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 2 ? "w-1/4 bg-amber-500" : "w-0"
                      }`}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 3 ? "w-1/4 bg-blue-500" : "w-0"
                      }`}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 4 ? "w-1/4 bg-emerald-500" : "w-0"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    {strength <= 1 && "Weak - add numbers or symbols"}
                    {strength === 2 && "Fair password"}
                    {strength === 3 && "Good password"}
                    {strength === 4 && "Strong password"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Container */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 border border-red-100 text-xs font-medium text-red-600 animate-shake">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Magnetic Hover Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group/btn relative mt-6 w-full overflow-hidden rounded-xl bg-[#082f6b] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-all duration-200 hover:bg-[#071f49] hover:shadow-lg hover:shadow-blue-900/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
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
                Creating account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <span>Create account</span>
                <span className="transition-transform duration-200 group-hover/btn:translate-x-1">
                  →
                </span>
              </span>
            )}
          </button>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}