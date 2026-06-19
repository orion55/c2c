# Repository Guidelines

## Project Structure & Module Organization

This is a Node.js 20+ TypeScript service built with Fastify and Inversify. Application code lives in `src/`, with `src/index.ts` as the entry point and `src/inversify.config.ts` wiring dependency injection. Feature folders include `src/asterisk/` for call-processing routes, controllers, services, types, and utilities; `src/server/` for Fastify setup and routes; `src/config/` for environment loading; `src/logger/` for logging; and `src/util/` for shared helpers. Build tooling is in `scripts/`, Docker files are at the repository root, and generated output goes to `dist/`. Do not edit `dist/`, `node_modules/`, or log files directly.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: run `src/index.ts` in watch mode with `tsx`.
- `npm run build`: clean and bundle the service into `dist/` with `tsup`; on Windows it also copies `.env.production` to `dist/.env`.
- `npm run biome`: format, lint, and organize imports using Biome.
- `docker compose up --build`: build and run the containerized service when Docker is needed.

There is currently no `npm test` script. Add one before introducing automated tests.

## Coding Style & Naming Conventions

Use TypeScript with `strict` mode. Follow Biome settings: 2-space indentation, single quotes, semicolons, bracket spacing, and 100-character JavaScript line width. Prefer path aliases such as `@src/...` when matching nearby imports. Keep existing suffixes for module roles: `.service.ts`, `.controller.ts`, `.route.ts`, `.types.ts`, `.interface.ts`, and `.util.ts`. Use PascalCase for classes and exported types, camelCase for functions and variables, and uppercase keys for DI tokens and environment names.

## Testing Guidelines

No test framework is configured yet. When adding tests, colocate them near the code they cover or use a clear `tests/` directory, and name files with a recognizable suffix such as `.test.ts`. Prioritize tests around request validation, Asterisk command processing, configuration loading, and server error handling. Document the test command in `package.json` and update this guide.

## Commit & Pull Request Guidelines

This checkout does not include Git history, so no commit convention could be verified. Use short, imperative commit messages such as `Add Asterisk request validation`. Pull requests should describe the change, list verification commands run, reference related issues, and call out configuration or Docker changes. Include request/response examples for API behavior changes.

## Security & Configuration Tips

Keep `.env` and `.env.production` out of commits. Validate new environment keys in `src/config/` and document required values in PRs. Avoid committing logs from `src/`, `docker/`, or local runtime output.
