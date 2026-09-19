import type { ReactNode } from "react";

// Stand-in Host Page around the embed for local development. Styled by demo/public/host.css
// with plain CSS, the way a Host Page would be; nothing here uses the embed's classes.
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="host-breadcrumb">
        <ol className="host-container">
          <li>Yale SOM</li>
          <li aria-hidden="true">/</li>
          <li>Career Development Office</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Join the Career Explorer</li>
        </ol>
      </nav>

      <header className="host-hero">
        <div className="host-container">
          <p className="host-eyebrow">Career Development Office</p>
          <h1>Join the Career Explorer</h1>
          <p>
            Yale SOM and YSE alumni working in social impact can add themselves to the Career
            Explorer. Verify your Yale email to get started.
          </p>
        </div>
      </header>

      <main className="host-container host-main">{children}</main>

      <footer className="host-footer">
        <div className="host-container">
          <p>
            Social Impact Career Wayfinder · Yale School of Management &amp; School of the
            Environment · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
