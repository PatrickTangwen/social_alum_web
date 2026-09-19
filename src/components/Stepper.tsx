const STEPS = ["Verify email", "Enter code", "Your details"];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="ce:flex ce:flex-wrap ce:gap-x-6 ce:gap-y-2 ce:border-b ce:border-line ce:bg-panel ce:px-6 ce:py-4">
      {STEPS.map((label, index) => {
        const state = index < current ? "done" : index === current ? "current" : "upcoming";
        const badge =
          state === "done"
            ? "ce:bg-brand ce:text-on-brand"
            : state === "current"
              ? "ce:bg-brand ce:text-on-brand ce:ring-4 ce:ring-tint"
              : "ce:border ce:border-line ce:bg-surface ce:text-muted";
        return (
          <li key={label} className="ce:flex ce:items-center ce:gap-2" aria-current={state === "current" ? "step" : undefined}>
            <span className={`ce:flex ce:h-6 ce:w-6 ce:items-center ce:justify-center ce:rounded-full ce:text-xs ce:font-semibold ce:leading-none ${badge}`}>
              {state === "done" ? "✓" : index + 1}
            </span>
            <span className={`ce:text-sm ${state === "upcoming" ? "ce:text-muted" : "ce:font-semibold"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
