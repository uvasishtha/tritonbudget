import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

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

    // 3. Robust User Lookup / Auto-Creation
    let userId = 1; // Fallback default
    const cleanedEmail = email && typeof email === "string" ? email.trim().toLowerCase() : "";

    if (cleanedEmail.length > 0) {
      // Look up existing user
      const userLookup = await pool.query(
        "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
        [cleanedEmail]
      );

      if (userLookup.rows.length > 0) {
        userId = userLookup.rows[0].id;
      } else {
        // Auto-create user if not found
        const defaultName = cleanedEmail.split("@")[0] || "New User";

        const newUser = await pool.query(
          "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id;",
          [cleanedEmail, defaultName]
        );

        userId = newUser.rows[0].id;
        console.log(`Created new user ID ${userId} for ${cleanedEmail}`);
      }
    } else {
      console.log("No valid email provided in webhook payload. Defaulting to userId = 1.");
    }

    // 4. Save Transaction
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