# Triton Budget 💳✨

**Triton Budget** is an automated finance and expense-tracking web application built with the **Next.js App Router**. It allows users to track their personal finances effortlessly by automatically parsing emailed receipts and invoices using AI and logging transactions directly to their dashboard in real time.

🚀 **Live Site:** [https://tritonbudget.vercel.app/](https://tritonbudget.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

- **Framework & Frontend:** [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (OAuth / Google Sign-In & Credentials)
- **Database:** PostgreSQL / Neon Serverless Postgres
- **Automation Pipeline:**
  - **Email Monitoring:** Gmail API / Watch Emails
  - **Workflow Orchestration:** [Make.com](https://www.make.com)
  - **AI Extraction:** Google Gemini AI (Parses merchant, amount, date, and category into structured JSON)
  - **Webhook Integration:** Secure HTTP POST requests to `/api/webhooks/email`
- **Hosting & Deployment:** [Vercel](https://vercel.com)

---

## ✨ Key Features

- **Automated Receipt Parsing:** Simply forward or send any receipt/invoice email. AI automatically extracts the **merchant**, **amount**, **date**, and **category**.
- **Smart Account Linking & Auto-Claim:**
  - **Email First:** If an emailed receipt arrives from a user who hasn't registered yet, a placeholder account is automatically generated in the database, safely storing all associated transactions under that email address.
  - **Sign-Up Later:** When the user eventually signs up or registers with that same email address, the custom registration handler gracefully claims the placeholder account and updates the user record without throwing duplicate account errors.
- **Real-Time Financial Dashboard:** View financial summaries, transaction history, and spending breakdowns instantly.

---

## 🚀 Local Development Setup

> **Note:** End users can simply visit the live site. The instructions below are for running or modifying the application locally.

### Prerequisites

- Node.js (v18+) installed
- PostgreSQL database instance (e.g., Neon Postgres)
- Make.com account for email automation webhook forwarding

---

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/your-username/tritonbudget.git](https://github.com/your-username/tritonbudget.git)
cd tritonbudget
npm install
```
