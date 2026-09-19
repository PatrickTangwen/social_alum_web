"use client";

import { useState, type FormEvent } from "react";
import { ALLOWED_DOMAINS, checkEligibility } from "@/domain/eligibility";
import { Button, Field, SectionHeading, TextInput } from "./ui";

type Props = { onEligible: (email: string) => void };

export function EmailStep({ onEligible }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = checkEligibility(email);
    if (result.ok) {
      onEligible(result.email);
      return;
    }
    setError(
      result.reason === "invalid"
        ? "Enter a valid email address."
        : `Only ${ALLOWED_DOMAINS.map((d) => "@" + d).join(", ")} addresses (including subdomains) can register.`,
    );
  }

  return (
    <form onSubmit={submit} noValidate className="ce:flex ce:flex-col ce:gap-6">
      <div>
        <SectionHeading>Verify your Yale email</SectionHeading>
        <p className="ce:mt-2">
          We will send a six-digit verification code to your Yale address. Alumni email addresses
          on a Yale subdomain, such as <span className="ce:font-semibold">aya.yale.edu</span>, work
          too.
        </p>
      </div>

      <Field label="Yale email address" htmlFor="ce-email" error={error}>
        <TextInput
          id="ce-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@yale.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          aria-invalid={error ? true : undefined}
          autoFocus
        />
      </Field>

      <div>
        <Button type="submit">Send verification code</Button>
      </div>
    </form>
  );
}
