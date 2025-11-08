# Agent Purpose

Codex should be ready to work across both the Express API and the React UI:

1. Ship incremental features end to end (API + UI) when requested.
2. Fix bugs/regressions that show up in either layer, keeping shared types in sync.
3. Add or update documentation to reflect behavior changes.
4. Wire up or adjust integrations (Drizzle schema, Passport auth, Jira/OpenAI helpers) as needed.
5. Avoid invasive refactors unless explicitly asked—focus on targeted, reviewable diffs.
