# PropertyHub Pakistan — Complete Setup & Deployment Guide

This directory contains the production-ready source code and architecture setup for **PropertyHub Pakistan** — a comprehensive real estate property marketplace mobile application and management dashboard.

---

## 📂 Project Structure

```
d:\PropertyHub Pakistan
├── server/                    # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/            # DB client, Socket config, Env parsing
│   │   ├── controllers/       # Business logic controllers (Auth, Property, Payments, AI)
│   │   ├── middleware/        # JWT auth, authorization checks
│   │   ├── routes/            # API endpoints version mapping
│   │   └── server.ts          # Express startup & Socket.io server
│   ├── prisma/                # Prisma ORM schemas, Migrations, and database Seeds
│   └── package.json
│
├── admin/                     # Next.js 15 Admin Dashboard
│   ├── src/
│   │   └── app/               # Dashboard stats, listings approvals, and user console
│   └── package.json
│
└── mobile/                    # Flutter Mobile Application
    ├── lib/
    │   └── main.dart          # Main application (Riverpod, English/Urdu, AI Valuation, Chats)
    └── pubspec.yaml
```

---

## ⚡ Quick Start (Development Mode)

Follow these simple steps to run all three applications locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (v3.16+)
- [PostgreSQL](https://www.postgresql.org/) database

---

### Step 1: Backend Server Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Copy `.env.example` to `.env` and fill in your values (default local setup values are pre-filled in `.env`):
   ```bash
   cp .env.example .env
   ```
4. Perform Prisma migration to initialize your PostgreSQL database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with mock properties, cities, agents, and admin users:
   ```bash
   npx prisma db seed
   ```
6. Start the Express backend server:
   ```bash
   npm run dev
   ```
   The server will run on [http://localhost:5000](http://localhost:5000).

---

### Step 2: Next.js Admin Panel Setup

1. Open a new terminal window and navigate to the admin directory:
   ```bash
   cd admin
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the admin metrics charts and approvals tables.

---

### Step 3: Flutter Mobile App Setup

1. Open a new terminal window and navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Fetch Flutter package dependencies:
   ```bash
   flutter pub get
   ```
3. Run the app on your connected device or emulator:
   ```bash
   flutter run
   ```
   *(Supports Android, iOS, and Web version natively).*

---

## 💸 Payment Integration Guidelines

PropertyHub Pakistan includes mock billing routes for the main Pakistani payment providers. Here are production setup tips:

### 1. JazzCash M-Wallet Integration
- Register a merchant account at [JazzCash Business](https://www.jazzcash.com.pk/).
- Set `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`, and `JAZZCASH_INTEGRITY_SALT` in your backend `.env` file.
- Direct wallet debit calls are made securely using server-to-server HTTP POST requests signing signatures using the alphabetical sorted `SecureHash` method mapped in `authController.ts`.

### 2. Easypaisa Wallet Integration
- Obtain REST API access from Telenor TMB.
- Use Easypaisa's OTC (Over the Counter) or MA (Mobile Account) APIs.
- Configure webhooks inside `paymentRoutes.ts` to receive payment status update callbacks asynchronously from Telenor servers.

---

## 🧠 AI Features Integration

The backend is pre-equipped with advanced AI features:
- **AI Property Valuation:** Uses a dynamic mathematical model weighting city (Islamabad/Lahore/Karachi multipliers), area sizes, bedrooms/bathrooms count, and purpose to predict properties average valuations.
- **AI Descriptions Generator:** Formulates SEO-optimized bilingual descriptions in English and Urdu. To connect to GPT-4o, insert your `OPENAI_API_KEY` in `server/.env`.
- **AI Fraud Checks:** Compares price-per-marla averages and filters listings title/description structures against standard keywords (e.g. "double money", "no CNIC") to assign fraud risk metrics.

---

## 🚀 Production Deployment Checklist

1. **Docker Containerization:**
   Build the server container using:
   ```bash
   docker build -t propertyhub-backend ./server
   ```
2. **Reverse Proxy:**
   Mount an Nginx gateway routing public SSL traffic (`https://api.propertyhub.com.pk`) to the Express container running on port `5000`.
3. **Database Security:**
   Enable RDS backup rotation, configure JWT secrets inside your production server environments, and enforce rate limits for authentication endpoints to prevent brute-force attacks.
