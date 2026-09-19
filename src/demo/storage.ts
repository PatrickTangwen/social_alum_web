// Browser-only stand-ins for what a backend would hold.
// sessionStorage: the Verified Session and the live Verification Code (tab-scoped).
// localStorage: the set of Verified Emails that already have a Registration.
// Everything here is replaced by real server state when the backend exists.

import type { IssuedCode } from "@/domain/verificationCode";
import type { Registration } from "@/domain/registration";

export const SESSION_TTL_MS = 60 * 60 * 1000;

const SESSION_KEY = "career-explorer.verifiedSession";
const PENDING_CODE_KEY = "career-explorer.pendingCode";
const REGISTRY_KEY = "career-explorer.registrations";

export type VerifiedSession = { email: string; expiresAt: number };

export function readVerifiedSession(now: number): VerifiedSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const session: VerifiedSession = JSON.parse(raw);
  if (now >= session.expiresAt) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session;
}

export function startVerifiedSession(email: string, now: number): VerifiedSession {
  const session = { email, expiresAt: now + SESSION_TTL_MS };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function endVerifiedSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function readPendingCode(): IssuedCode | null {
  const raw = sessionStorage.getItem(PENDING_CODE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function savePendingCode(issued: IssuedCode) {
  sessionStorage.setItem(PENDING_CODE_KEY, JSON.stringify(issued));
}

export function clearPendingCode() {
  sessionStorage.removeItem(PENDING_CODE_KEY);
}

function readRegistry(): Record<string, Registration> {
  const raw = localStorage.getItem(REGISTRY_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function hasRegistration(email: string) {
  return email in readRegistry();
}

export function saveRegistration(registration: Registration) {
  const registry = readRegistry();
  registry[registration.verifiedEmail] = registration;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

export function resetDemo() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(PENDING_CODE_KEY);
  localStorage.removeItem(REGISTRY_KEY);
}
