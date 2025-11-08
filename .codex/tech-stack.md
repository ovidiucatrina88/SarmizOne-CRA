# Tech Stack

- **Language**: TypeScript across frontend (`client`) and backend (`server`).
- **Frontend**: React 18 + Vite build pipeline, Tailwind CSS for styling, Radix UI/shadcn patterns, D3/Recharts/React Force Graph for data viz, TanStack Query for data fetching, Wouter for routing.
- **Backend**: Express.js app executed with `tsx` in dev and bundled with esbuild for production; Passport (local + OIDC) and session middleware with PostgreSQL persistence.
- **Data Layer**: Drizzle ORM + Drizzle Kit migrations mapped to PostgreSQL 15+.
- **Tooling**: Vite, esbuild, tsx, TypeScript `tsconfig.json`, Docker + docker-compose for deployment, Tailwind/PostCSS config, shared TypeScript package for common types.
