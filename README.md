# Triton Budget 💳✨

**Triton Budget** is a personal finance and budget-tracking web application built for UCSD students using the **Next.js App Router**. It allows users to track their spending manually, scan image receipts, or forward emailed receipts to be automatically parsed using AI and logged directly to their dashboard in real time.

🚀 **Live Site:** [https://tritonbudget.vercel.app/](https://tritonbudget.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

- **Framework & Frontend:** [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (OAuth / Google Sign-In & Credentials wrapped with `<SessionProvider>`)
- **Database:** PostgreSQL / Neon Serverless Postgres
- **Automation & Image Processing:**
  - **Receipt Scanning:** Direct image upload & processing via `/api/scan-receipt`
  - **Email Monitoring:** Gmail API / Email forwarding
  - **Workflow Orchestration:** [Make.com](https://www.make.com)
  - **AI Extraction:** Google Gemini AI (Extracts merchant, amount, date, and category into structured JSON)
  - **Webhook Integration:** Secure HTTP POST requests to `/api/webhooks/email`
- **Hosting & Deployment:** [Vercel](https://vercel.com)

---

## ✨ Key Features

- **Receipt Image Scanning:** Upload or capture physical receipt images directly on the dashboard to automatically extract transaction details into your account.
- **Automated Email Receipt Parsing:** Forward receipt or invoice emails to the connected TritonBudget email account to process expenses automatically in the background.
- **Manual Expense Management:** Add, search, filter by category, or delete individual transactions with real-time UI updates.
- **UCSD Dining Dollar Budget Tracking:** Select from UCSD dining plans (Triton Gold, Triton Blue, Dining Dollars, Starter) to monitor total spent, remaining balance, and visual plan progress.
- **Smart Account Linking & Auto-Claim:**
  - **Email First:** Emailed receipts from unregistered users create a temporary placeholder account in the database to store pending transactions securely.
  - **Sign-Up Later:** Registering with the same email address claims all accumulated placeholder transactions without duplicate account errors.
- **Real-Time Financial Dashboard:** Instant overview of spending metrics, category breakdowns, and transaction history.

---

## 🚀 Local Development Setup

> **Note:** End users can visit the live site directly. The instructions below are for running or modifying the application locally.

### Prerequisites

- Node.js (v18+) installed
- PostgreSQL database instance (e.g., Neon Postgres)
- Make.com account for email automation webhook forwarding (optional for local image testing)

---

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/your-username/tritonbudget.git](https://github.com/your-username/tritonbudget.git)
cd tritonbudget
npm install
```
