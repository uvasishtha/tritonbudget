import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET all transactions
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, amount, category, note
      FROM transactions
      ORDER BY id DESC
    `);

    // PostgreSQL returns NUMERIC values as strings.
    // Convert each amount into a JavaScript number.
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
// POST a new transaction
export async function POST(request: Request) {
  try {
    // Read the JSON sent from React.
    const body = await request.json();

    // Pull the values out of the request body.
    const { amount, category, note } = body;

    // Insert the new transaction into PostgreSQL.
    const result = await pool.query(
      `
      INSERT INTO transactions (amount, category, note)
      VALUES ($1, $2, $3)
      RETURNING id, amount, category, note
      `,
      [amount, category, note]
    );

    // Return the newly created transaction.
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);

    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}