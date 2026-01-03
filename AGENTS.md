# Repository Guidelines

## Project Structure & Module Organization

This repo is a small full-stack app:

- `doraemon-nodejs/`: Express backend (routes in `routes/`, handlers in `controllers/`, DB in `db/`, views in `views/`, static assets/uploads in `public/`).
- `doraemon-vue/`: Vue 3 + TypeScript frontend (entry `src/main.ts`, router in `src/router/`, feature UI in `src/components/`).
- `doraemon.sql`: MySQL schema + seed data (import this to bootstrap a local DB).
- `Dockerfile`, `docker-compose.yml`: container build/run (Compose mounts `./uploads` and `./logs`).

## Build, Test, and Development Commands

Backend (API server, default `PORT=3000`):

```bash
cd doraemon-nodejs
npm install
npm start
```

Frontend (Vite dev server, usually `http://localhost:5173`):

```bash
cd doraemon-vue
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

Database setup:

```bash
mysql -u <user> -p < doraemon.sql
```

Docker (production-ish run; edit `docker-compose.yml` to use a locally built image if needed):

```bash
docker build -t doraemon .
docker compose up -d
```

## Coding Style & Naming Conventions

- JavaScript/TypeScript: keep changes consistent with the surrounding file (indentation varies across the repo).
- Prefer clear, descriptive names (e.g., `getUserById`, `newsService`, `AnimeDetail.vue`).
- Frontend: components live under `doraemon-vue/src/components/<feature>/...`.
- Backend: route modules under `doraemon-nodejs/routes/` and corresponding logic in `controllers/`/`services/`.

## Testing Guidelines

There is no dedicated automated test suite in this repo yet. When changing behavior:

- Do a quick manual smoke test: run backend + frontend and exercise the impacted flow.
- If you add tests, keep them colocated (e.g., `src/**/__tests__`) and document the runner in the PR.

## Commit & Pull Request Guidelines

Git history is mixed; use a consistent convention going forward:

- Prefer Conventional Commits where possible: `feat(scope): ...`, `fix(scope): ...`, `chore: ...`.
- PRs should include: what changed, how to test locally, and any UI screenshots for frontend-visible changes.

## Security & Configuration Tips

- Do not commit real secrets. Use `.env.example` as the template and keep `.env` files local-only.
- Backend expects MySQL/Redis/JWT/email settings via environment variables (see `.env.example`).
