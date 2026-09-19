import { Notice, SectionHeading } from "./ui";

export function AlreadyRegistered({ email }: { email: string }) {
  return (
    <div className="ce:flex ce:flex-col ce:gap-6">
      <div>
        <SectionHeading>You are already registered</SectionHeading>
        <p className="ce:mt-2">
          A registration already exists for <span className="ce:font-semibold">{email}</span>. Each
          Yale email can register once, and registrations cannot be edited here.
        </p>
      </div>
      <Notice>
        To change your details, contact the Career Development Office. In this demo, the link
        “Reset demo” under the form clears all stored registrations.
      </Notice>
    </div>
  );
}
