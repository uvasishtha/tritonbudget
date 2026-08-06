import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Make sure path matches your db export

export async function POST(req: Request) {
  try {
    // 1. Authenticate secret key
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Read incoming payload
    const body = await req.json();
    const { merchant, amount, date, category, email } = body;

    if (!merchant || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Look up user_id from email (defaults to 1 if user not found)
    let userId = 1;
    if (email) {
      const userLookup = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1;",
        [email]
      );
      if (userLookup.rows.length > 0) {
        userId = userLookup.rows[0].id;
      }
    }

    // 4. Save to PostgreSQL database matching your table columns
    const queryText = `
      INSERT INTO transactions (user_id, amount, category, description, date, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      userId,
      parseFloat(amount),
      category || "Uncategorized",
      merchant, // Maps merchant name to description column
      date ? new Date(date) : new Date(),
      "pending",
    ];

    const result = await pool.query(queryText, values);

    return NextResponse.json(
      { message: "Transaction logged successfully", transaction: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}