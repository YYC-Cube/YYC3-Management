# GitHub Copilot Instructions for YYC3-Management

These instructions help AI coding agents work productively in this repo by encoding the real architecture, workflows, and conventions actually used here. Keep guidance concrete and aligned with this codebase.

## Architecture Overview
- Framework: **Next.js 16** App Router + **React 19** + **TypeScript 7**. Entry layout integrates global providers in `app/layout.tsx`.
- Build tool: **Turbopack** (Next.js 16 default). Custom webpack config exists but only applies with `--webpack` flag.
- Styling: **Tailwind CSS v4** via `@tailwindcss/postcss`. CSS entry uses `@import "tailwindcss"` + `@config "../tailwind.config.ts"`.
- Global providers: ThemeProvider, AIWidgetProvider (global AI floating widget), Sidebar, Header, BottomNav.
- Routing: App Router under `app/**`; each feature is a route folder with `page.tsx`, e.g. `app/dashboard`, `app/ai-assistant`.
- UI system: Tailwind CSS with CSS variables in `tailwind.config.ts` (darkMode=class). Reusable primitives live in `components/ui/**` (shadcn-style).
- Path alias: `@/…` maps to repo root (see `tsconfig.json` paths and `vitest.resolve.alias`).
- Middleware: `middleware.ts` currently allows all requests (public by default) and skips static/api routes.
- i18n: Custom engine at `lib/i18n/` supporting 10 locales (en, zh-CN, zh-TW, ja, ko, fr, de, es, pt-BR, ar).
- Package manager: **Bun** (bun.lock). All CI/CD workflows use Bun.

## Dev & Build Workflows
- Node: 20+. Package manager: **Bun** (primary), npm/pnpm (compatible).
- Scripts (see `package.json`):
  - Dev: `bun run dev` (Next on port **3223**)
  - Build: `bun run build`
  - Start (prod): `bun run start` (port 3223)
  - Lint: `bun run lint`
  - Type check: `bun run type-check`
  - Tests: `bun run test` | `bun run test:coverage`
- Ports: Dev and prod both default to **3223** via scripts. Docker runs on 3000 (see Dockerfile/compose).
- Env: configure `.env.local` per README.md (API base URL, AI keys, local model endpoints, auth secrets, etc.).

## Deployment

### GitHub Pages (Static Export)
- Domain: `management.yyc3.vip` (via `public/CNAME`)
- Workflow: `.github/workflows/deploy-pages.yml` — triggers on push to `main`
- Static export env vars: `NEXT_STATIC_EXPORT=true`, `NEXT_PUBLIC_GITHUB_PAGES=true`, `NEXT_PUBLIC_CUSTOM_DOMAIN=true`
- Output: `out/` directory with `.nojekyll` + CNAME
- `next.config.mjs` switches between `output: 'export'` (Pages) and `output: 'standalone'` (Docker) via env vars
- Images optimization auto-disabled for static export (`images.unoptimized`)

### Docker (Full-featured)
- Multi-stage build produces `.next/standalone`; runner CMD executes `node server.js`
- `docker-compose.yml` wires Postgres and Redis with healthchecks
- CI/CD: `.github/workflows/ci-cd.yml` — builds Docker image, pushes to ghcr.io, deploys to VPS

## Testing Conventions (Vitest + RTL)
- Runner: Vitest with jsdom; global setup adds Jest-compat helpers, mocks `next/navigation` and `matchMedia`.
- Coverage: v8 provider, reports to `./coverage`.
- Place `*.test.ts(x)` next to the unit under test.
- Use `@testing-library/react` and `@testing-library/jest-dom` matchers.

## UI & Component Patterns
- Prefer `components/ui/**` primitives (Button, Card, Dialog, Tooltip, etc.) and Tailwind utility classes.
- Use `'use client'` at the top of interactive components/pages.
- Respect design tokens via CSS variables configured in `tailwind.config.ts` (colors, radius, animations).

## Multi-Device Adaptation
- Responsive breakpoints: `xs(480px)/sm/md/lg/xl` — five levels
- Sidebar: Desktop fixed/collapsible; Mobile (<768px) hamburger + slide-out drawer
- BottomNav: Mobile only (xs/sm) — 4 tabs (Dashboard/Tasks/Customers/Notifications)
- PWA: manifest.json with full icon set (72px-512px, maskable, WebP)
- Full Logo set: `public/yyc3-icons/` (favicon, iOS, Android, PWA, WebP)

## CI/CD Workflows
| Workflow | File | Purpose |
|----------|------|---------|
| Deploy Pages | `deploy-pages.yml` | GitHub Pages static deployment |
| CI/CD Pipeline | `ci-cd.yml` | Full pipeline: lint→test→build→Docker→VPS deploy |
| CI/CD Testing | `ci-cd-testing.yml` | Testing pipeline with integration tests |
| Code Quality | `code-quality.yml` | ESLint, Prettier, complexity, duplicate code |
| Security Scan | `security-scan.yml` | CodeQL, Snyk, gitleaks, dependency audit |

## When Adding Code
- Place route UI under `app/**` with `page.tsx` and add `'use client'` if interactive.
- Reuse `components/ui/**` primitives; align with Tailwind tokens.
- For new i18n locales, add file to `lib/i18n/locales/` and register in `lib/i18n/registry.ts`.
- Run `bun run type-check` before committing — TypeScript strict mode is enforced.
