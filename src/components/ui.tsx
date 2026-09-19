import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & { variant?: "primary" | "secondary" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "ce:inline-flex ce:items-center ce:justify-center ce:rounded ce:px-5 ce:py-2.5 ce:font-semibold ce:transition-colors ce:focus:outline-none ce:focus-visible:ring-2 ce:focus-visible:ring-link/40 ce:disabled:cursor-not-allowed ce:disabled:opacity-50";
  const look =
    variant === "primary"
      ? "ce:bg-brand ce:text-on-brand ce:hover:bg-brand-dark ce:disabled:hover:bg-brand"
      : "ce:border ce:border-brand ce:bg-surface ce:text-brand ce:hover:bg-tint ce:disabled:hover:bg-surface";
  return <button className={`${base} ${look} ${className}`} {...props} />;
}

export function LinkButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={`ce:text-link ce:underline-offset-2 ce:hover:underline ce:focus:outline-none ce:focus-visible:underline ${className}`}
      {...props}
    />
  );
}

export const inputClass =
  "ce:w-full ce:rounded ce:border ce:border-line ce:bg-surface ce:px-3 ce:py-2.5 ce:placeholder:text-muted ce:focus:border-link ce:focus:outline-none ce:focus:ring-2 ce:focus:ring-link/25 ce:aria-invalid:border-error";

export function TextInput(props: ComponentProps<"input">) {
  return <input className={inputClass} {...props} />;
}

export function Select({ children, ...props }: ComponentProps<"select">) {
  return (
    <select className={inputClass} {...props}>
      {children}
    </select>
  );
}

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="ce:mb-1 ce:block ce:font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="ce:mt-1 ce:text-sm ce:text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="ce:mt-1 ce:text-sm ce:text-error">
          {error}
        </p>
      )}
    </div>
  );
}

type NoticeProps = { tone?: "info" | "error" | "success"; children: ReactNode };

export function Notice({ tone = "info", children }: NoticeProps) {
  const look =
    tone === "error"
      ? "ce:border-error/40 ce:bg-error/8 ce:text-error"
      : tone === "success"
        ? "ce:border-success/40 ce:bg-success/8 ce:text-success"
        : "ce:border-brand/20 ce:bg-tint";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`ce:rounded ce:border ce:px-4 ce:py-3 ${look}`}>
      {children}
    </div>
  );
}

// Font, weight, and color of headings come from the Host Page's h2 rule; only the size is
// scaled down to fit inside a form.
export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="ce:text-2xl">{children}</h2>;
}
