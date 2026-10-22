---
doc: spec
status: approved
---

# GiftPilot — Technical Spec

## Plain-Language Overview

The form sends a visitor's preferences to a private route in the Next.js app. The route validates those preferences, calls Gemini with generic context and a fixed response shape, validates the generated gift ideas, then builds store search links using trusted application code. The browser only receives validated recommendations and links. There is no fixed gift catalog, product API, scraping, or price verification.

## Core Journey

PRD ref: `prd.md > The Core Journey`.

```text
Visitor opens /
  -> sees the existing landing page and on-page finder
  -> fills recipient, occasion, SAR budget range, optional interests
  -> client validates and POSTs to /api/recommendations
  -> server validates again and applies best-effort IP request limit
  -> Gemini returns three structured gift ideas and allowlisted store IDs
  -> Zod validates output; application builds trusted search URLs
  -> inline result cards appear only after the complete response succeeds
  -> visitor checks prices and availability on store sites or edits answers
```

## Stack and Runtime

- **Next.js 16 App Router, React, TypeScript, Tailwind CSS 4**: existing project setup. The form/results are client components; the API route runs server-side.
- **Google GenAI JavaScript SDK (`@google/genai`)**: server-only Gemini client.
- **Zod**: shared preference validation and AI response validation. Keep schema and TypeScript inference in `lib/recommendation-schema.ts`.
- **Node.js 20.9+ and npm**: local development. No database, separate server, or deployment setup is required.
- The Gemini key is `GEMINI_API_KEY` in local `.env.local`; never expose it through a `NEXT_PUBLIC_` variable or commit it.

## Look and Feel

Keep the present hero, gift-box illustration, How It Works panel, warm palette, and playful tone. Use Tailwind utility classes for layout, spacing, typography, color, responsive behavior, and form/result styling. Define design tokens in `app/globals.css` and expose color/font variables via Tailwind v4 `@theme`. Keep hand-written CSS for global base behavior and the CSS gift illustration only.

Key fixes: hero phrase must wrap within its art container on mobile/tablet/desktop; navbar “Gift finder” targets the form rather than the old gift shelf; form scroll position sits below the header and toward the viewport center. The custom-styled native selects retain browser keyboard behavior, selected state, and visible focus indication.

## Components

### Landing and Finder

- `app/page.tsx` owns landing sections, navigation, and the page anchor.
- `components/gift-finder-form.tsx` owns form values, conditional Other fields, client validation, loading/error states, and submitting preferences.
- Keep preferences in component state for the current page visit; results and editing do not navigate to another page.
- “Edit Preferences” clears/scrolls to the existing form while keeping all entered answers.

### Inline Results

- `components/recommendation-results.tsx` displays exactly three validated idea cards only after success.
- A card displays title, category, explanation, search terms, target-budget context if useful, and relevant store links.
- Include the price/availability/shipping/seller verification note. Do not show invented product price, image, rating, stock, or delivery detail.
- Result icons or category colors may be illustrative and must not imply that a specific product is listed.

### Recommendation Route

`app/api/recommendations/route.ts` accepts POST preferences, validates with the shared schema, checks the best-effort rate limit, invokes Gemini, parses and validates the response, creates final links, and returns normalized recommendation objects. Return generic user-facing errors; never expose provider errors or secrets.

### Shared Schemas and Helpers

- `lib/recommendation-schema.ts`: preference input, category enum, allowlisted store IDs, recommendation response, trim/max lengths, and inferred TypeScript types.
- `lib/stores.ts`: fixed store definitions, per-store trusted URL builders, encoding, and category-based fallback. Only construct HTTPS URLs for the six fixed hostnames.
- `lib/gemini.ts`: server-only SDK initialization and one structured generation request. Send no names or sensitive details. Ask for exactly three distinct ideas; do not ask Gemini for URLs or prices.
- `lib/rate-limit.ts`: in-memory window of five requests per IP per ten minutes, best effort per process/function instance.
- The obsolete `lib/gifts.ts`, `components/gift-catalog.tsx`, and duplicate sample `data/gifts.json` have been removed after confirming the app no longer imports them. The public image folder and placeholder remain preserved, but are not shown as a verified product.

## Data Model and Contracts

### Preferences

```ts
type FinderPreferences = {
  recipient: string;
  customRecipient?: string;
  occasion: string;
  customOccasion?: string;
  budgetMin: number; // SAR
  budgetMax: number; // SAR
  interests?: string;
};
```

Recipient and occasion are required. When either is `Other`, its custom field is required, trimmed, and at most 60 characters. Interests are optional, trimmed, and at most 200 characters. Reject blank required/custom values, invalid budget numbers, negative or out-of-range values, and a minimum greater than maximum. Keep budget bounds as named constants so the UI and server use identical limits.

### Gemini response

```ts
type GiftIdea = {
  title: string;
  reason: string;
  category: GiftCategory;
  searchQuery: string;
  storeIds: StoreId[];
};
type RecommendationResponse = { recommendations: GiftIdea[] };
```

Require exactly three ideas; normalized titles/search queries must be non-empty, strings have reasonable max lengths, and the titles/search ideas are distinct. `GiftCategory` is a finite app enum. `StoreId` is exactly `amazon_sa | noon | shein | aliexpress | jarir | extra`. Reject malformed output; unknown store IDs are stripped only if at least one valid ID remains, otherwise category fallback applies. Store links are appended by the app and never supplied by Gemini.

### Store URL builders

`lib/stores.ts` maps each ID to a fixed HTTPS hostname, label, and builder. Query text is `encodeURIComponent`-encoded and inserted into that store's search query/path. Initial candidates based on observed route formats:

- Amazon.sa: `https://www.amazon.sa/s?k=<encoded query>`
- Noon: `https://www.noon.com/saudi-en/search/?q=<encoded query>` (needs a live search confirmation; direct check timed out)
- SHEIN: `https://ar.shein.com/pdsearch/<encoded query>` (a direct check reached a risk/challenge page)
- AliExpress: `https://www.aliexpress.com/wholesale?SearchText=<encoded query>` (observed redirect to its Arabic regional search route)
- Jarir: `https://www.jarir.com/sa-en/catalogsearch/result/?q=<encoded query>`
- eXtra: `https://www.extra.com/en-sa/search/?text=<encoded query>`

Direct HTTP checks returned a page for Amazon.sa, AliExpress, Jarir, and eXtra (AliExpress redirected to its Arabic regional search path; eXtra canonicalized its trailing slash). Noon timed out during the check, and SHEIN returned a risk/challenge redirect. These checks establish only that the candidate routes responded or redirected at that moment; they do not verify search results in an interactive browser. External links use `target="_blank"` and `rel="noopener noreferrer"`. Link availability and regional redirects are controlled by the retailer and may change.

Category fallback is a small deterministic mapping, for example: electronics → Amazon.sa, Noon, Jarir, eXtra; fashion/home → SHEIN, Amazon.sa, Noon; hobbies/creative → AliExpress, Amazon.sa, Noon; books/stationery/graduation → Jarir, Amazon.sa, Noon. It is only a relevance hint, not an inventory guarantee.

## File Structure

```text
app/
  api/recommendations/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  gift-finder-form.tsx
  recommendation-results.tsx
lib/
  gemini.ts
  recommendation-schema.ts
  rate-limit.ts
  stores.ts
public/images/gifts/     # preserved legacy placeholder; not a product source
.env.example
.env.local               # local-only secret, ignored by Git
README.md
```

`Where it runs`: local `npm run dev`; configure a local `.env.local` containing `GEMINI_API_KEY=...`. Deployment is undecided and out of the MVP.

## Failure Modes and Security

- Invalid client form: field-specific messages; no request. Server repeats validation.
- Invalid/unavailable Gemini response or missing key: generic retry error, no partial result cards, preserve form answers.
- Five requests per IP per ten minutes: return 429 with a friendly wait message. In-memory state is best-effort and not shared between server instances.
- Trust only normalized Zod output and static allowlist. Never accept AI URLs or HTML, and never return provider exception details.
- Gemini prompts use generic preference text; avoid personally identifying details. Budget is guidance for suggestions, not an actual store filter.
- Store websites are responsible for current product listings, prices, availability, shipping, and seller information.

## Open Implementation Choices

- Initial category enum and recipient/occasion presets are small, editable lists.
- Budget slider bounds/increments are adjustable SAR constants. The initial implementation should clearly show its min/max.
- A Gemini key may not be configured in the local environment; route and failure behavior can still be verified without calling the paid/external provider.

---
