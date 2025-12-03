---
description: How to manage database schema changes
---

# Database Migration Workflow

This workflow describes how to apply schema changes to the database using Drizzle Kit.

## Prerequisites

-   Node.js installed.
-   Database connection string available in `.env` or environment variables.

## Steps

1.  **Modify Schema**:
    Edit `shared/schema.ts` to define your new tables or modify existing ones.

2.  **Push Changes**:
    Run the following command to push changes directly to the database.
    ```bash
    npm run db:push
    ```

    This command uses `drizzle-kit push` to synchronize the database schema with your code.

3.  **Verify**:
    Check the database to ensure the changes were applied correctly.
