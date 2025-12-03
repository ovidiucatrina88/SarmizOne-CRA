# Code Conventions

## Language & Frameworks

-   **TypeScript**: Used for both client and server. Strict mode should be enabled.
-   **React**: Functional components with Hooks.
-   **Express**: Backend API framework.
-   **Tailwind CSS**: Utility-first CSS framework for styling.

## Directory Structure

-   **`shared/`**: This directory is critical. It contains code shared between the client and server, including:
    -   `schema.ts`: Database schema definitions (Drizzle ORM).
    -   `types/`: Shared TypeScript interfaces and types.
    -   `utils/`: Shared utility functions.
    -   **Rule**: Always define data models and shared types here to ensure consistency.

## Database (Drizzle ORM)

-   **Schema**: Defined in `shared/schema.ts`.
-   **Migrations**: Managed via `drizzle-kit`.
-   **Access**: Use the `db` instance exported from `server/db/index.ts`.

## Styling

-   Use Tailwind CSS utility classes.
-   Avoid inline styles where possible.
-   Follow the design system defined in `tailwind.config.ts`.

## API Design

-   Routes are defined in `server/routes.ts` or `server/routes/` directory.
-   Use `shared/schema.ts` for request/response validation (Zod schemas).
