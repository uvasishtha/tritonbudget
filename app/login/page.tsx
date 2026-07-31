"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Log in
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Welcome back to Triton Budget.
        </p>

        <div className="mt-6">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            autoComplete="email"
            required
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-700"
          >
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}