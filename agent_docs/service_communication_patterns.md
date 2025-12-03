# Service Communication Patterns

## Client-Server Communication

The client and server communicate primarily via **RESTful HTTP APIs**.

### Protocol
-   **Format**: JSON.
-   **Validation**: Zod schemas (shared between client and server).

### API Structure
-   **Base URL**: `/api`
-   **Endpoints**: Defined in `server/routes.ts`.

### Data Fetching
-   **Library**: TanStack Query (React Query).
-   **Pattern**: Hooks are used to fetch data, handle loading states, and cache results.

## WebSocket (Development)
-   In development mode (using Neon database), WebSockets may be used for database connection tunneling, handled by `@neondatabase/serverless`.

## Error Handling
-   Server returns standard HTTP status codes (200, 400, 401, 404, 500).
-   Client handles errors via React Query's `isError` state.
