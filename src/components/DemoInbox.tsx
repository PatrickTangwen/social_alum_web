"use client";

import { useEffect, useState } from "react";
import type { IssuedCode } from "@/domain/verificationCode";

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Stands in for the Registrant's mailbox. No email is sent in the demo.
export function DemoInbox({ issued }: { issued: IssuedCode }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const expired = now >= issued.expiresAt;

  return (
    <aside
      aria-label="Demo inbox"
      className="ce:fixed ce:right-4 ce:bottom-4 ce:z-10 ce:w-[min(22rem,calc(100vw-2rem))] ce:rounded ce:border ce:border-line ce:bg-surface ce:shadow-lg"
    >
      <div className="ce:flex ce:items-center ce:justify-between ce:border-b ce:border-line ce:bg-panel ce:px-4 ce:py-2">
        <span className="ce:text-xs ce:font-semibold ce:uppercase ce:tracking-[0.12em] ce:text-brand">Demo inbox</span>
        <span className="ce:text-xs ce:text-muted">no email is actually sent</span>
      </div>
      <div className="ce:flex ce:flex-col ce:gap-2 ce:px-4 ce:py-3">
        <p className="ce:text-sm">
          <span className="ce:text-muted">To:</span> {issued.email}
        </p>
        <p className="ce:text-sm ce:font-semibold">Your Career Explorer verification code</p>
        <p className="ce:font-mono ce:text-3xl ce:leading-tight ce:tracking-[0.3em] ce:text-brand">{issued.code}</p>
        <p className="ce:text-sm ce:text-muted">
          {expired ? "This code has expired." : `Expires in ${formatRemaining(issued.expiresAt - now)}.`}
        </p>
      </div>
    </aside>
  );
}
