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
    const { merchant, vendor, amount, date, category, email } = body;

    // Use merchant or vendor
    const vendorName = merchant || vendor;

    if (!vendorName || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Missing required fields: merchant/vendor and amount are required" },
        { status: 400 }
      );
    }

    // Clean and parse amount
    const parsedAmount = parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));
    if (isNaN(parsedAmount)) {
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 });
    }

    // Parse date safely
    const parsedDate = date && !isNaN(Date.parse(date)) ? new Date(date) : new Date();

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

    // 4. Save to PostgreSQL database using 'note' column
    const queryText = `
      INSERT INTO transactions (user_id, amount, category, note, date, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      userId,
      parsedAmount,
      category || "Uncategorized",
      vendorName, // Stores merchant name inside 'note'
      parsedDate,
      "pending",
    ];

    const result = await pool.query(queryText, values);

    return NextResponse.json(
      { message: "Transaction logged successfully", transaction: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message || String(error) },
      { status: 500 }
    );
  }
}