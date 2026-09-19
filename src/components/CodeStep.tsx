"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MAX_ATTEMPTS, resendAvailableAt, type IssuedCode } from "@/domain/verificationCode";
import { Button, Field, LinkButton, Notice, SectionHeading, TextInput } from "./ui";

type Props = {
  issued: IssuedCode;
  message: string;
  onVerify: (entered: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
};

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export function CodeStep({ issued, message, onVerify, onResend, onChangeEmail }: Props) {
  const [entered, setEntered] = useState("");
  const now = useNow();

  const resendIn = Math.max(0, Math.ceil((resendAvailableAt(issued) - now) / 1000));
  const expired = now >= issued.expiresAt;
  const locked = issued.attempts >= MAX_ATTEMPTS;
  const needsNewCode = expired || locked;

  function submit(event: FormEvent) {
    event.preventDefault();
    onVerify(entered);
  }

  return (
    <form onSubmit={submit} noValidate className="ce:flex ce:flex-col ce:gap-6">
      <div>
        <SectionHeading>Enter your verification code</SectionHeading>
        <p className="ce:mt-2">
          We sent a six-digit code to <span className="ce:font-semibold">{issued.email}</span>. It
          expires ten minutes after it was sent.
        </p>
      </div>

      {message && <Notice tone="error">{message}</Notice>}

      <Field label="Verification code" htmlFor="ce-code" hint="Six digits, no spaces.">
        <TextInput
          id="ce-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="••••••"
          className="ce:w-full ce:max-w-[9.5em] ce:rounded ce:border ce:border-line ce:bg-surface ce:px-3 ce:py-2.5 ce:font-mono ce:text-2xl ce:tracking-[0.5em] ce:placeholder:text-muted ce:focus:border-link ce:focus:outline-none ce:focus:ring-2 ce:focus:ring-link/25"
          value={entered}
          onChange={(e) => setEntered(e.target.value.replace(/\D/g, "").slice(0, 6))}
          disabled={needsNewCode}
          autoFocus
        />
      </Field>

      <div className="ce:flex ce:flex-wrap ce:items-center ce:gap-4">
        <Button type="submit" disabled={needsNewCode || entered.length !== 6}>
          Verify
        </Button>
        <Button type="button" variant="secondary" onClick={onResend} disabled={resendIn > 0}>
          {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </Button>
        <LinkButton onClick={onChangeEmail}>Use a different email</LinkButton>
      </div>
    </form>
  );
}
