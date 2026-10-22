import type { Recommendation } from "@/lib/recommendation-schema";

const categoryMarks: Record<Recommendation["category"], string> = {
  electronics: "✳",
  fashion: "✿",
  home: "⌂",
  beauty: "✦",
  "books and stationery": "▤",
  "food and treats": "♡",
  "hobbies and creative": "✎",
  experiences: "☼",
  other: "✧",
};

export function RecommendationResults({
  recommendations,
  budgetMin,
  budgetMax,
  onEdit,
}: {
  recommendations: Recommendation[];
  budgetMin: number;
  budgetMax: number;
  onEdit: () => void;
}) {
  return (
    <section id="recommendations" className="mx-auto w-full max-w-6xl scroll-mt-[14vh] px-5 pb-24 pt-16 sm:px-8" aria-labelledby="results-title">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-dark">A few thoughtful ideas</p>
          <h2 id="results-title" className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">Made for someone <span className="italic text-brand">special.</span></h2>
          <p className="mt-3 text-sm text-muted">Your target budget: SAR {budgetMin}–{budgetMax}</p>
        </div>
        <button className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink transition hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" onClick={onEdit} type="button">Edit preferences ↗</button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {recommendations.map((idea, index) => (
          <article key={`${idea.title}-${index}`} className="flex min-w-0 flex-col rounded-3xl border border-line bg-white/80 p-6 shadow-card">
            <div className={`mb-5 grid size-14 place-items-center rounded-2xl ${index === 1 ? "bg-lilac text-plum" : index === 2 ? "bg-leaf/25 text-ink" : "bg-peach text-brand-dark"}`} aria-hidden="true">
              <span className="font-display text-3xl">{categoryMarks[idea.category]}</span>
            </div>
            <div className="mb-2 text-xs font-bold capitalize tracking-wide text-muted">{idea.category.replace(" and ", " & ")}</div>
            <h3 className="font-display text-2xl font-medium leading-snug text-ink">{idea.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted">{idea.reason}</p>
            <div className="mt-5 rounded-2xl bg-paper px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-dark">Suggested Search</p>
              <p className="mt-1 break-words text-sm font-semibold text-ink">{idea.searchQuery}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {idea.stores.map((store) => (
                <a key={store.id} href={store.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition hover:border-brand hover:bg-peach/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  Search on {store.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-muted">Search results may vary. Check current price, availability, shipping, and seller details on the shopping website.</p>
    </section>
  );
}
