# AGENTS.md

Guide for AI coding agents working in the **YYC³ 企业智能管理系统 v3.0** repository.

---

## 1. Project Overview

- **Stack**: Next.js 16 (App Router) + React 19 + TypeScript 7 + Tailwind CSS 4
- **Data fetching**: SWR (shared `useSWRResource<T>()` hook with optimistic updates)
- **Caching**: Redis (`withCache()` / `invalidateResourceCache()`)
- **State**: Zustand stores in `store/` (user, task, project, customer)
- **UI system**: shadcn/ui primitives + Tailwind CSS variables + `class-variance-authority`
- **Icons**: `lucide-react`
- **Database**: PostgreSQL via `pg` (Repository pattern, parameterized SQL)
- **Validation**: Zod schemas (`lib/validations/schemas.ts`)
- **AI**: Real GLM-4 via ZhipuAdapter + ModelAdapterFactory + AgenticCore
- **i18n**: Self-built `@yyc3/i18n-core` engine (`lib/i18n/`)
- **Auth**: JWT (HMAC-SHA256) + Middleware route protection + API auth-guard
- **Primary UI language**: Chinese (zh-CN), with i18n support for en
- **Multi-platform**: Responsive PC/PWA/Mobile H5 (no monorepo); spec: `docs/YYC3-团队通用-标规文档/YYC3-多端适配-规范文档.md`

## 2. Essential Commands

```bash
bun run dev              # Dev server on port 3223
bun run build            # Production build (standalone)
bun run start            # Production server on port 3223
bun run lint             # ESLint
bun run type-check       # tsc --noEmit
bun run test             # vitest run
bun run test:coverage    # vitest run --coverage
bun run db:migrate       # Run database migrations
bun run security:scan    # Security scan
```

**Port**: Dev/prod = 3223 (`package.json`), Docker = 3000 (`Dockerfile`)

## 3. Environment Setup

Copy `.env.example` → `.env.local`:
- `DATABASE_URL` — PostgreSQL connection
- `REDIS_URL` — Redis for caching
- `ZHIPU_API_KEY` — AI service (GLM-4)
- `JWT_SECRET` — Auth token signing (min 32 chars)
- `NEXT_PUBLIC_API_BASE_URL` — API base URL

## 4. Code Organization

```
app/                     Next.js App Router (49 pages, 22 API routes)
  api/                   Route handlers (all auth-gated except /api/health)
  (feature)/page.tsx     Feature pages
  layout.tsx             Root layout (I18nProvider + AIWidgetProvider)
components/               Business + UI components
hooks/                   9 hooks (SWR-driven via use-swr-resource.ts)
lib/
  api/                   auth-guard, response-handler, cache, middleware, logger
  db/                    client, redis, cache.ts, repositories/, models/
  i18n/                  Self-built i18n engine + locales
  model-adapter/         AI multi-model adapters (Zhipu, OpenAI, Local)
  agentic-core/          Agent engine (AgenticCore, MessageBus, TaskScheduler)
  validations/           Zod schemas
  audit/                 Audit logger
  utils.ts               cn(), formatters, validators
store/                   Zustand stores (user, task, project, customer)
migrations/              12 SQL migrations (auto-run in Docker)
```

### Path alias
`@/*` → repo root (configured in `tsconfig.json` and `vitest.config.ts`).

## 5. Code Conventions

### Data fetching pattern
Always use `useSWRResource` for list/CRUD pages:
```typescript
import { useSWRResource } from '@/hooks/use-swr-resource'
const { items, create, update, remove, isLoading } = useSWRResource<Customer>('/api/customers', { page: 1 })
```

### API routes
- Import `authenticateApiRequest` from `@/lib/api/auth-guard`
- Import `withCache` / `invalidateResourceCache` from `@/lib/db/cache`
- Use `checkDatabaseConnection()` before DB operations
- Validate with Zod (`lib/validations/schemas.ts`)
- Return `{ success, data, pagination? }` envelope

### Caching pattern
```typescript
const cacheKey = buildCacheKey('customers', params)
const result = await withCache(cacheKey, () => repo.findAll(params), 300)
// After mutation:
await invalidateResourceCache('customers')
```

### Repository pattern
- All SQL in `lib/db/repositories/*.repository.ts`
- **Column whitelists** on `update()` methods (SQL injection protection)
- Always use parameterized queries (`$1`, `$2`, ...)

### File header comment block
```typescript
/**
 * @fileoverview <purpose>
 * @author YYC³
 * @version 3.0.0
 * @created YYYY-MM-DD
 * @license MIT
 */
```

## 6. Testing (Vitest + Testing Library)

- Setup: `vitest.setup.ts` (includes global mocks for next/navigation, next/image, Tabs, fetch, IntersectionObserver, localStorage, WebSocket)
- Shared helpers: `__tests__/helpers/` (renderWithProviders, mockFetch, mockFactories)
- Coverage: istanbul provider, 60% threshold
- **Excluded**: `core/**` (archived), `docs/i18n-core/**`

## 7. Key Gotchas

1. **`core/` is archived** — 77 files, not tracked in git, excluded from tsconfig and vitest
2. **Middleware protects all routes** — unauthenticated users redirected to `/login`
3. **API auth** — 15 routes use `authenticateApiRequest()`, only `/api/health` is public
4. **SWR is mandatory** — never use raw `fetch()` in hooks; use `useSWRResource<T>()`
5. **Redis degrades gracefully** — if Redis is down, `withCache()` falls through to DB
6. **Docker includes migrator** — `docker-compose up` runs migrations automatically
7. **Tabs mock in test** — Radix Tabs are mocked in `vitest.setup.ts` for jsdom compatibility
8. **Multi-platform adaptation** — Sidebar becomes a slide-out drawer below `md` (<768px); a fixed bottom nav (`<BottomNav />`) appears on xs/sm; viewport uses `viewport-fit=cover` for safe-area support; PWA manifest uses `display_override` + `id`; SW has layered caches (static/runtime/api) with navigation preload.

## 8. Multi-Platform Adaptation

Adaptation strategy follows the team spec (`docs/YYC3-团队通用-标规文档/YYC3-多端适配-规范文档.md`), implemented **within the single Next.js app** (no monorepo/component extraction).

### Responsive breakpoints (Tailwind)

| Breakpoint | Min width | Target |
|-----------|-----------|--------|
| `xs` (custom) | 480px | Phone landscape / small foldable |
| `sm` (default) | 640px | Large phone / small tablet |
| `md` (default) | 768px | Tablet / foldable expanded |
| `lg` (default) | 1024px | Desktop small |
| `xl` (default) | 1280px | Desktop large |

### Key files

| File | Role |
|------|------|
| `tailwind.config.ts` | `xs: '480px'` screen added |
| `app/globals.css` | Safe-area utilities, `.bottom-nav`, `.drawer-transform`, `.touch-target`, iOS input zoom fix, `.mobile-overlay` |
| `components/sidebar.tsx` | Desktop: fixed collapsible sidebar; Mobile (<md): hamburger trigger + slide-out drawer + overlay + ESC/route-change auto-close |
| `components/bottom-nav.tsx` | Bottom navigation bar (首页/任务/客户/通知), visible only on xs/sm (<768px) |
| `components/header.tsx` | Responsive padding, left-spacer for mobile hamburger, shrink-on-small `space-x` |
| `app/layout.tsx` | `<BottomNav />` integrated; viewport uses `viewportFit: 'cover'` + dual `themeColor` |
| `public/manifest.json` | PWA: `id`, `display_override`, `orientation: any`, shortcuts cleaned |
| `public/sw.js` | Layered cache (static/runtime/api) + navigation preload + trim logic |

### CSS utility classes (globals.css)

- `.safe-area-top/bottom/left/right/inset` — `env(safe-area-inset-*)` padding
- `.pb-safe` — bottom nav safe-area padding
- `.touch-target` — min 44×44px (WCAG 2.5.5)
- `.no-tap-highlight` / `.no-select` — iOS tap highlight & text-select removal
- `.bottom-nav` / `.bottom-nav-item` — mobile bottom navigation
- `.mobile-overlay` / `.drawer-transform` — drawer overlay + transform animation
- `.only-xs` / `.only-sm` / `.only-md-down` — breakpoint visibility helpers

## 9. Developer Documents

| Document | Purpose |
|----------|---------|
| [AUDIT-REPORT.md](./AUDIT-REPORT.md) | Full project audit (code quality, architecture, UX) |
| [SECURITY-FIXES.md](./SECURITY-FIXES.md) | Security vulnerability fixes |
| [TEST-AUDIT-REPORT.md](./TEST-AUDIT-REPORT.md) | Deep test infrastructure analysis |
| [MVP-EXPANSION-PLAN.md](./MVP-EXPANSION-PLAN.md) | Feature expansion roadmap |
| [ISSUE-LIST.md](./ISSUE-LIST.md) | Issue tracker (34 items, 100% resolved) |
| [IMPROVEMENT-ROADMAP.md](./IMPROVEMENT-ROADMAP.md) | 6-month improvement roadmap |
