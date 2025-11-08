# Tests

- `package.json` exposes `dev`, `build`, `start`, `check`, and `db:push`—there is no `test` script today.
- When validating changes, run `npm run check` for TypeScript diagnostics and `npm run build` for full bundling.
- Manual testing via `npm run dev` (Vite client + tsx server) is currently the primary verification path.
- If automated tests are added in the future, document their commands here so Codex can run them before shipping.
