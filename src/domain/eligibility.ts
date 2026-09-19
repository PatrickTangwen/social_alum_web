// Eligibility Check: an email address belongs to an Allowed Domain.
// See CONTEXT.md. This is a syntactic check only; no account is involved.

export const ALLOWED_DOMAINS = ["yale.edu"];

export type EligibilityResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid" | "not-allowed" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkEligibility(rawEmail: string): EligibilityResult {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return { ok: false, reason: "invalid" };

  const domain = email.slice(email.lastIndexOf("@") + 1);
  const allowed = ALLOWED_DOMAINS.some(
    (allowedDomain) => domain === allowedDomain || domain.endsWith("." + allowedDomain),
  );
  return allowed ? { ok: true, email } : { ok: false, reason: "not-allowed" };
}
