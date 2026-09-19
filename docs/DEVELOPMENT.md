# Developing this repository

Front-end demo of the Career Explorer registration form. Vocabulary used throughout the
code is defined in [CONTEXT.md](../CONTEXT.md); architecture decisions are in
[docs/adr/](adr/).

**Current stage: front-end demo.** There is no backend. Verification codes are shown in an
on-page "Demo inbox", the verified state lives in `sessionStorage`, and submitted
registrations live in `localStorage`. The "Reset demo" link under the form clears everything.

## Run

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000. `pnpm build` produces a static export-ready build;
`pnpm lint` and `pnpm exec tsc --noEmit` must both pass.

## Embedding

The form ships as an embed for a Host Page, currently the Yale Center for Business and the
Environment site. It does not bring a page of its own: the Host Page supplies the font,
text size, line height, text color, and heading style, and the embed inherits them.

```bash
pnpm build:embed
```

Writes `dist-embed/career-explorer-registration.js` and `.css`, plus a stand-in Host Page
(`index.html`, `host.css`, fonts) copied from `demo/public/`, and `README.md` copied as
`INTEGRATION.md`, so the built files can be opened as they would be on the real site
(`python3 -m http.server 3001 --directory dist-embed`). `pnpm pack:embed` builds and zips
that folder as `career-explorer-registration-<version>.zip` for handoff.

The Host Page needs the three lines shown in the [README](../README.md), which is the
integration guide for the Host Page's developer. Every placeholder present when the script
runs is mounted; `CareerExplorerRegistration.mount(el)` mounts one added later.

What the embed's stylesheet does and does not do (see ADR-0001):

- No Preflight, no `html`/`body` rules, no font-family, base size, line height, or text color.
  Text sizes are `em`-based, spacing `rem`-based, layout uses container queries.
- Utilities are prefixed `ce:` and not wrapped in `@layer`, so they neither collide with
  Host Page classes nor lose to unlayered Host Page CSS by default.
- A reset scoped to `.ce-root` normalizes box model, list markers, fieldset chrome, and
  form-control fonts; it beats bare-element rules of the Host Page and nothing else.
- Component colors come from `--ce-*` custom properties the Host Page may set on any ancestor:
  `--ce-brand`, `--ce-brand-dark`, `--ce-on-brand`, `--ce-link`, `--ce-muted`, `--ce-line`,
  `--ce-surface`, `--ce-panel`, `--ce-tint`, `--ce-error`, `--ce-success`.

## Layout

- `src/domain/` — pure rules with no browser or React dependency: the Eligibility Check
  (`eligibility.ts`), Verification Code rules (`verificationCode.ts`), and the Registration
  shape, option lists, and validation (`registration.ts`).
- `src/demo/storage.ts` — browser-storage stand-ins for what a backend would hold. Replace
  this file when the backend exists.
- `src/components/` — the stepper: `RegistrationFlow` owns the stage machine; `EmailStep`,
  `CodeStep`, `RegistrationForm`, `ConfirmationStep`, `AlreadyRegistered` are the screens;
  `DemoInbox` stands in for the visitor's mailbox. All classes are `ce:`-prefixed Tailwind.
- `src/embed/` — what the Host Page receives: `RegistrationEmbed` (the root element),
  `embed.css` and `embed-base.css` (the stylesheet), `index.tsx` (the script entry that mounts
  placeholders). Built by `vite.config.mts`.
- `src/app/` — Next.js dev harness: a stand-in Host Page (`PageShell`, styled by
  `demo/public/host.css`) around the embed.
- `demo/public/` — the stand-in Host Page for the built embed, copied into `dist-embed/`.
- `README.md` — the integration guide for the Host Page's developer; also shipped in the zip.

The embed has no visual language of its own beyond component chrome (light panels, thin
borders, Yale Blue buttons by default); typography is the Host Page's.

## Decisions already made

- Allowed Domain is `yale.edu` including subdomains, configured in `src/domain/eligibility.ts`.
- Verification Code: 10-minute expiry, 5 wrong attempts, 60-second resend cooldown, one live
  code per email, destroyed on success.
- Verified Session: 1 hour, survives reloads, ends on successful Registration.
- One Registration per Verified Email; Registrations cannot be edited.
- Form fields are defined in code, not derived from any external schema.

## Deferred until the backend exists

These were discussed and parked, not decided:

- Storage: a new flat `Registrations` table in the "WIP: Yale SoM Base" Airtable base, with
  the Verified Email as the unique key, rather than writing into the `People` table directly.
- Email delivery via Resend from a domain the CDO controls; IP-based rate limiting via
  Upstash; a signed HttpOnly cookie for the Verified Session.
- ADRs for "flat Registrations table instead of People" and "no accounts, domain plus code
  as the only gate".
- Any path for alumni who no longer have a Yale email address.
