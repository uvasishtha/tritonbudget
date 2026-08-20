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

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
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
    <div className="flex min-h-screen bg-slate-900 font-sans text-slate-100">
      {/* Left Column - Branding & Highlights */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-12 lg:flex">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/30">
              ⚡
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Triton<span className="text-blue-400">Budget</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
            Smart financial tracking, effortless receipt logging.
          </h1>
          <p className="text-lg text-slate-300">
            Forward your receipt emails or upload receipts directly to match
            your transactions automatically in real-time.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                ✓
              </div>
              <div>
                <p className="font-semibold text-white">Automatic Email Parsing</p>
                <p className="text-sm text-slate-400">
                  Receipts emailed before registration are automatically claimed when you sign up.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                ✓
              </div>
              <div>
                <p className="font-semibold text-white">AI-Powered Breakdown</p>
                <p className="text-sm text-slate-400">
                  Instant categorization of your spending habits and monthly targets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Triton Budget. All rights reserved.
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                ⚡
              </div>
              <span className="text-lg font-bold text-white">
                Triton<span className="text-blue-400">Budget</span>
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Get started with your free Triton Budget workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Triton"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-white placeholder-slate-500 transition duration-150 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-white placeholder-slate-500 transition duration-150 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 pr-12 text-white placeholder-slate-500 transition duration-150 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 1 ? "w-1/4 bg-red-500" : "w-0"
                      }`}
                    />
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength >= 2 ? "w-1/4 bg-yellow-500" : "w-0"
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
                  <p className="text-xs text-slate-400">
                    {strength <= 1 && "Weak password"}
                    {strength === 2 && "Fair password"}
                    {strength === 3 && "Good password"}
                    {strength === 4 && "Strong password"}
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-150 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}