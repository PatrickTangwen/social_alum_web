"use client";

import { RegistrationFlow } from "@/components/RegistrationFlow";
import { ResetDemoLink } from "@/components/ResetDemoLink";

// Root of everything the Host Page receives. `.ce-root` scopes the embed's reset
// (embed-base.css); the container query lets the form lay itself out by the width it is
// given rather than by the viewport.
export function RegistrationEmbed() {
  return (
    <div className="ce-root ce:@container">
      <RegistrationFlow />
      <p className="ce:mt-3 ce:text-sm ce:text-muted">
        Demo build: registrations stay in this browser and no email is sent. <ResetDemoLink />
      </p>
    </div>
  );
}
