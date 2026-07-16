# Hoilamo Coffee Shop

A Next.js coffee shop storefront with cash-on-pickup ordering and an admin panel for products, orders, and sales.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** + custom UI components
- **Neon PostgreSQL** via Prisma
- **Cloudflare R2** for product images
- **NextAuth.js** (credentials) for admin login
- Client cart with `localStorage`

## Setup

### 1. Install dependencies

```powershell
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```powershell
Copy-Item .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon connection string (from [console.neon.tech](https://console.neon.tech)) |
| `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `ADMIN_PASSWORD` | Password for the seeded admin user |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | R2 bucket name (e.g. `hoilamo-products`) |
| `R2_PUBLIC_URL` | Public bucket URL (`https://pub-xxx.r2.dev` or custom domain) |

### 3. Create Neon database

1. Sign up / log in at [Neon](https://console.neon.tech)
2. Create a project
3. Copy the connection string into `DATABASE_URL` in `.env`

### 4. Set up Cloudflare R2 (product images)

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2** → create a bucket (e.g. `hoilamo-products`)
2. Enable public access: bucket **Settings** → **Public access** → connect an `r2.dev` subdomain (or custom domain)
3. **Manage R2 API Tokens** → create a token with **Object Read & Write** for that bucket
4. Put Account ID, Access Key ID, Secret, bucket name, and public URL into `.env`

### 5. Migrate and seed

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

This creates tables and seeds:

- Admin: `admin@coffeeshop.com` / value of `ADMIN_PASSWORD` (default `admin123`)
- Sample categories and products

### 6. Run the app

```powershell
npm run dev
```

- Store: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Features

### Customer storefront

- Home, menu (with category filters), product detail
- Cart and checkout (cash on pickup)
- Order confirmation with order number
- About and contact pages

### Admin panel

- Dashboard: today’s revenue, orders, low stock
- Product CRUD with **Cloudflare R2** image upload (default + hover images)
- Order list and status updates (`PENDING` → `READY` → `COMPLETED`)
- Sales reports with charts and top products

## Useful scripts

```powershell
npm run db:migrate   # run migrations
npm run db:seed      # seed admin + sample products
npm run db:studio    # open Prisma Studio
npm run build        # production build
```
