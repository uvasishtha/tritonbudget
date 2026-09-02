// app/api/scan-receipt/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { pool } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Authenticate session using Auth.js (NextAuth v5) helper
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.trim().toLowerCase();

    // 2. Read file payload
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file uploaded" }, { status: 400 });
    }

    // Convert image file into Base64 for Gemini Vision
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // 3. Initialize Gemini 1.5 Flash with structured JSON mode
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Analyze this receipt image and extract transaction details.
Return ONLY a valid JSON object matching this schema:
{
  "merchant": string (store or provider name),
  "amount": number (total transaction amount),
  "date": string (YYYY-MM-DD format),
  "category": string (e.g. Groceries, Dining, Utilities, Retail, Travel)
}`;

    // Send photo buffer to Gemini Vision API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type || "image/jpeg",
        },
      },
    ]);

    const parsedData = JSON.parse(result.response.text());
    const { merchant, amount, date, category } = parsedData;

    // Clean amount and date values
    const parsedAmount = parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0.0;
    const parsedDate = date && !isNaN(Date.parse(date)) ? new Date(date) : new Date();

    // 4. Look up user ID in Neon PostgreSQL database
    const userResult = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      [userEmail]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User record not found in database" }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // 5. Insert transaction matching database schema columns
    const query = `
      INSERT INTO transactions (user_id, amount, category, note, created_at, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const inserted = await pool.query(query, [
      userId,
      parsedAmount,
      category || "Uncategorized",
      merchant || "Unknown Merchant",
      parsedDate,
      "pending",
    ]);

    return NextResponse.json({ success: true, transaction: inserted.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Receipt Scan Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process receipt photo" },
      { status: 500 }
    );
  }
}