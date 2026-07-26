# SYNAPSE — Pastel Task Path

A beautiful, functional student organization dashboard built using TanStack Start, React, TailwindCSS, and Neon Database (PostgreSQL).

## Prerequisites

This project utilizes **pnpm** as its package manager (configured in `package.json`). Do not use `npm` or `yarn` as peer dependency conflicts may occur.

Ensure you have:
- Node.js >= 20.x
- pnpm >= 11.x

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd pastel-task-path
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file at the root of the project (copying from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Specify your Neon PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://neondb_owner:password@host/neondb?sslmode=require"
   ```

   Optionally protect database reset actions (e.g. settings reset) with an admin secret:
   ```env
   RESET_DB_SECRET="your-super-secret-key"
   ```

4. **Run the Development Server**
   ```bash
   pnpm dev
   ```
   Open your browser to `http://localhost:3000`.

## Scripts

- **`pnpm dev`**: Starts the development server.
- **`pnpm build`**: Bundles the application for production.
- **`pnpm preview`**: Previews the production build locally.
- **`pnpm lint`**: Lints the project files with ESLint and Prettier formatting checks.
- **`pnpm format`**: Formats files with Prettier.
- **`pnpm test`**: Runs unit tests via Vitest.

## Project Structure

- `src/components/`: Reusable React components.
- `src/lib/`: Core logic, global stores (`store.ts`), database configuration (`db.ts`), rate limits (`rateLimit.ts`), and server functions (`dbServer.ts`).
- `src/routes/`: TanStack Start file-based routing.
- `.github/workflows/`: GitHub Actions CI pipeline configuration.

## Features & Protections

- **Zod Input Validation:** All server functions validate their input payloads using strict Zod schemas.
- **Rate Limiting:** Server-side IP-based rate limits protect writing/deletion endpoints to prevent abuse.
- **Data Protection:** The `resetDbFn` endpoint is secured by verifying an optional `RESET_DB_SECRET` matching the backend environment.
- **UUID Identifiers:** Object IDs (todos, courses, habits) are securely generated using `crypto.randomUUID()`.
