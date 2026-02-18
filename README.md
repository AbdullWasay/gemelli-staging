# Gemelli Marketplace

## Setup

1. **Clone the repository** and `cd` into it.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment variables:** Copy `.env.example` to `.env` (or `.env.local`) and fill in your values. Required vars:
   - `DATABASE_URL` – PostgreSQL (e.g. Neon) connection string
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_NEXT_AUTH_SECRET`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_SENDER_EMAIL`
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`
   - `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_APP_URL`
   - `CRON_SECRET` (for cron APIs)

   Optional (social login): `NEXT_PUBLIC_Google_ID`, `NEXT_PUBLIC_GOOGLE_SECRET`, etc.

4. **Prisma:** Generate client and apply migrations (Prisma reads from `.env`):
   ```bash
   npm run prisma:generate
   npx prisma migrate deploy
   ```
   *(If using a fresh DB, run `npx prisma migrate dev` instead to apply migrations.)*

5. **(Optional)** Seed the database:
   ```bash
   npm run prisma:seed
   ```

## Running the Application

```bash
npm run dev
```

Dev server: [http://localhost:3000](http://localhost:3000).

## Marking Featured Products

To mark products as featured (with discounts), run:

```bash
npm run mark-featured
```

This script will:
- Mark approximately 30% of each seller's products as "featured"
- Add discount prices (5-35% off)
- Update product tags to include "featured"

The featured products will display with:
- A "SALE" badge
- Discounted prices shown in red
- Original prices shown with strikethrough

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run prisma:seed`: Seed the database with sample data
- `npm run mark-featured`: Mark products as featured
