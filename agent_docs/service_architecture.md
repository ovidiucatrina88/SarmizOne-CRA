# Service Architecture

## High-Level Overview

The application follows a monolithic architecture with a clear separation of concerns between the client and server, facilitated by a shared code module.

## Components

### 1. Client (`client/`)
-   **Framework**: React (Vite).
-   **State Management**: React Query (TanStack Query).
-   **Routing**: Wouter.
-   **UI**: Radix UI + Tailwind CSS.
-   **Visualization**: D3.js for risk charts.

### 2. Server (`server/`)
-   **Framework**: Express.js.
-   **Runtime**: Node.js.
-   **Database Access**: Drizzle ORM.
-   **Authentication**: Passport.js (Local + OpenID Connect).

### 3. Shared (`shared/`)
-   **Purpose**: Contains code used by both client and server to ensure type safety and consistency.
-   **Contents**:
    -   `schema.ts`: Database schema and Zod validation schemas.
    -   `types`: TypeScript interfaces.

## Data Flow

1.  **Client Request**: React component triggers an API call via React Query.
2.  **API Endpoint**: Express server receives the request.
3.  **Validation**: Request data is validated using Zod schemas from `shared/schema.ts`.
4.  **Database**: Server interacts with PostgreSQL via Drizzle ORM.
5.  **Response**: Server sends JSON response back to the client.
