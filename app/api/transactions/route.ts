import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET only the logged-in user's transactions
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const result = await pool.query(
      `
        SELECT id, amount, category, note
        FROM transactions
        WHERE user_id = $1
        ORDER BY id DESC
      `,
      [userId]
    );

    const transactions = result.rows.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST a transaction for the logged-in user
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const body = await request.json();
    const { amount, category, note } = body;

    if (
      typeof amount !== "number" ||
      amount <= 0 ||
      typeof category !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid transaction data" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
        INSERT INTO transactions (
          user_id,
          amount,
          category,
          note
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, amount, category, note
      `,
      [userId, amount, category, note ?? ""]
    );

    const transaction = {
      ...result.rows[0],
      amount: Number(result.rows[0].amount),
    };

    return NextResponse.json(transaction, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);

    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}