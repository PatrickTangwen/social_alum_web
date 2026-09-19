# ADR-0001: The Registration Embed lives in the Host Page's DOM and inherits its typography

Date: 2026-09-18

## Context

The registration form will be embedded in a page of the Yale Center for Business and the
Environment site (cbey.yale.edu, a Drupal site), not served as a page of its own. The
embedded form should look like part of that page: its font, text size, line height, text
color, and heading style should be the Host Page's, not ours.

Inspection of cbey.yale.edu showed what the embed has to coexist with:

- Global element rules without `@layer`: a reset on every tag, `p` with a large bottom
  margin, `h2` with a large serif size, and rules on `button`, `fieldset`, `legend`, `ol`,
  `label`, `input`, and `select`.
- Unprefixed class names that Tailwind also generates, such as `.hidden` and `.block`.
- A root font size of 16px and a body font size of 18px.

## Decision

1. **Light DOM, one placeholder.** The embed is a script plus a stylesheet that mount into
   `<div data-career-explorer-registration></div>`. No iframe and no Shadow DOM, so the
   Host Page's element rules (fonts, headings, links) apply inside the embed.
2. **No page-level styles.** The embed's stylesheet has no Preflight, no `html` or `body`
   rules, no font-family (except monospace for the Verification Code), no base font size,
   no line height, and no text color. Text sizes are `em`-based so they follow the size the
   Host Page gives the container; spacing is `rem`-based so it follows the Host Page's root
   size.
3. **Component colors only, all overridable.** Brand, link, border, panel, notice, and
   muted colors are read from `--ce-*` custom properties with defaults. Muted text is
   derived from the inherited text color by default.
4. **Prefixed, unlayered utilities.** Every Tailwind class carries the `ce:` prefix and the
   generated CSS is not wrapped in `@layer`, so Host Page classes are neither shadowed nor
   overridden and ordinary specificity decides conflicts.
5. **A scoped reset at specificity (0,1,0).** Inside `.ce-root` only, box model, list
   markers, fieldset chrome, and form-control fonts are normalized. It beats the Host
   Page's bare-element rules and loses to the embed's own utilities.
6. **Container queries, not media queries.** The form lays itself out by the width the
   Host Page gives it.
7. **The standalone page is a harness.** The Next.js page and `demo/public/index.html` are
   stand-ins for the Host Page. They reproduce the shapes of cbey.yale.edu's element rules
   so that the embed is exercised against them, and nothing in them ships with the embed.

## Consequences

- A Host Page rule with specificity above (0,1,0) that targets a bare element, for example
  `.region button { ... }`, applies inside the embed. That is intended: the Host Page owns
  the look. Where it is unwanted, the Host Page can scope its rule away from
  `[data-career-explorer-registration]`.
- Section headings render with the Host Page's `h2` font, weight, and color, scaled to
  1.5em. If the Host Page's heading style does not suit a form, the Host Page adjusts it.
- The single-file demo build was dropped; `pnpm build:embed` produces the embed and a
  stand-in Host Page next to it.
