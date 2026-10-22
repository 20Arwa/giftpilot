"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { RecommendationResults } from "@/components/recommendation-results";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  OCCASION_OPTIONS,
  RECIPIENT_OPTIONS,
  preferencesSchema,
  recommendationResponseSchema,
  type FinderPreferences,
  type Recommendation,
} from "@/lib/recommendation-schema";

type Field = "recipient" | "customRecipient" | "occasion" | "customOccasion" | "budgetMin" | "budgetMax" | "interests";
type FormValues = Omit<FinderPreferences, "recipient" | "occasion"> & {
  recipient: FinderPreferences["recipient"] | "";
  occasion: FinderPreferences["occasion"] | "";
};

const initialValues: FormValues = {
  recipient: "",
  customRecipient: "",
  occasion: "",
  customOccasion: "",
  budgetMin: 100,
  budgetMax: 500,
  interests: "",
};

export function GiftFinderForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formMessage, setFormMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultSet, setResultSet] = useState<{ recommendations: Recommendation[]; budgetMin: number; budgetMax: number } | null>(null);
  const formRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[role="combobox"]')?.focus({ preventScroll: true }), 650);
  }

  function update<K extends Field>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormMessage("");
    setRequestError("");
    if (field === "recipient" && value !== "Other") setValues((current) => ({ ...current, customRecipient: "" }));
    if (field === "occasion" && value !== "Other") setValues((current) => ({ ...current, customOccasion: "" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const parsed = preferencesSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setFormMessage("Please complete the required fields above to find your gift ideas.");
      setResultSet(null);
      return;
    }
    setErrors({});
    setFormMessage("");
    setRequestError("");
    setLoading(true);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Something went wrong. Please try again.";
        if (response.status === 422) setResultSet(null);
        throw new Error(message);
      }
      const validated = recommendationResponseSchema.safeParse(payload);
      if (!validated.success) throw new Error("We couldn’t read the gift ideas. Please try again.");
      setResultSet({
        recommendations: validated.data.recommendations,
        budgetMin: parsed.data.budgetMin,
        budgetMax: parsed.data.budgetMax,
      });
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit() {
    scrollToForm();
  }

  return (
    <>
      <section ref={formRef} className="mx-auto w-full max-w-5xl scroll-mt-0 px-5 py-16 sm:px-8 sm:py-20" id="gift-finder" aria-labelledby="finder-title">
        <div className="grid gap-8 rounded-[28px] border border-line bg-white/80 p-6 shadow-soft sm:p-10 lg:grid-cols-[0.78fr_1fr] lg:gap-12 lg:p-12">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="mb-5 grid size-10 place-items-center rounded-xl bg-peach text-xl text-brand-dark" aria-hidden="true">✦</div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-dark">Your gift sidekick</p>
            <h2 id="finder-title" className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">Let’s find something they’ll love.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">A few little clues are all we need to find ideas made just for them.</p>
            <p className="mt-6 text-xs font-semibold text-muted">A thoughtful starting point, with real shops just a click away.</p>
          </div>

          <form className="flex min-w-0 flex-col gap-4" onSubmit={submit} noValidate>
            <FieldLabel label="Who are you choosing for?" error={errors.recipient}>
              <SelectField value={values.recipient} onChange={(value) => update("recipient", value as FormValues["recipient"])} options={RECIPIENT_OPTIONS} placeholder="Choose someone" label="Who are you choosing for?" invalid={!!errors.recipient} />
            </FieldLabel>
            {values.recipient === "Other" && <FieldLabel className="-mt-2 gap-1.5" label="Tell us who they are">
              <input autoComplete="off" aria-label="Tell us who the recipient is" className={inputClass(!!errors.customRecipient)} maxLength={60} value={values.customRecipient} onChange={(event) => update("customRecipient", event.target.value)} placeholder="e.g. my favorite neighbor" aria-invalid={!!errors.customRecipient} aria-describedby={errors.customRecipient ? "custom-recipient-error" : undefined} />
              <div className="flex items-center justify-between gap-2">{errors.customRecipient && <span id="custom-recipient-error" className="min-w-0 text-xs leading-4 text-red-700 font-medium" role="alert">{errors.customRecipient}</span>}<CharacterCount value={values.customRecipient} max={60} /></div>
            </FieldLabel>}

            <FieldLabel label="What are you celebrating?" error={errors.occasion}>
              <SelectField value={values.occasion} onChange={(value) => update("occasion", value as FormValues["occasion"])} options={OCCASION_OPTIONS} placeholder="Choose an occasion" label="What are you celebrating?" invalid={!!errors.occasion} />
            </FieldLabel>
            {values.occasion === "Other" && <FieldLabel className="-mt-2 gap-1.5" label="What’s the occasion?">
              <input autoComplete="off" aria-label="Tell us the occasion" className={inputClass(!!errors.customOccasion)} maxLength={60} value={values.customOccasion} onChange={(event) => update("customOccasion", event.target.value)} placeholder="e.g. just because" aria-invalid={!!errors.customOccasion} aria-describedby={errors.customOccasion ? "custom-occasion-error" : undefined} />
              <div className="flex items-center justify-between gap-2">{errors.customOccasion && <span id="custom-occasion-error" className="min-w-0 text-xs leading-4 text-red-700 font-medium" role="alert">{errors.customOccasion}</span>}<CharacterCount value={values.customOccasion} max={60} /></div>
            </FieldLabel>}

            <fieldset className="rounded-2xl border border-line bg-white p-4">
              <legend className="sr-only">Target budget in Saudi Riyals</legend>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink">Target budget <span className="font-normal text-muted">(SAR)</span></span>
                <span className="text-xs font-extrabold text-brand-dark">SAR {values.budgetMin} – {values.budgetMax}</span>
              </div>
              <label className="mb-3 flex flex-col gap-1.5 text-[10px] font-semibold text-muted">
                Minimum: SAR {values.budgetMin}
                <input className="w-full accent-brand" type="range" min={BUDGET_MIN} max={BUDGET_MAX - BUDGET_STEP} step={BUDGET_STEP} value={values.budgetMin} onChange={(event) => update("budgetMin", Math.min(Number(event.target.value), values.budgetMax - BUDGET_STEP))} aria-label="Minimum target budget in Saudi Riyals" />
              </label>
              <label className="flex flex-col gap-1.5 text-[10px] font-semibold text-muted">
                Maximum: SAR {values.budgetMax}
                <input className="w-full accent-brand" type="range" min={BUDGET_MIN + BUDGET_STEP} max={BUDGET_MAX} step={BUDGET_STEP} value={values.budgetMax} onChange={(event) => update("budgetMax", Math.max(Number(event.target.value), values.budgetMin + BUDGET_STEP))} aria-label="Maximum target budget in Saudi Riyals" />
              </label>
              {(errors.budgetMin || errors.budgetMax) && <p className="mt-2 text-xs font-medium text-red-700" role="alert">{errors.budgetMin || errors.budgetMax}</p>}
            </fieldset>

            <FieldLabel label={<>What do they like? <span className="ml-1 text-[10px] font-normal text-muted">Optional</span></>} error={errors.interests}>
              <textarea aria-label="What the recipient likes (optional)" className={`${inputClass(!!errors.interests)} min-h-24 resize-y py-3`} maxLength={200} value={values.interests} onChange={(event) => update("interests", event.target.value)} placeholder="Books, baking, technology, the great outdoors…" aria-invalid={!!errors.interests} />
              <CharacterCount value={values.interests || ""} max={200} />
            </FieldLabel>

            {formMessage && <p className="mb-[-4px] text-xs font-semibold text-brand-dark" role="alert">{formMessage}</p>}
            {requestError && <div className="rounded-xl border border-[#eac1b6] bg-[#fff4f0] p-3 text-xs leading-5 text-[#8e3e2c]" role="alert">{requestError} Your answers are still here; you can try again.</div>}
            <button className={`mt-1 min-h-12 w-full rounded-full px-5 text-sm font-bold text-white shadow-button transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${loading ? "cursor-not-allowed bg-[#c8b9ac]" : "cursor-pointer bg-brand hover:-translate-y-0.5 hover:bg-brand-dark"}`} type="submit" aria-disabled={loading || undefined}>
              {loading ? "Finding thoughtful ideas…" : "Find my perfect gift"} <span className="ml-2" aria-hidden="true">{loading ? "" : "✦"}</span>
            </button>
            {loading && <p className="text-center text-xs text-muted" role="status">A little moment while we think of something lovely.</p>}
          </form>
        </div>
      </section>
      {resultSet && <section ref={resultsRef} aria-live="polite">
        <RecommendationResults recommendations={resultSet.recommendations} budgetMin={resultSet.budgetMin} budgetMax={resultSet.budgetMax} onEdit={handleEdit} />
      </section>}
    </>
  );
}

function FieldLabel({ label, error, children, className }: { label: ReactNode; error?: string; children: ReactNode; className?: string }) {
  return <div className={`relative flex min-w-0 flex-col text-xs font-bold text-[#4d4038] ${className ?? "gap-2"}`}><span>{label}</span>{children}{error && <span className="text-xs font-medium text-red-700" role="alert">{error}</span>}</div>;
}

function SelectField({ value, onChange, options, placeholder, label, invalid }: { value: string; onChange: (value: string) => void; options: readonly string[]; placeholder: string; label: string; invalid: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.indexOf(value)));
  const listboxId = useId();
  const selectedIndex = options.indexOf(value);

  function choose(index: number) {
    onChange(options[index]);
    setActiveIndex(index);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
      } else {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((current) => (current + direction + options.length) % options.length);
      }
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      setOpen(true);
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return <div className="relative" onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }}>
    <button
      type="button"
      role="combobox"
      aria-label={label}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-activedescendant={open ? `${listboxId}-option-${activeIndex}` : undefined}
      aria-invalid={invalid}
      className={`${inputClass(invalid)} flex items-center justify-between pr-11 text-left transition ${open ? "border-brand ring-4 ring-brand/10" : "hover:border-[#d7c5b5]"}`}
      onClick={() => {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen((current) => !current);
      }}
      onKeyDown={handleKeyDown}
    >
      <span className={value ? "text-ink" : "text-[#9a897c]"}>{value || placeholder}</span>
      <svg className={`pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-dark transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    {open && <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-[0_18px_42px_rgba(70,49,34,0.16)] ring-1 ring-black/5">
      {/* <div className="px-3 pb-2 pt-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-muted">Choose one</div> */}
      <div id={listboxId} role="listbox" aria-label={label} className="max-h-56 overflow-y-auto overscroll-contain">
        {options.map((option, index) => {
          const selected = option === value;
          const active = index === activeIndex;
          return <div
            id={`${listboxId}-option-${index}`}
            key={option}
            role="option"
            aria-selected={selected}
            className={`flex min-h-10 cursor-pointer items-center justify-between rounded-xl px-3 text-xs font-semibold transition-colors ${active ? "bg-peach/70 text-brand-dark" : "text-ink hover:bg-paper"} ${selected ? "font-extrabold" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span>{option}</span>
            {selected && <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] text-white" aria-hidden="true">✓</span>}
          </div>;
        })}
      </div>
    </div>}
  </div>;
}

const inputClass = (invalid: boolean) => `min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-normal text-ink placeholder:text-[#ad9d91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${invalid ? "border-red-500" : "border-line"}`;

function CharacterCount({ value, max }: { value: string; max: number }) {
  return <span className="ml-auto whitespace-nowrap text-[10px] font-normal text-muted">{value.length}/{max}</span>;
}
