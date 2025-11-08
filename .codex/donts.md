# Don’ts

- Do not touch deployment scripts (`production-deploy.sh`, `complete-production-deploy.sh`, Dockerfiles) or database dumps unless the task explicitly requires it.
- Avoid modifying CI/pipeline settings (none exist yet) without prior confirmation.
- Don’t bump package versions or introduce new services without aligning with the team.
- Never revert user-authored changes already in the tree unless asked.
