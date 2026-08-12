import { Pool } from "pg";

// Clean up any old ?sslmode= params from the URL string
// to prevent the pg driver security warning
const connectionString = process.env.DATABASE_URL?.replace(
  /\?sslmode=(prefer|require|verify-ca)/,
  ""
);

export const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false, // Required for most managed cloud Postgres DBs
        }
      : false,
});