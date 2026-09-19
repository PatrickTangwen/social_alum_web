# social_alum_web

Front-end demo of a gated alumni registration form for the Yale SOM Career Development
Office. Read `CONTEXT.md` for the vocabulary (Allowed Domain, Verification Code, Verified
Session, Registrant, Registration, Career Explorer) and use it in code and issues. `docs/DEVELOPMENT.md`
describes the layout and which backend decisions are deferred; `README.md` is the integration
guide for the Host Page's developer and is copied into the embed zip as `INTEGRATION.md`.

- Package manager: pnpm. Next.js App Router, Tailwind v4, TypeScript.
- Pure rules live in `src/domain/` and must stay free of React and browser APIs.
- `src/demo/storage.ts` is the only place that touches browser storage; it is a stand-in for
  the future backend.
- The form is an embed for a Host Page (`src/embed/`, ADR-0001). Components use
  `ce:`-prefixed Tailwind classes only; never add font-family, base font-size, line-height,
  text color, or `html`/`body` rules to the embed, and put page chrome in the harness
  (`src/app/`, `demo/public/`), not in the embed.
- Before finishing: `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build:embed` must pass.

## Agent skills

### Issue tracker

Issues are tracked as GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage labels are used verbatim (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
