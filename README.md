# Join the Career Explorer

A gated registration form for Yale SOM and YSE alumni who want to add themselves to the
Career Development Office's Social Impact Career Explorer. Visitors prove control of a
Yale email address with a six-digit verification code, then fill in one form.

**Current stage: front-end demo.** There is no backend. Verification codes are shown in an
on-page "Demo inbox", the verified state lives in `sessionStorage`, and submitted
registrations live in `localStorage`. The "Reset demo" link under the form clears everything.

Vocabulary used throughout the code is defined in [CONTEXT.md](./CONTEXT.md).

## For the developer of the CBEY page

This section is for whoever places the form on a subpage of cbey.yale.edu. The form is
packaged so it drops into an existing Drupal page with minimal work.

**What you get**

Two static files, with no external dependencies and no network requests:

- `career-explorer-registration.js`
- `career-explorer-registration.css`

They come in `career-explorer-registration-<version>.zip` together with
[`INTEGRATION.md`](demo/public/INTEGRATION.md), a guide written for you (what to paste, how to
attach the files as a Drupal theme library if the page's text format does not allow
`<script>`, what the form inherits from the page, and which colors can be overridden), and an
`index.html` for previewing locally (`python3 -m http.server` in the unzipped folder). If you
prefer to build the zip yourself: `pnpm install && pnpm pack:embed`.

**How it goes on a page**

```html
<link rel="stylesheet" href="/path/to/career-explorer-registration.css" />
<div data-career-explorer-registration></div>
<script src="/path/to/career-explorer-registration.js" defer></script>
```

The `<div>` marks where the form appears; the script mounts it once the DOM is ready, wherever
the script tag sits. The form is designed to look like part of your page rather than bring
its own look: it has no global styles, it inherits the site's font, text size, line height,
text color and `h2` heading style, and all of its class names and ids are prefixed so nothing
collides with the theme. Button, border and panel colors can be adjusted with a few CSS
custom properties if you want them closer to the CBEY palette; `INTEGRATION.md` lists them.

**One thing to know**

This is a demo build. There is no backend yet: verification codes appear in an on-page "Demo
inbox" panel and submissions stay in the visitor's browser. When the backend is ready, we will
send updated versions of the same two files; the page integration will not change.

**What we would like to know from you**

1. Which subpage will host the form, and how do you prefer to attach scripts (HTML block,
   theme library, or something else)?
2. Does the page use a sticky header? If so, we will add the right `scroll-margin-top` so
   step changes scroll to the correct spot.
3. Any Content Security Policy or other constraints we should account for?

Open an issue in this repository or reply to the email that pointed you here.

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
(`index.html`, `host.css`, fonts) and `INTEGRATION.md` copied from `demo/public/` so the
built files can be opened as they would be on the real site
(`python3 -m http.server 3001 --directory dist-embed`). `pnpm pack:embed` builds and zips
that folder as `career-explorer-registration-<version>.zip` for handoff.

The Host Page needs the three lines shown above. Every placeholder present when the script
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
