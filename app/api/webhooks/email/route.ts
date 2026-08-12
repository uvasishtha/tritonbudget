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

    // 3. Validate required fields
    if (!vendorName || amount === undefined || amount === null || !email) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: merchant/vendor, amount, and email are required",
        },
        { status: 400 }
      );
    }

    // Clean and validate email
    const cleanedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!cleanedEmail || !cleanedEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid sender email is required" },
        { status: 400 }
      );
    }

    // 4. Clean and parse amount
    const parsedAmount = parseFloat(
      String(amount).replace(/[^0-9.-]+/g, "")
    );

    if (isNaN(parsedAmount)) {
      return NextResponse.json(
        { error: "Invalid amount format" },
        { status: 400 }
      );
    }

    // 5. Parse date safely
    const parsedDate =
      date && !isNaN(Date.parse(date)) ? new Date(date) : new Date();

    // 6. Find existing user or create a new one
    let userId: number;

    const userLookup = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      [cleanedEmail]
    );

    if (userLookup.rows.length > 0) {
      // Existing user
      userId = userLookup.rows[0].id;
    } else {
      // Create user for this email
      const defaultName = cleanedEmail.split("@")[0] || "New User";

      const newUser = await pool.query(
        "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id;",
        [cleanedEmail, defaultName]
      );

      userId = newUser.rows[0].id;

      console.log(
        `Created new user ID ${userId} for ${cleanedEmail}`
      );
    }

    // 7. Save transaction
    const queryText = `
      INSERT INTO transactions (
        user_id,
        amount,
        category,
        note,
        created_at,
        status
      )
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

    // 8. Return successful response
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
      {
        error: "Internal Server Error",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
