# Triton Budget 💳✨

[cite_start]**Triton Budget** is an automated finance and expense-tracking web application built with the **Next.js App Router**[cite: 63]. [cite_start]It allows users to track their personal finances effortlessly by automatically parsing emailed receipts and invoices using AI and logging transactions directly to their dashboard in real time[cite: 64].

[cite_start]🚀 **Live Site:** [https://tritonbudget.vercel.app/](https://tritonbudget.vercel.app/) [cite: 56]

---

## 🛠️ Tech Stack & Architecture

- [cite_start]**Framework & Frontend:** [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS) [cite: 56, 65]
- [cite_start]**Authentication:** [NextAuth.js](https://next-auth.js.org/) (OAuth / Google Sign-In & Credentials) [cite: 56, 65]
- [cite_start]**Database:** PostgreSQL / Neon Serverless Postgres [cite: 56, 65]
- **Automation Pipeline:**
  - [cite_start]**Email Monitoring:** Gmail API / Watch Emails [cite: 65]
  - [cite_start]**Workflow Orchestration:** [Make.com](https://www.make.com) [cite: 56, 65]
  - [cite_start]**AI Extraction:** Google Gemini AI (Parses merchant, amount, date, and category into structured JSON) [cite: 56, 65]
  - [cite_start]**Webhook Integration:** Secure HTTP POST requests to `/api/webhooks/email` [cite: 56, 65]
- [cite_start]**Hosting & Deployment:** [Vercel](https://vercel.com) [cite: 56, 65]

---

## ✨ Key Features

- [cite_start]**Automated Receipt Parsing:** Simply forward or send any receipt/invoice email[cite: 57, 66]. [cite_start]AI automatically extracts the **merchant**, **amount**, **date**, and **category**[cite: 57, 66].
- **Smart Account Linking & Auto-Claim:**
  - [cite_start]**Email First:** If an emailed receipt arrives from a user who hasn't registered yet, a placeholder account is automatically generated in the database, safely storing all associated transactions under that email address[cite: 58, 67].
  - [cite_start]**Sign-Up Later:** When the user eventually signs up or registers with that same email address, the custom registration handler gracefully claims the placeholder account and updates the user record without throwing duplicate account errors[cite: 59, 68].
- [cite_start]**Real-Time Financial Dashboard:** View financial summaries, transaction history, and spending breakdowns instantly[cite: 60, 69].

---

## 🚀 Getting Started

### Prerequisites

- [cite_start]Node.js (v18+) installed [cite: 70]
- [cite_start]PostgreSQL database instance (e.g., Neon Postgres) [cite: 61, 70]
- [cite_start]Make.com account for email automation webhook forwarding [cite: 70]

---

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/your-username/tritonbudget.git](https://github.com/your-username/tritonbudget.git)
cd tritonbudget
npm install
```
