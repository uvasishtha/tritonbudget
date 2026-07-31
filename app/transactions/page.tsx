"use client";

import { Raleway } from "next/font/google";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const raleway = Raleway({
  subsets: ["latin"],
});

// Describes what every transaction object must contain.
type Transaction = {
  id: number;
  amount: number;
  category: string;
  note: string;
};

// Describes one dining plan option.
type DiningPlan = {
  name: string;
  budget: number;
};

// Available Dining Dollar plans.
const diningPlans: DiningPlan[] = [
  {
    name: "Triton Gold",
    budget: 6700,
  },
  {
    name: "Triton Blue",
    budget: 5600,
  },
  {
    name: "Dining Dollars",
    budget: 4850,
  },
  {
    name: "Starter Dining Dollars",
    budget: 500,
  },
];

// Formats numbers as US dollar amounts.
function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

// Returns a simple icon based on the transaction category.
function getCategoryIcon(category: string) {
  if (category === "Transportation") {
    return "↗";
  }

  if (category === "Shopping") {
    return "◇";
  }

  return "☕";
}

// Creates the Transactions page React component.
export default function TransactionsPage() {
  // Controls whether the Add Transaction form is visible.
  const [showForm, setShowForm] = useState(false);

  // Stores the current values entered into the transaction form.
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  // Stores the currently selected Dining Dollar plan.
  const [selectedPlan, setSelectedPlan] = useState(diningPlans[0].name);

  // Stores the budget associated with the selected plan.
  const [totalBudget, setTotalBudget] = useState(diningPlans[0].budget);

  // Stores all transactions loaded from PostgreSQL.
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Tracks whether transactions are loading.
  const [isLoading, setIsLoading] = useState(true);

  // Tracks whether a new transaction is being saved.
  const [isSaving, setIsSaving] = useState(false);

  // Stores an error message when an API request fails.
  const [error, setError] = useState("");

  // Adds every transaction amount together.
  const totalSpent = transactions.reduce(
    (runningTotal, transaction) =>
      runningTotal + Number(transaction.amount),
    0,
  );

  // Calculates the remaining Dining Dollar balance.
  const remainingBudget = totalBudget - totalSpent;

  // Calculates the percentage of the budget that has been spent.
  const percentageSpent =
    totalBudget > 0
      ? Math.min((totalSpent / totalBudget) * 100, 100)
      : 0;

  // Gets all transactions from the backend.
  async function loadTransactions() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/transactions");

      if (!response.ok) {
        throw new Error("Failed to load transactions.");
      }

      const data = await response.json();

      // PostgreSQL NUMERIC values may arrive as strings,
      // so each amount is converted into a JavaScript number.
      const formattedTransactions: Transaction[] = data.map(
        (transaction: Transaction) => ({
          ...transaction,
          amount: Number(transaction.amount),
        }),
      );

      setTransactions(formattedTransactions);
    } catch (loadError) {
      console.error(loadError);
      setError("We could not load your transactions.");
    } finally {
      setIsLoading(false);
    }
  }

  // Runs once when the page first loads.
  useEffect(() => {
    loadTransactions();
  }, []);

  // Changes both the selected plan and its total budget.
  function handlePlanChange(planName: string) {
    const plan = diningPlans.find(
      (diningPlan) => diningPlan.name === planName,
    );

    if (!plan) {
      return;
    }

    setSelectedPlan(plan.name);
    setTotalBudget(plan.budget);
  }

  // Runs when the user clicks Save Transaction.
  async function handleAddTransaction() {
    const numericAmount = Number(amount);

    // Stops invalid or empty amounts from being submitted.
    if (!amount || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      // Sends the transaction to the backend POST route.
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          category,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction.");
      }

      // Reloads the list so the page matches PostgreSQL.
      await loadTransactions();

      // Resets and closes the form.
      setAmount("");
      setCategory("Food");
      setNote("");
      setShowForm(false);
    } catch (saveError) {
      console.error(saveError);
      setError("We could not save your transaction.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className={`${raleway.className} min-h-screen bg-[#f7f9fd] text-[#071f49]`}
    >

      <main className="relative overflow-hidden">
        <div className="flex justify-end p-6">
  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
  >
    Log Out
  </button>
</div>
        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-yellow-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-80 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-12">
          {/* Page introduction */}
          <section className="relative">
            <div className="absolute right-4 top-0 hidden lg:block">
              <div className="relative h-36 w-72">
                <div className="absolute right-12 top-0 h-20 w-20 rounded-full bg-[#f6c343]" />

                <svg
                  viewBox="0 0 300 130"
                  aria-hidden="true"
                  className="absolute bottom-0 h-full w-full fill-none stroke-blue-500"
                  strokeWidth="2"
                >
                  <path d="M5 85c32-30 62-30 95 0s63 30 96 0 63-30 99 0" />
                  <path d="M5 104c32-30 62-30 95 0s63 30 96 0 63-30 99 0" />
                  <path
                    d="M28 70c20-17 40-17 61 0"
                    stroke="#f6c343"
                  />
                </svg>
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#f6c343]" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                  Your dining dashboard
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#071f49] sm:text-6xl">
                Transactions
                <span className="text-[#f6c343]">.</span>
              </h1>

              <p className="mt-4 text-lg font-medium text-slate-500">
                Track your spending and make every Dining Dollar count.
              </p>
            </div>
          </section>

          {/* Dining plan selector */}
          <section className="mt-10 rounded-[28px] border border-white bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,48,98,0.10)] backdrop-blur sm:p-7">
            <div className="grid items-center gap-5 md:grid-cols-[1fr_1.6fr]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff4cc] text-2xl text-[#c68b00]">
                  $
                </div>

                <div>
                  <h2 className="font-extrabold text-[#071f49]">
                    Dining Dollar Budget
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Choose your dining plan
                  </p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedPlan}
                  onChange={(event) =>
                    handlePlanChange(event.target.value)
                  }
                  className="w-full appearance-none rounded-2xl border-2 border-blue-100 bg-[#f9fbff] px-5 py-4 pr-12 font-bold text-[#071f49] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {diningPlans.map((plan) => (
                    <option
                      key={plan.name}
                      value={plan.name}
                    >
                      {plan.name}:{" "}
                      {plan.budget.toLocaleString("en-US")} Dining
                      Dollars
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-blue-600">
                  ▼
                </span>
              </div>
            </div>
          </section>

          {/* Budget summary cards */}
          <section className="mt-7 grid gap-5 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,48,98,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,48,98,0.14)]">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500" />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                  ◫
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Total Budget
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-[#071f49]">
                    {formatMoney(totalBudget)}
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-400">
                    Dining Dollars
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-red-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,48,98,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,48,98,0.14)]">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500" />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-500">
                  ↗
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Total Spent
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-red-500">
                    {formatMoney(totalSpent)}
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-400">
                    {percentageSpent.toFixed(1)}% of your plan
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,48,98,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,48,98,0.14)]">
              <div
                className={`absolute inset-x-0 bottom-0 h-1 ${
                  remainingBudget < 0
                    ? "bg-red-500"
                    : "bg-emerald-500"
                }`}
              />

              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                    remainingBudget < 0
                      ? "bg-red-50 text-red-500"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  ✦
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Remaining
                  </p>

                  <p
                    className={`mt-2 text-3xl font-black tracking-tight ${
                      remainingBudget < 0
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {formatMoney(remainingBudget)}
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-400">
                    Dining Dollars
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Spending progress */}
          <section className="mt-6 rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-sm font-bold">
              <span className="text-slate-500">
                Plan progress
              </span>

              <span className="text-blue-700">
                {percentageSpent.toFixed(1)}% spent
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-blue-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#f6c343] transition-all duration-500"
                style={{
                  width: `${percentageSpent}%`,
                }}
              />
            </div>
          </section>

          {/* Add transaction button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
              }}
              className="group flex items-center gap-3 rounded-full bg-[#082f6b] px-8 py-4 font-extrabold text-white shadow-[0_14px_30px_rgba(8,47,107,0.25)] transition hover:-translate-y-1 hover:bg-[#0b3f8f] hover:shadow-[0_18px_40px_rgba(8,47,107,0.32)]"
            >
              <span className="text-2xl font-light text-[#f6c343]">
                {showForm ? "×" : "+"}
              </span>

              {showForm ? "Close Form" : "Add Transaction"}
            </button>
          </div>

          {/* Transaction form */}
          {showForm && (
            <section className="mx-auto mt-8 max-w-xl rounded-[28px] border border-blue-100 bg-white p-7 shadow-[0_18px_60px_rgba(15,48,98,0.12)]">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d99e00]">
                  New expense
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071f49]">
                  Add Transaction
                </h2>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="text-sm font-bold text-[#071f49]"
                >
                  Amount
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    $
                  </span>

                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    placeholder="0.00"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-[#f9fbff] py-3 pl-8 pr-4 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="category"
                  className="text-sm font-bold text-[#071f49]"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border-2 border-slate-100 bg-[#f9fbff] px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Food">Food</option>
                  <option value="Transportation">
                    Transportation
                  </option>
                  <option value="Shopping">
                    Shopping
                  </option>
                </select>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="note"
                  className="text-sm font-bold text-[#071f49]"
                >
                  Note
                </label>

                <input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="Coffee, groceries, Uber..."
                  className="mt-2 w-full rounded-2xl border-2 border-slate-100 bg-[#f9fbff] px-4 py-3 font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleAddTransaction}
                disabled={isSaving}
                className="mt-6 w-full rounded-2xl bg-[#082f6b] px-5 py-4 font-extrabold text-white transition hover:bg-[#0b3f8f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : "Save Transaction"}
              </button>
            </section>
          )}

          {/* Recent transaction list */}
          <section className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d99e00]">
                  Latest activity
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#071f49]">
                  Recent Transactions
                </h2>

                <div className="mt-3 h-1 w-12 rounded-full bg-[#f6c343]" />
              </div>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                {transactions.length} total
              </span>
            </div>

            {error && !showForm && (
              <p className="mt-5 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            {isLoading ? (
              <div className="mt-6 rounded-[28px] border border-blue-100 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                <p className="mt-4 font-semibold text-slate-500">
                  Loading transactions...
                </p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-blue-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4cc] text-2xl">
                  ✦
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-[#071f49]">
                  No transactions yet
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Your recent Dining Dollar purchases will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_60px_rgba(15,48,98,0.09)]">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="group flex items-center justify-between gap-5 border-b border-slate-100 px-5 py-5 transition last:border-b-0 hover:bg-blue-50/50 sm:px-7"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4cc] font-black text-[#b77c00]">
                        {getCategoryIcon(
                          transaction.category,
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-[#071f49]">
                          {transaction.note ||
                            "Untitled transaction"}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-400">
                          {transaction.category}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-black text-[#071f49]">
                        -{formatMoney(transaction.amount)}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        Dining Dollars
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-14 bg-[#082f6b]">
        <div className="h-1 bg-[#f6c343]" />

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-7 text-sm font-semibold text-white/80 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-[#f6c343]">♆</span>
            <span>Triton Budget</span>
          </div>

          <p>
            Spend smart. Live well.
            <span className="ml-2 text-[#f6c343]">
              ✦
            </span>
          </p>

          <p className="text-white/60">
            Make every dollar count.
          </p>
        </div>
      </footer>
    </div>
  );
}