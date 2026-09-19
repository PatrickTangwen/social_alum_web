"use client";

import { useState, type FormEvent } from "react";
import {
  DEGREE_PROGRAMS,
  EMPTY_DRAFT,
  GRADUATION_YEARS,
  IMPACT_THEMES,
  JOB_FUNCTIONS,
  ORGANIZATION_TYPES,
  SCHOOLS,
  validateDraft,
  type DraftErrors,
  type Option,
  type RegistrationDraft,
} from "@/domain/registration";
import { Button, Field, Notice, SectionHeading, Select, TextInput } from "./ui";

type Props = {
  verifiedEmail: string;
  onSubmit: (draft: RegistrationDraft) => void;
};

// Element ids are prefixed so they cannot collide with ids on the Host Page.
function fieldId(key: keyof RegistrationDraft) {
  return `ce-${key}`;
}

export function RegistrationForm({ verifiedEmail, onSubmit }: Props) {
  const [draft, setDraft] = useState<RegistrationDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});

  function update<K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggle(key: "impactThemes" | "jobFunctions", name: string) {
    const list = draft[key];
    update(key, list.includes(name) ? list.filter((n) => n !== name) : [...list, name]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateDraft(draft);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof RegistrationDraft)[])[0];
    if (firstInvalid) {
      // Every field's control or fieldset carries its draft key as its id.
      const target = event.currentTarget.querySelector<HTMLElement>(`#${fieldId(firstInvalid)}`);
      target?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) target.focus({ preventScroll: true });
      return;
    }
    onSubmit(draft);
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form onSubmit={submit} noValidate className="ce:flex ce:flex-col ce:gap-10">
      <Notice tone="success">
        Verified as <span className="ce:font-semibold">{verifiedEmail}</span>. This address will be
        attached to your registration.
      </Notice>

      {errorCount > 0 && (
        <Notice tone="error">
          {errorCount === 1 ? "One field needs attention." : `${errorCount} fields need attention.`}
        </Notice>
      )}

      <section className="ce:flex ce:flex-col ce:gap-5">
        <SectionHeading>About you</SectionHeading>
        <div className="ce:grid ce:gap-5 ce:@xl:grid-cols-2">
          <Field label="First name" htmlFor={fieldId("firstName")} error={errors.firstName}>
            <TextInput id={fieldId("firstName")} autoComplete="given-name" value={draft.firstName} onChange={(e) => update("firstName", e.target.value)} aria-invalid={errors.firstName ? true : undefined} />
          </Field>
          <Field label="Last name" htmlFor={fieldId("lastName")} error={errors.lastName}>
            <TextInput id={fieldId("lastName")} autoComplete="family-name" value={draft.lastName} onChange={(e) => update("lastName", e.target.value)} aria-invalid={errors.lastName ? true : undefined} />
          </Field>
          <Field label="School" htmlFor={fieldId("school")} error={errors.school}>
            <Select id={fieldId("school")} value={draft.school} onChange={(e) => update("school", e.target.value)} aria-invalid={errors.school ? true : undefined}>
              <option value="">Select…</option>
              {SCHOOLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Degree program" htmlFor={fieldId("degreeProgram")} error={errors.degreeProgram}>
            <Select id={fieldId("degreeProgram")} value={draft.degreeProgram} onChange={(e) => update("degreeProgram", e.target.value)} aria-invalid={errors.degreeProgram ? true : undefined}>
              <option value="">Select…</option>
              {DEGREE_PROGRAMS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Graduation year" htmlFor={fieldId("graduationYear")} error={errors.graduationYear}>
            <Select id={fieldId("graduationYear")} value={draft.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} aria-invalid={errors.graduationYear ? true : undefined}>
              <option value="">Select…</option>
              {GRADUATION_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      <section className="ce:flex ce:flex-col ce:gap-5">
        <SectionHeading>Where you work</SectionHeading>
        <div className="ce:grid ce:gap-5 ce:@xl:grid-cols-2">
          <Field label="Current organization" htmlFor={fieldId("organization")} error={errors.organization}>
            <TextInput id={fieldId("organization")} autoComplete="organization" value={draft.organization} onChange={(e) => update("organization", e.target.value)} aria-invalid={errors.organization ? true : undefined} />
          </Field>
          <Field label="Current title" htmlFor={fieldId("title")} error={errors.title}>
            <TextInput id={fieldId("title")} autoComplete="organization-title" value={draft.title} onChange={(e) => update("title", e.target.value)} aria-invalid={errors.title ? true : undefined} />
          </Field>
        </div>
        <fieldset id={fieldId("organizationType")}>
          <legend className="ce:mb-2 ce:font-semibold">Organization type</legend>
          <div className="ce:flex ce:flex-wrap ce:gap-2">
            {ORGANIZATION_TYPES.map((type) => (
              <label key={type} className="ce:cursor-pointer ce:rounded-full ce:border ce:border-line ce:px-4 ce:py-1.5 ce:hover:bg-panel ce:has-checked:border-brand ce:has-checked:bg-tint ce:has-checked:text-brand ce:has-checked:font-semibold">
                <input type="radio" name="organizationType" value={type} checked={draft.organizationType === type} onChange={() => update("organizationType", type)} className="ce:sr-only" />
                {type}
              </label>
            ))}
          </div>
          {errors.organizationType && <p role="alert" className="ce:mt-1 ce:text-sm ce:text-error">{errors.organizationType}</p>}
        </fieldset>
      </section>

      <section className="ce:flex ce:flex-col ce:gap-5">
        <SectionHeading>Your place in the Career Explorer</SectionHeading>
        <p>
          Impact themes are the rows of the Career Explorer, job functions are the columns. Choose
          every one that describes your current work.
        </p>
        <OptionGroup id={fieldId("impactThemes")} legend="Impact themes" options={IMPACT_THEMES} selected={draft.impactThemes} error={errors.impactThemes} onToggle={(name) => toggle("impactThemes", name)} />
        <OptionGroup id={fieldId("jobFunctions")} legend="Job functions" options={JOB_FUNCTIONS} selected={draft.jobFunctions} error={errors.jobFunctions} onToggle={(name) => toggle("jobFunctions", name)} />
      </section>

      <section className="ce:flex ce:flex-col ce:gap-5">
        <SectionHeading>Connecting with students</SectionHeading>
        <Field label="LinkedIn URL (optional)" htmlFor={fieldId("linkedinUrl")} error={errors.linkedinUrl}>
          <TextInput id={fieldId("linkedinUrl")} type="url" inputMode="url" placeholder="https://linkedin.com/in/…" value={draft.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} aria-invalid={errors.linkedinUrl ? true : undefined} />
        </Field>
        <label className="ce:flex ce:cursor-pointer ce:items-start ce:gap-3 ce:leading-snug">
          <input type="checkbox" checked={draft.openToInterviews} onChange={(e) => update("openToInterviews", e.target.checked)} className="ce:mt-[0.2em] ce:size-[1em] ce:shrink-0 ce:accent-brand" />
          <span>
            <span className="ce:font-semibold">I am open to informational interviews.</span>
            <span className="ce:block ce:text-muted">Students may reach out to learn about your path.</span>
          </span>
        </label>
      </section>

      <div className="ce:border-t ce:border-line ce:pt-6">
        <Button type="submit">Submit registration</Button>
      </div>
    </form>
  );
}

type OptionGroupProps = {
  id: string;
  legend: string;
  options: Option[];
  selected: string[];
  error?: string;
  onToggle: (name: string) => void;
};

function OptionGroup({ id, legend, options, selected, error, onToggle }: OptionGroupProps) {
  return (
    <fieldset id={id}>
      <legend className="ce:mb-2 ce:font-semibold">{legend}</legend>
      <div className="ce:grid ce:gap-2 ce:@xl:grid-cols-2 ce:@4xl:grid-cols-3">
        {options.map((option) => (
          <label key={option.name} className="ce:flex ce:cursor-pointer ce:items-start ce:gap-3 ce:rounded ce:border ce:border-line ce:bg-surface ce:px-3 ce:py-2.5 ce:leading-snug ce:hover:bg-panel ce:has-checked:border-brand ce:has-checked:bg-tint">
            <input type="checkbox" checked={selected.includes(option.name)} onChange={() => onToggle(option.name)} className="ce:mt-[0.2em] ce:size-[1em] ce:shrink-0 ce:accent-brand" />
            <span>
              <span className="ce:block ce:font-semibold">{option.name}</span>
              <span className="ce:block ce:text-sm ce:text-muted">{option.detail}</span>
            </span>
          </label>
        ))}
      </div>
      {error && <p role="alert" className="ce:mt-1 ce:text-sm ce:text-error">{error}</p>}
    </fieldset>
  );
}
