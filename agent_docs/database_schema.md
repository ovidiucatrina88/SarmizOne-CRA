# Database Schema

## Source of Truth

The definitive source of truth for the database schema is **`shared/schema.ts`**. This file defines the tables using Drizzle ORM and exports Zod schemas for validation.

## Key Tables

While `shared/schema.ts` contains the full definition, here are the core entities:

-   **`users`**: User accounts and authentication details.
-   **`risks`**: Core risk scenarios (FAIR methodology).
-   **`assets`**: Assets being protected.
-   **`controls`**: Security controls applied to assets.
-   **`vulnerabilities`**: Vulnerabilities associated with assets.
-   **`business_units`**: Organizational structure.

## Migrations

Database changes are managed using Drizzle Kit.

-   **Push changes**: `npm run db:push`
-   **Schema file**: `shared/schema.ts`

## SQL Dumps

The project root contains SQL dumps for reference or initialization:
-   `COMPLETE_DATABASE_SCHEMA_DUMP.sql`
-   `PRODUCTION_DATA_DUMP.sql`
