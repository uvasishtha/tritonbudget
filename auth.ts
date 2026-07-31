import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { pool } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim().toLowerCase()
              : "";

          const password =
            typeof credentials?.password === "string"
              ? credentials.password
              : "";

          if (!email || !password) {
            console.log("Missing login credentials");
            return null;
          }

          const result = await pool.query(
            `
              SELECT id, name, email, password_hash
              FROM users
              WHERE LOWER(email) = $1
              LIMIT 1
            `,
            [email],
          );

          const user = result.rows[0];

          if (!user) {
            console.log("No user found:", email);
            return null;
          }

          const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash,
          );

          console.log("Password matches:", passwordMatches);

          if (!passwordMatches) {
            return null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = String(user.id);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        Object.assign(session.user, {
          id: token.sub,
        });
      }

      return session;
    },
  },
});