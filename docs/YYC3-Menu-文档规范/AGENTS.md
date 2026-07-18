# AGENTS.md

Guidance for AI coding agents working in the **YYC³ 企业智能管理系统** (YYC3-Management) repository. This complements `.github/copilot-instructions.md` — read both. Only patterns actually observed in the codebase are documented here.

> **Package manager is Bun.** All commands below assume `bun run <script>`. npm/pnpm are CI-compatible but Bun is canonical (see `bun.lock`).

---

## 1. Essential Commands

Scripts are defined in `package.json`:

| Task | Command | Notes |
|------|---------|-------|
| Install | `bun install` | Use `--frozen-lockfile` in CI |
| Dev server | `bun run dev` | Port **3223** (Next.js) |
| Production build | `bun run build` | Turbopack (Next 16 default) |
| Start prod | `bun run start` | Port **3223** |
| Type check | `bun run type-check` | `tsc --noEmit`, **strict mode** |
| Lint | `bun run lint` / `bun run lint:fix` | ESLint flat config (`eslint.config.mjs`) |
| Tests (all) | `bun run test` | `vitest run` |
| Tests (watch) | `bun run test:watch` | |
| Coverage | `bun run test:coverage` | Istanbul provider → `./coverage` |
| Tests (lib only) | `bun run test:lib` | |
| Tests (components) | `bun run test:components` | |
| Tests (perf) | `bun run test:performance` | `lib/performance/` |
| Security audit | `bun run security:audit` | `bun audit` |
| DB migrate | `bun run db:migrate` | Runs `scripts/run-migrations.ts` |

**Always run `bun run type-check` before considering work complete** — TS strict mode (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, etc.) is enforced via `tsconfig.json`.

---

## 2. Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 7
- **Build**: Turbopack default; webpack config in `next.config.mjs` only applies with `--webpack`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`; `darkMode: 'class'`; tokens as CSS variables in `tailwind.config.ts`
- **UI primitives**: shadcn-style components in `components/ui/**` (Radix UI + CVA)
- **Data fetching**: SWR (`hooks/use-*-resource.ts`, `hooks/use-swr-resource.ts`)
- **Client state**: Zustand (`store/*-store.ts`)
- **Forms**: `react-hook-form`
- **Validation**: Zod schemas in `lib/validations/schemas.ts`
- **Database**: PostgreSQL via `pg` (`lib/db/client.ts`), repository pattern in `lib/db/repositories/`
- **Cache**: Redis (`lib/db/redis.ts`) + `lib/db/cache.ts` (`withCache`, `invalidateResourceCache`, `buildCacheKey`)
- **i18n**: Custom engine at `lib/i18n/` (10 locales; `en` is default, 9 others lazy-loaded)
- **AI**: `ai` SDK + custom model adapters in `lib/model-adapter/`; floating widget in `components/ai-floating-widget/`

### Path alias
`@/*` → repo root (configured in `tsconfig.json` `paths` and `vitest.config.ts` `resolve.alias`). Prefer `@/components/...`, `@/lib/...`, `@/hooks/...`.

---

## 3. Directory Layout

```
app/                  Next.js App Router routes (each feature = folder with page.tsx)
  <feature>/
    page.tsx          Client component ('use client') — the feature UI
    layout.tsx        Optional per-feature layout
    loading.tsx       Suspense fallback
    page.test.tsx     Co-located test (when present)
  api/                Route handlers (route.ts) — REST endpoints
components/
  ui/                 Reusable primitives (Button, Card, Dialog, …)
  *.tsx               Feature-level composite components
  ai-floating-widget/ Global AI widget (provider + widget)
  charts/, dialogs/, settings/, layout/
hooks/                React hooks (mostly SWR wrappers: use-customers, use-tasks, …)
store/                Zustand stores (user/task/project/customer)
lib/
  api/                auth-guard, logger, middleware, response-handler, validation
  db/                 client (pg Pool), redis, cache, models/, repositories/
  validations/        Zod schemas
  i18n/               engine, registry, locales/, provider
  utils.ts            cn(), formatCurrency/Date/Number, debounce, etc.
  security/           csrf, signature, alerts
core/                 ⚠️ LEGACY/ARCHIVED — excluded from type-check, lint, tests, build
docs/                 Chinese documentation tree (excluded from TS/lint)
migrations/           SQL migrations (001–014)
scripts/              deploy.sh, run-migrations.ts, security-scan.sh, quality-gate.ts
k8s/                  Kubernetes manifests
docker/               nginx, prometheus, postgres-init, mongo-init
.github/workflows/    CI/CD pipelines (see §6)
```

**Important**: `core/`, `docs/`, `scripts/`, `migrations/`, `public/`, `templates/` are **excluded** from `tsconfig.json`, ESLint, and Vitest. Do not add production source code there. The `core/` tree is explicitly archived (see `core/ARCHIVED.md`).

---

## 4. Code Patterns & Conventions

### Pages (`app/**/page.tsx`)
- Add `"use client"` at the top for interactive pages (most are client components).
- Compose from `components/ui/*` primitives and feature components in `components/`.
- Use hooks from `hooks/use-*.ts` for data; do not call `fetch('/api/...')` directly in pages.
- Wrap content with `<PageContainer>` from `components/layout/page-container.tsx`.
- Example: `app/dashboard/page.tsx`.

### API Routes (`app/api/**/route.ts`)
Canonical handler shape (see `app/api/customers/route.ts`):
1. `authenticateApiRequest(request)` → returns `{ authenticated, payload | response }`.
2. `checkDatabaseConnection()` → 503 on failure.
3. Parse query/body; validate with the matching Zod schema (`*.safeParse`).
4. Use the repository from `lib/db/repositories/`.
5. Wrap reads in `withCache(cacheKey, () => repo.findAll(...), ttlSeconds)`.
6. After writes, call `invalidateResourceCache('<resource>')`.
7. Always return `{ success: true, data, pagination? }` or `{ success: false, error }` with proper HTTP status.

Public API routes are whitelisted in `lib/api/auth-guard.ts` (`PUBLIC_API_ROUTES`, currently `['/api/health']`).

### Auth & Middleware
- **No Next.js root `middleware.ts`** — authentication is enforced at the API layer.
- API auth uses an HS256 JWT verified in `lib/api/auth-guard.ts` (`authenticateApiRequest`, `verifyToken`, timing-safe compare). Secret from `JWT_SECRET` (fallback `SESSION_SECRET`).
- `lib/api/middleware.ts` provides `withAuth` / `withMiddleware` helpers for API route handlers.
- Browser requests to protected pages rely on client-side auth checks (the login page at `/login` handles the auth UI).

### UI Components (`components/ui/**`)
- shadcn-style: `React.forwardRef` + `class-variance-authority` (`cva`) + `cn()` from `lib/utils.ts`.
- Variants use Tailwind utility classes and CSS variables (`bg-primary`, `text-primary-foreground`, …).
- Example: `components/ui/button.tsx`.
- Prefer composing these over hand-rolling new primitives.

### State Management
- **Server state**: SWR via `useSWRResource<T>('/api/<resource>', params)` → exposes `{ items, pagination, isLoading, isError, mutate, create, update, remove }`. Thin wrappers live in `hooks/use-<resource>.ts`.
- **Client state**: Zustand stores in `store/` (e.g. `useUserStore`, `useTaskStore`). Re-exported from `store/index.ts`.

### Validation
- All request bodies validated with Zod schemas from `lib/validations/schemas.ts`.
- **Status/priority enums are Chinese strings** (e.g. task status `'待处理' | '进行中' | '已完成' | '已取消'`; priority `'低' | '中' | '高' | '紧急'`). Match existing enum values when extending.

### i18n
- 10 locales: `en` (default, eager) + `zh-CN`, `zh-TW`, `ja`, `ko`, `fr`, `de`, `es`, `pt-BR`, `ar` (lazy).
- Locale files live in `lib/i18n/locales/`. Register new locales in `lib/i18n/registry.ts` (`LAZY_LOCALE_REGISTRY`) and add the type to `lib/i18n/types.ts`.
- App-specific overrides use `*-app.ts` files (e.g. `en-app.ts`, `zh-CN-app.ts`).
- Provider is `I18nProvider` from `lib/i18n`, wired in `app/layout.tsx`.

### File Headers
Many files use a JSDoc `@fileoverview` header block (description, author, version, license). When touching such a file, follow the existing header style; do not strip it.

---

## 5. Testing

- **Runner**: Vitest + jsdom; globals enabled; setup in `vitest.setup.ts`.
- **Co-locate** `*.test.ts(x)` next to the unit under test (e.g. `app/dashboard/page.test.tsx`).
- **Helpers** in `__tests__/helpers/`: `render-with-providers.tsx`, `mock-factories.ts`, `mock-fetch.ts`, `indexeddb-mock.ts`.
- **Setup file** mocks: `next/navigation`, `next/image`, `localStorage`, `WebSocket`, `fetch`, `IntersectionObserver`, `ResizeObserver`, `matchMedia`, and `@/components/ui/tabs` (Radix Tabs don't render inactive panels in jsdom).
- **Coverage** uses **Istanbul** (not v8) with thresholds 60% (lines/functions/branches/statements); `core/**` is excluded from coverage AND from test execution.
- Test timeouts: 5s (`testTimeout`/`hookTimeout`). Pool: threads, 2–4 workers, `isolate: false`.
- Prefer `@testing-library/react` + `@testing-library/jest-dom` matchers. Tests assert on visible Chinese text (e.g. `screen.getByText('仪表板')`).
- Run a single file: `bunx vitest run path/to/file.test.tsx`.

---

## 6. Build & Deployment

`next.config.mjs` switches output mode via env vars:

| Env | Mode | Target |
|-----|------|--------|
| `NEXT_STATIC_EXPORT=true` | `output: 'export'` → `out/` | GitHub Pages |
| (unset) | `output: 'standalone'` → `.next/standalone` | Docker |
| `NEXT_PUBLIC_GITHUB_PAGES=true` without `NEXT_PUBLIC_CUSTOM_DOMAIN` | adds `basePath: '/YYC3-Management'` | Project Pages |
| `NEXT_PUBLIC_CUSTOM_DOMAIN=true` | no basePath | Custom domain (`management.yyc3.vip`) |

Static export auto-disables image optimization and skips `headers()`/`redirects()`.

**Ports**: dev/prod scripts use **3223**; Docker container exposes **3000**.

### CI/CD Workflows (`.github/workflows/`)
| File | Purpose |
|------|---------|
| `deploy-pages.yml` | Push to `main` → static export → GitHub Pages (`management.yyc3.vip`) |
| `ci-cd.yml` | lint → type-check → test → build → security → Docker → VPS deploy (main only) |
| `ci-cd-testing.yml` | Integration testing pipeline |
| `code-quality.yml` | ESLint, Prettier, complexity, duplicates |
| `security-scan.yml` | CodeQL, Snyk, gitleaks, dependency audit |

CI uses Bun 1.2.2 + Node 24. Note: lint/type-check/test steps use `continue-on-error: true` (non-blocking) in `ci-cd.yml`. **Don't rely on CI to catch type errors — run `bun run type-check` locally.**

### Docker
- Multi-stage `Dockerfile` produces `.next/standalone`; runner runs `node server.js`.
- `docker-compose.yml` wires Postgres + Redis with healthchecks.
- Variants: `docker-compose.dev.yml`, `docker-compose.prod.yml`, `docker-compose.complete.yml`.

---

## 7. Environment

Copy `.env.example` → `.env.local`. Key variables:
- `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_NAME`
- `DATABASE_URL` (PostgreSQL), `DB_HOST/PORT/NAME/USER/PASSWORD` (used by `lib/db/client.ts`)
- `REDIS_URL`
- `JWT_SECRET` / `SESSION_SECRET` (≥32 chars; required for API auth)
- AI provider keys: `ZHIPU_API_KEY`, `BAIDU_*`, `ALIBABA_API_KEY`, `XUNFEI_*`, `TENCENT_*`
- Local models: `OLLAMA_BASE_URL`, `LM_STUDIO_BASE_URL`
- WeChat (optional): `WECHAT_APP_ID`, `WECHAT_APP_SECRET`

Test env defaults are injected in `vitest.setup.ts` (DB URL, JWT secret, `NODE_ENV=test`).

---

## 8. Gotchas & Non-Obvious Patterns

- **`core/` is archived.** It's excluded everywhere (TS, ESLint, Vitest, Next build). New work must NOT go in `core/`; treat it as read-only reference.
- **CI is non-blocking** for lint/type-check/test (`continue-on-error: true`). Green CI does not mean clean code — always run `bun run type-check` locally.
- **`typescript.ignoreBuildErrors: true`** in `next.config.mjs` (build won't fail on TS errors by design). Type-checking is a separate explicit step.
- **Chinese enum values** in Zod schemas and UI labels (task/project/customer status & priority). Don't translate them to English without coordinated DB/data migration.
- **Radix Tabs mock** in `vitest.setup.ts`: tests render all `TabsContent` panels (real Radix hides inactive ones in jsdom). Don't be surprised that tab tests don't require user clicks to switch.
- **pg ESM types**: `lib/db/client.ts` uses `@ts-expect-error` for the `pg` import; module is declared in `types.d.ts`. Preserve this when editing.
- **System fonts, not Google Fonts**: `app/layout.tsx` intentionally avoids `next/font/google` to keep CI builds hermetic. Don't reintroduce it.
- **Path alias `@/*`** resolves to repo root (not `src/`). Both `tsconfig.json` and `vitest.config.ts` must stay in sync.
- **Static export constraints**: when `NEXT_STATIC_EXPORT=true`, `headers()`, `redirects()`, and image optimization are disabled. API routes and middleware do not run on GitHub Pages — only the Docker deployment has a working backend.
- **No `pnpm` in CI**: despite a `.pnpm`-style symlink step, the workflows use Bun. Don't add `pnpm config` commands.

---

## 9. When Adding Code

1. **New route** → create `app/<feature>/{page.tsx,loading.tsx,(layout.tsx)}`; add `"use client"` if interactive; use `@/components/ui/*` primitives.
2. **New API endpoint** → `app/api/<resource>/route.ts`; follow the auth → DB check → Zod validate → repository → cache pattern (§4).
3. **New entity** → add model in `lib/db/models/`, repository in `lib/db/repositories/`, Zod schema in `lib/validations/schemas.ts`, SWR hook in `hooks/use-<resource>.ts`.
4. **New UI primitive** → add to `components/ui/`, follow `forwardRef` + `cva` + `cn()` pattern.
5. **New locale** → add `lib/i18n/locales/<code>.ts`, register in `lib/i18n/registry.ts`, extend `Locale` type in `lib/i18n/types.ts`.
6. **Run `bun run type-check`** before committing — strict TS is enforced.
