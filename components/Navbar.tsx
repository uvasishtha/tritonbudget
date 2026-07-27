"use client";

import Link from "next/link";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
});

export default function Navbar() {
  return (
    <nav
      className={`${raleway.className} sticky top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-xl`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-4"
        >
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#082f6b] shadow-lg shadow-blue-900/15 transition group-hover:scale-105">
            <svg
              viewBox="0 0 40 40"
              className="h-7 w-7 fill-none stroke-[#f6c343]"
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
            <h1 className="text-base font-black tracking-tight text-[#071f49] sm:text-xl">
               Triton Budget
            </h1>

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-500 sm:text-xs sm:tracking-[0.22em]">
                    Dining Tracker
                </p>
          </div>
        </Link>

        <div className="flex items-center gap-8">
        

          <Link
            href="/transactions"
            className="relative text-sm font-bold text-[#082f6b]"
          >
            Transactions

            <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-[#f6c343]" />
          </Link>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4cc] text-lg">
            ☀
          </div>
        </div>
      </div>
    </nav>
  );
}