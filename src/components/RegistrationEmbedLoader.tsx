"use client";

import dynamic from "next/dynamic";

// The flow resumes from browser storage, so it renders on the client only.
export const RegistrationEmbedLoader = dynamic(
  () => import("@/embed/RegistrationEmbed").then((m) => m.RegistrationEmbed),
  { ssr: false, loading: () => <p>Loading…</p> },
);
