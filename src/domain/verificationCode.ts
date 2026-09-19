// Verification Code rules. See CONTEXT.md.
// A code is six digits, single-use, short-lived, and only one is live per email.

export const CODE_TTL_MS = 10 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_MS = 60 * 1000;

export type IssuedCode = {
  email: string;
  code: string;
  issuedAt: number;
  expiresAt: number;
  attempts: number;
};

function randomSixDigits() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(value).padStart(6, "0");
}

export function issueCode(email: string, now: number): IssuedCode {
  return {
    email,
    code: randomSixDigits(),
    issuedAt: now,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
  };
}

export function resendAvailableAt(issued: IssuedCode) {
  return issued.issuedAt + RESEND_COOLDOWN_MS;
}

export type CheckOutcome =
  | { status: "verified" }
  | { status: "expired" }
  | { status: "locked"; issued: IssuedCode }
  | { status: "wrong"; remaining: number; issued: IssuedCode };

export function checkCode(issued: IssuedCode, entered: string, now: number): CheckOutcome {
  if (now >= issued.expiresAt) return { status: "expired" };
  if (issued.attempts >= MAX_ATTEMPTS) return { status: "locked", issued };
  if (entered === issued.code) return { status: "verified" };

  const attempts = issued.attempts + 1;
  const updated = { ...issued, attempts };
  if (attempts >= MAX_ATTEMPTS) return { status: "locked", issued: updated };
  return { status: "wrong", remaining: MAX_ATTEMPTS - attempts, issued: updated };
}
