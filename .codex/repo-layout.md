# Repo Layout

- Root `README.md` documents the Risk Quantification Platform and Docker deployment overview; production-specific guidance lives in `PRODUCTION_README.md` and `PRODUCTION_MIGRATION_GUIDE.md`.
- Source code splits into `client/` (React UI), `server/` (Express API), and `shared/` (cross-cutting models/utilities).
- Test scaffolding currently sits under `__tests__/` but no runner is configured.
- Deployment helpers include `docker-compose.yml`, `Dockerfile`, env templates, and shell scripts (`production-deploy.sh`, `complete-production-deploy.sh`).
- Data artifacts and assets live at the root (`COMPLETE_DATABASE_SCHEMA_DUMP.sql`, `attached_assets/`, `dist/` build output).
- There is no `CONTRIBUTING.md` yet, so Codex responses should reference these new `.codex/*.md` notes when guidance is needed.
