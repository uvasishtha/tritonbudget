import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Ensure path matches your db export

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

    // 3. Look up user_id from email or automatically create a new user
    let userId = 1;
    if (email) {
      const cleanedEmail = email.trim().toLowerCase(); // Normalize email

      // Look up existing user (case-insensitive)
      const userLookup = await pool.query(
        "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
        [cleanedEmail]
      );

      if (userLookup.rows.length > 0) {
        // User exists -> use their existing ID
        userId = userLookup.rows[0].id;
      } else {
        // User does NOT exist -> Automatically create a new user account
        const defaultName = cleanedEmail.split("@")[0]; // e.g., "john" from "john@ucsd.edu"

        const newUser = await pool.query(
          "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id;",
          [cleanedEmail, defaultName]
        );

        userId = newUser.rows[0].id;
        console.log(`Created new user with ID ${userId} for email: ${cleanedEmail}`);
      }
    }

    // 4. Save to PostgreSQL using 'created_at' instead of 'date'
    const queryText = `
      INSERT INTO transactions (user_id, amount, category, note, created_at, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      userId,
      parsedAmount,
      category || "Uncategorized",
      vendorName,
      parsedDate,
      "pending",
    ];

    const result = await pool.query(queryText, values);

    return NextResponse.json(
      {
        message: "Transaction logged successfully",
        userId,
        transaction: result.rows[0],
      },
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