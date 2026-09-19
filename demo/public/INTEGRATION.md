# Career Explorer Registration — integration guide

This folder contains an embeddable registration form for the Yale SOM Career Development
Office's Social Impact Career Explorer. It is meant to sit inside an existing page of
cbey.yale.edu and to look like part of that page: it inherits the page's font, text size,
line height, text color, and heading style, and brings only its own component styling
(inputs, buttons, panels).

**Current stage: demo.** There is no backend yet. Verification codes appear in an on-page
"Demo inbox" panel, and submitted registrations stay in the visitor's browser. The embed
makes no network requests. A later version will talk to a backend; the page integration
described here will not change.

## Files

| File | Purpose |
| --- | --- |
| `career-explorer-registration.js` | The form (React is bundled in, no other dependencies). |
| `career-explorer-registration.css` | Its component styles. |
| `index.html`, `host.css`, `fonts/` | A stand-in host page, only for trying the files locally. Do not deploy. |

Both files are static and can be served from anywhere on the site. Keep them together in
one folder; there are no other assets.

## Adding the form to a page

Three things are needed on the page:

```html
<link rel="stylesheet" href="/path/to/career-explorer-registration.css" />

<div data-career-explorer-registration></div>

<script src="/path/to/career-explorer-registration.js" defer></script>
```

- The `<div>` marks where the form appears. Put it in the page's main content column; the
  form uses the full width it is given and lays itself out by that width (down to about
  320px).
- The script mounts every `[data-career-explorer-registration]` placeholder that exists once
  the DOM is ready. Order and placement of the script tag do not matter. If a placeholder is
  inserted later (for example by AJAX), call `CareerExplorerRegistration.mount(element)`.
- The stylesheet should load after the site's own stylesheets, which is the normal order.

### On Drupal

Two common ways, pick whichever fits the site:

1. **HTML paragraph or block with a text format that allows `<script>`.** Paste the three
   lines above into the page. Nothing else to configure.
2. **Theme library.** Copy the two files into the theme (for example
   `themes/custom/cbey/career-explorer-registration/`), declare a library, attach it to the
   page, and keep only the `<div>` in the page content:

   ```yaml
   # cbey.libraries.yml
   career-explorer-registration:
     version: 0.1.0
     css:
       theme:
         career-explorer-registration/career-explorer-registration.css: {}
     js:
       career-explorer-registration/career-explorer-registration.js:
         attributes: { defer: true }
   ```

   Attach with `{{ attach_library('cbey/career-explorer-registration') }}` in the page or
   node template, or with `#attached` in a preprocess hook for that node. The Asset
   Injector module works as well.

Drupal's CSS/JS aggregation is fine; the files have no relative URLs.

## What the form inherits from the page

The stylesheet has no global rules: no reset, no `html`/`body` styling, no font-family,
base font size, line height, or text color. Inside the form:

- Body text, labels, buttons, and inputs use the page's font and the font size inherited
  by the placeholder's container. Small text is a fraction of that size.
- Section headings are `<h2>` elements, so they take the site's `h2` font, weight, and
  color, scaled to 1.5× the surrounding text.
- All class names are prefixed `ce:` and all element ids are prefixed `ce-`, so nothing
  collides with the site's own classes or ids.

Page rules that target bare elements (`p`, `button`, `fieldset`, `ol`, ...) are neutralized
inside the form for box model, margins, list markers, and form-control fonts only. A site
rule with a higher specificity than one class, such as `.region button { ... }`, still
applies inside the form. If one is unwanted there, scope it away from
`[data-career-explorer-registration]`.

## Colors the page can override

Component colors are read from CSS custom properties. Set any of them on the placeholder
or any ancestor (including `:root`); unset ones keep their default.

| Property | Used for | Default |
| --- | --- | --- |
| `--ce-brand` | Primary button, selected options, step badges | `#00356b` |
| `--ce-brand-dark` | Primary button on hover | `#002a55` |
| `--ce-on-brand` | Text on the brand color | `#ffffff` |
| `--ce-link` | Text links, input focus ring | `#286dc0` |
| `--ce-line` | Borders | `#d4d4d4` |
| `--ce-surface` | Card and input backgrounds | `#ffffff` |
| `--ce-panel` | Step bar background, option hover | `#f7f8fa` |
| `--ce-tint` | Selected option background, info notices | `#e8eef5` |
| `--ce-muted` | Secondary text | 65% of the inherited text color |
| `--ce-error` | Validation messages and error notices | `#b3261e` |
| `--ce-success` | Success notice | `#1f5c2a` |

Example:

```css
[data-career-explorer-registration] {
  --ce-brand: #00854b;
  --ce-brand-dark: #006b3c;
  --ce-link: #155485;
}
```

## Behavior worth knowing

- Moving between steps scrolls the form's top edge into view. If the site has a sticky
  header, give the placeholder a `scroll-margin-top` equal to the header's height.
- The Demo inbox is a small fixed panel at the bottom right of the viewport while a code is
  pending. It exists only in the demo and will go away with the backend.
- A "Reset demo" link under the form clears everything the demo stored in the browser.
- No cookies, no external requests, no third-party scripts. A Content Security Policy
  needs nothing beyond allowing the two files from where they are served.

## Updating

Later versions are delivered as the same two files. Replace them in place, or put each
version in its own folder (for example `career-explorer-registration/0.2.0/`) and change
the two paths; clear Drupal's cache after replacing. The version is in the first line of
each file.

## Trying it locally

Serve this folder with any static server and open `index.html`:

```bash
python3 -m http.server 3001
```

`index.html` and `host.css` imitate a page of the site; the form inside is exactly what the
two files render on any page.
