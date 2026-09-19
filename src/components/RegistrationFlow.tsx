"use client";

import { useRef, useState } from "react";
import { checkCode, issueCode, type IssuedCode } from "@/domain/verificationCode";
import { completeRegistration, type Registration, type RegistrationDraft } from "@/domain/registration";
import {
  clearPendingCode,
  endVerifiedSession,
  hasRegistration,
  readPendingCode,
  readVerifiedSession,
  savePendingCode,
  saveRegistration,
  startVerifiedSession,
} from "@/demo/storage";
import { AlreadyRegistered } from "./AlreadyRegistered";
import { CodeStep } from "./CodeStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { DemoInbox } from "./DemoInbox";
import { EmailStep } from "./EmailStep";
import { RegistrationForm } from "./RegistrationForm";
import { Stepper } from "./Stepper";

type Stage =
  | { kind: "email" }
  | { kind: "code"; issued: IssuedCode; message: string }
  | { kind: "form"; email: string }
  | { kind: "already"; email: string }
  | { kind: "done"; registration: Registration };

function stageAfterVerification(email: string): Stage {
  return hasRegistration(email) ? { kind: "already", email } : { kind: "form", email };
}

// Resume wherever the visitor left off. Runs on the client only (see RegistrationEmbedLoader).
function initialStage(): Stage {
  const now = Date.now();
  const session = readVerifiedSession(now);
  if (session) return stageAfterVerification(session.email);

  const pending = readPendingCode();
  if (pending && now < pending.expiresAt) return { kind: "code", issued: pending, message: "" };

  clearPendingCode();
  return { kind: "email" };
}

export function RegistrationFlow() {
  const [stage, setStage] = useState<Stage>(initialStage);
  const card = useRef<HTMLDivElement>(null);

  // Every move between steps starts at the top of the form, wherever the Host Page put it.
  function advance(next: Stage) {
    setStage(next);
    card.current?.scrollIntoView({ block: "start" });
  }

  function sendCode(email: string) {
    const issued = issueCode(email, Date.now());
    savePendingCode(issued);
    advance({ kind: "code", issued, message: "" });
  }

  function verify(issued: IssuedCode, entered: string) {
    const outcome = checkCode(issued, entered, Date.now());
    switch (outcome.status) {
      case "verified":
        clearPendingCode();
        startVerifiedSession(issued.email, Date.now());
        advance(stageAfterVerification(issued.email));
        return;
      case "expired":
        setStage({ kind: "code", issued, message: "That code has expired. Request a new one." });
        return;
      case "locked":
        savePendingCode(outcome.issued);
        setStage({
          kind: "code",
          issued: outcome.issued,
          message: "Too many incorrect attempts. Request a new code.",
        });
        return;
      case "wrong":
        savePendingCode(outcome.issued);
        setStage({
          kind: "code",
          issued: outcome.issued,
          message: `That code is not correct. ${outcome.remaining} ${outcome.remaining === 1 ? "attempt" : "attempts"} left.`,
        });
        return;
    }
  }

  function changeEmail() {
    clearPendingCode();
    advance({ kind: "email" });
  }

  function submit(email: string, draft: RegistrationDraft) {
    const registration = completeRegistration(draft, email, Date.now());
    saveRegistration(registration);
    endVerifiedSession();
    console.log("Registration payload (would be sent to the backend):", registration);
    advance({ kind: "done", registration });
  }

  const stepIndex =
    stage.kind === "email" ? 0 : stage.kind === "code" ? 1 : stage.kind === "form" ? 2 : 3;

  return (
    <>
      <div ref={card} className="ce:overflow-hidden ce:rounded-md ce:border ce:border-line ce:bg-surface">
        <Stepper current={stepIndex} />
        <div className="ce:px-6 ce:py-8">
          {stage.kind === "email" && <EmailStep onEligible={sendCode} />}
          {stage.kind === "code" && (
            <CodeStep
              key={stage.issued.issuedAt}
              issued={stage.issued}
              message={stage.message}
              onVerify={(entered) => verify(stage.issued, entered)}
              onResend={() => sendCode(stage.issued.email)}
              onChangeEmail={changeEmail}
            />
          )}
          {stage.kind === "form" && (
            <RegistrationForm verifiedEmail={stage.email} onSubmit={(draft) => submit(stage.email, draft)} />
          )}
          {stage.kind === "already" && <AlreadyRegistered email={stage.email} />}
          {stage.kind === "done" && <ConfirmationStep registration={stage.registration} />}
        </div>
      </div>
      {stage.kind === "code" && <DemoInbox issued={stage.issued} />}
    </>
  );
}
