# GitHub Copilot Instructions for yyc3-mana

These instructions help AI coding agents work productively in this repo by encoding the real architecture, workflows, and conventions actually used here. Keep guidance concrete and aligned with this codebase.

## Architecture Overview
- Framework: Next.js 14 App Router + React 18 + TypeScript. Entry layout integrates global providers in app/layout.tsx.
- Global providers: ThemeProvider, AIWidgetProvider (global AI floating widget), Sidebar, Header.
- Routing: App Router under app/**; each feature is a route folder with page.tsx, e.g. app/dashboard, app/ai-assistant.
- UI system: Tailwind CSS with CSS variables in tailwind.config.ts (darkMode=class). Reusable primitives live in components/ui/** (shadcn-style).
- Path alias: '@/…' maps to repo root (see tsconfig.json/paths and vitest.resolve.alias).
- Middleware: middleware.ts currently allows all requests (public by default) and skips static/api routes.
- AI capabilities:
  - Global AI floating widget is wired via components/ai-floating-widget/** and enabled in app/layout.tsx.
  - Agent engine lives in lib/agentic-core/** (MessageBus, TaskScheduler, StateManager) and powers IntelligentAIWidget.
  - Self-healing ecosystem library in lib/self-healing-ecosystem/** exports multiple orchestrated reliability systems for future/advanced use.

## Dev & Build Workflows
- Node: 18+. Package manager: npm or pnpm (both referenced in docs; scripts are npm-compatible).
- Scripts (see package.json):
  - Dev: npm run dev (Next on port 3200)
  - Build: npm run build
  - Start (prod): npm start (port 3200)
  - Lint: npm run lint
  - Type check: npm run type-check
  - Tests: npm run test | npm run test:watch | npm run test:coverage | npm run test:ui
- Ports: Dev and prod both default to 3200 via scripts. Docker runs on 3000 (see Dockerfile/compose).
- Env: configure .env.local per README.md (API base URL, AI keys, local model endpoints, auth secrets, etc.).

## Testing Conventions (Vitest + RTL)
- Runner: Vitest with jsdom; global setup at src/test/setup.ts adds Jest-compat helpers, mocks next/navigation and matchMedia. Prefer these built-ins over redefining mocks.
- Aliases: 'jest' is aliased to 'vitest' for compatibility; '@' resolves to repo root in vitest and tsconfig.
- Coverage: v8 provider, reports to ./coverage. IMPORTANT: include is app/**/*.{ts,tsx}. Code outside app (e.g., components/**) won’t count toward coverage unless include is adjusted.
- Types for tests come from tsconfig.test.json.
- Example pattern:
  - Place *.test.ts(x) next to the unit under test.
  - Use @testing-library/react and @testing-library/jest-dom matchers.

## UI & Component Patterns
- Prefer components/ui/** primitives (Button, Card, Dialog, Tooltip, etc.) and Tailwind utility classes.
- Use 'use client' at the top of interactive components/pages.
- Respect design tokens via CSS variables configured in tailwind.config.ts (colors, radius, animations).

## AI Integration Patterns
- Global widget: app/layout.tsx wraps children with AIWidgetProvider; toggle via Ctrl/Cmd+K.
- Local control: useAIWidget() hook exposes showWidget/hideWidget/toggleWidget; AIWidgetTrigger is a ready-made trigger component.
- Agent core: import from lib/agentic-core (AgenticCore, MessageBus, TaskScheduler, StateManager) for agent features beyond the floating widget.
- Demo route: app/ai-floating-demo can be used to verify widget behavior in isolation.

## Docker & Compose Notes
- Multi-stage build produces .next/standalone; runner CMD executes node server.js. Healthcheck hits /api/health — ensure an API route exists or adjust healthcheck to avoid false negatives.
- docker-compose.yml wires Postgres and Redis with healthchecks; app exposes 3000 inside the container (published to 3000 by default).

## Examples
- Path alias import:

```ts
import { Button } from '@/components/ui/button'
import { AgenticCore } from '@/lib/agentic-core'
```

- Test snippet with RTL:

```ts
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'

test('renders header search input', () => {
  render(<Header />)
  expect(screen.getByPlaceholderText('搜索客户、任务、项目...')).toBeInTheDocument()
})
```

## When Adding Code
- Place route UI under app/** with page.tsx and add 'use client' if interactive.
- Reuse components/ui/** primitives; align with Tailwind tokens.
- If you need coverage to include new folders (e.g., components/**), update vitest.config.ts test.coverage.include accordingly.
- Don’t duplicate router or fetch mocks in tests; rely on src/test/setup.ts.
