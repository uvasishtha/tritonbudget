import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existingUser = await pool.query(
      `
        SELECT id
        FROM users
        WHERE email = $1
      `,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `,
      [name, email, passwordHash],
    );

    return NextResponse.json(
      {
        user: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 },
    );
  }
}