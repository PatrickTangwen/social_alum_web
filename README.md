# Career Explorer registration form

An embeddable registration form for the Yale SOM Career Development Office's Social Impact
Career Explorer, built to sit on a subpage of cbey.yale.edu. This page is the reference for
the developer placing it there. Full details are in
[`INTEGRATION.md`](demo/public/INTEGRATION.md).

## What you get

Two static files, no external dependencies, no network requests:

- `career-explorer-registration.js`
- `career-explorer-registration.css`

They are delivered as `career-explorer-registration-<version>.zip`, together with
`INTEGRATION.md` and an `index.html` for previewing locally (`python3 -m http.server` in the
unzipped folder). To build the zip from source: `pnpm install && pnpm pack:embed`.

## Putting it on a page

```html
<link rel="stylesheet" href="/path/to/career-explorer-registration.css" />
<div data-career-explorer-registration></div>
<script src="/path/to/career-explorer-registration.js" defer></script>
```

The `<div>` marks where the form appears; the script mounts it once the DOM is ready,
wherever the script tag sits. If the page's text format does not allow `<script>`, attach
the two files as a Drupal theme library instead; `INTEGRATION.md` has the `libraries.yml`.

The form looks like part of the page rather than bringing its own look: it has no global
styles, it inherits the site's font, text size, line height, text color and `h2` heading
style, and all of its class names and ids are prefixed so nothing collides with the theme.
Button, border and panel colors can be adjusted with CSS custom properties listed in
`INTEGRATION.md`.

## Current stage

This is a demo build. There is no backend yet: verification codes appear in an on-page
"Demo inbox" panel and submissions stay in the visitor's browser. When the backend is ready,
updated versions of the same two files will follow; the page integration will not change.

## Questions for you

1. Which subpage will host the form, and how do you prefer to attach scripts (HTML block,
   theme library, or something else)?
2. Does the page use a sticky header? If so, we will add the right `scroll-margin-top` so
   step changes scroll to the correct spot.
3. Any Content Security Policy or other constraints we should account for?

Open an issue in this repository or reply to the email that pointed you here.

---

Working on the code itself: see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
