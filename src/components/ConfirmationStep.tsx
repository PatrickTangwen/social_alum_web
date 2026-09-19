import type { Registration } from "@/domain/registration";
import { Notice, SectionHeading } from "./ui";

export function ConfirmationStep({ registration }: { registration: Registration }) {
  const rows: [string, string][] = [
    ["Name", `${registration.firstName} ${registration.lastName}`],
    ["Verified email", registration.verifiedEmail],
    ["School", registration.school],
    ["Degree program", registration.degreeProgram],
    ["Graduation year", registration.graduationYear],
    ["Organization", registration.organization],
    ["Title", registration.title],
    ["Organization type", registration.organizationType],
    ["Impact themes", registration.impactThemes.join(", ")],
    ["Job functions", registration.jobFunctions.join(", ")],
    ["LinkedIn", registration.linkedinUrl || "—"],
    ["Open to informational interviews", registration.openToInterviews ? "Yes" : "No"],
    ["Submitted", new Date(registration.submittedAt).toLocaleString("en-US")],
  ];

  return (
    <div className="ce:flex ce:flex-col ce:gap-6">
      <div>
        <SectionHeading>Registration received</SectionHeading>
        <p className="ce:mt-2">
          Thank you, {registration.firstName}. The Career Development Office reviews new
          registrations before they appear in the Career Explorer.
        </p>
      </div>

      <dl className="ce:rounded ce:border ce:border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="ce:grid ce:gap-1 ce:border-t ce:border-line ce:px-4 ce:py-3 ce:first:border-t-0 ce:@xl:grid-cols-[14rem_1fr] ce:@xl:gap-4">
            <dt className="ce:text-sm ce:font-semibold ce:text-muted">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <Notice>
        This is a demo. Nothing was sent anywhere; the registration payload was logged to the
        browser console.
      </Notice>
    </div>
  );
}
