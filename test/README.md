# Ticker Wars — Agent Docs

Context docs for coding agents (Claude Code / Codex). Read the file(s) matching your
task instead of loading everything. Each doc is single-responsibility so you can share
a focused subset.

## What this project is

Ticker Wars is a price prediction platform that compares stock-prediction models across four
horizons (`1W | 1M | 3M | 1Y`). A Python pipeline ingests data, generates and scores
predictions, and refreshes Supabase dashboard tables; a React/TypeScript app reads those
tables directly. Human users can also sign in and compete with their own predictions.
It is **educational** — not a trading product or financial advice. The repo is named
`next-day-price`; the product is **Ticker Wars**. Keep the term "prediction" (never
"forecast") unless asked. Users can also sign up and make predictions to compete with the ML models.

## Reading guide

| Doc | Read it when you are working on… |
| --- | --- |
| [01-architecture.md](01-architecture.md) | Anything — the orientation map: stack, repo layout, data flow. Start here. |
| [02-pipeline.md](02-pipeline.md) | The Python pipeline: CLI, ingestion, models, evaluation, daily + live-price runs. |
| [03-supabase.md](03-supabase.md) | Database: migrations, tables, RLS, auth provider setup. |
| [04-frontend.md](04-frontend.md) | React app behavior: routing/auth gates, pages, data contract, caching, user flows. |
| [05-frontend-design.md](05-frontend-design.md) | UI/UX redesign: styling, spotlight system, shared controls, component patterns. |
| [06-operations.md](06-operations.md) | GitHub Actions, Vercel, secrets, local env, runbooks. |

Common combos: **frontend redesign** → 05 (+04). **Pipeline/data change** → 02 + 03.
**Deploy/ops** → 06 (+03).

## Conventions

- Keep these docs current. When you change behavior, update the matching doc in the same
  change; don't append a new status doc.
- Be concrete: name files as `path:line` where it helps. Cut prose that the code already
  states plainly.
- Verify before trusting: a doc reflects the repo at write time. If it names a file/flag,
  confirm it still exists.

## Active work

The current branch (`codex/live-pricing`) is implementing a live intraday-price layer. The
full design rationale lives in [archive/LivePricingPlan.md](archive/LivePricingPlan.md);
the implemented state is folded into docs 02–04.

## archive/

Historical design/investigation docs, kept for rationale but **not** loaded by default:
`LivePricingPlan`, `DashboardRefactorPlan`, `HumanUsersPlan`, `ScrollFixPlan`,
`TickerExpansionInvestigation`. Reach for one only when you need the "why" behind a
decision the numbered docs summarize.
