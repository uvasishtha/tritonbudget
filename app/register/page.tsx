"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setError("Something went wrong.");
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
          Create an account
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Start tracking your spending.
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            minLength={8}
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
          className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-700">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}