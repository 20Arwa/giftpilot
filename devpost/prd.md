---
doc: prd
status: approved
---

# GiftPilot — Product Requirements

GiftPilot is an AI-powered gift discovery assistant for users in Saudi Arabia. It suggests gift ideas and connects each idea to relevant search pages on approved shopping websites. It does not sell gifts or verify products, prices, stock, delivery, or sellers.

Source: `scope.md > The Unique Kernel`, `The Core Loop`, and `The POC Boundary`.

## The Core Journey

1. A visitor opens the existing bright, playful landing page.
2. The visitor uses a landing or navigation call to action to reach the on-page gift finder.
3. They enter a recipient, occasion, SAR budget range, and optional interests. When recipient or occasion is “Other,” its text input is required.
4. GiftPilot trims and validates the preferences in the browser and again on the server.
5. The server sends generic preferences to Gemini, which returns exactly three distinct gift ideas. Each has a title, concise reason, valid category, useful search query, and relevant IDs from the store allowlist.
6. The server validates the response and constructs store links from application-owned URL builders. Only then are results shown inline beneath the finder.
7. The visitor may open store searches in a new tab, check actual products and terms on the store site, or edit preferences and search again.

Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

## Screens and Layout

- **Landing page:** Preserve the current hero, gift illustration, “Our little promise” content, warm colors, and typographic character. No gift recommendation cards appear before a successful submission.
- **Gift finder:** Visible on the same page, with recipient and occasion selects, conditional “Other” fields, SAR budget range, optional interests, and submit action. Navbar navigation targets the beginning of this form. Scrolling positions it comfortably below the sticky header and toward the viewport center.
- **Inline results:** After successful submission, show three idea cards in a results section on the same page. Each shows title, category, AI reason, search query, and relevant shopping links. Include an “Edit Preferences” action that returns focus/scroll to the form with current values preserved.
- **Responsive behavior:** Keep the existing composition on larger screens and stack naturally on narrow screens. Text and controls remain visible without horizontal overflow.

Source: `scope.md > Inspiration & Identity`, `The Core Loop`, and `The POC Boundary`.

## Look and Feel

Preserve the current warm, bright, playful visual identity. Use Tailwind utilities for most component styling and a small set of CSS variables for brand colors, fonts, surfaces, text, borders, and shadows. Maintain clear headings, readable copy, rounded inputs/cards, visible focus states, and sufficient contrast. The illustration may remain decorative; it must not imply that a pictured product is actually for sale.

## Features and Behavior

### Finding a Gift

- Recipient and occasion are required selects, each with an “Other” option and a corresponding required text field.
- “Other” descriptions are trimmed and limited to 60 characters.
- Budget is a required range in SAR; choose a practical default range in the UI and validate finite values, minimum not greater than maximum, and sensible bounds on the server.
- Interests are optional, trimmed, and limited to 200 characters.
- Required text must not be blank after trimming. Show clear field-specific messages.
- On an incomplete submission, keep the button clickable so the handler can show a small message above it. Do not call Gemini. Use an `aria-disabled` state and visual disabled treatment rather than a native disabled attribute for the invalid form.
- On valid submission, show loading state and prevent duplicate requests. Retain all answers after errors so the visitor can retry.

### AI Gift Ideas

- Gemini returns exactly three distinct gift ideas, not products or listings.
- Each idea includes `title`, `reason`, `category`, `searchQuery`, and `storeIds`.
- Reasons are concise and explain the fit to the recipient, occasion, budget, or interests.
- Categories come from a finite application-defined category list.
- Do not include fabricated exact prices, product ratings, stock, seller information, or delivery claims.
- The user's SAR budget influences the idea-generation prompt but is not represented as a verified price filter.

### Store Search Links

- Approved store IDs: `amazon_sa`, `noon`, `shein`, `aliexpress`, `jarir`, and `extra`.
- Gemini may select only these IDs. Zod and application logic validate IDs; unknown IDs and unsafe output are discarded.
- The app constructs final search URLs with per-store trusted templates and URL-encoded search terms. Never accept a model-generated URL.
- If a recommendation has no usable store IDs after validation, choose a small relevant fallback list based on its validated category.
- Links open in a new tab with `rel="noopener noreferrer"`. Link labels identify the store, such as “Search on Amazon.sa.”
- Store relevance is a helpful suggestion, not a guarantee of stock or suitability.

### Results and Recovery

- Do not show recommendation cards until a request succeeds and the response validates.
- Show exactly three distinct validated ideas on success.
- Show an understandable loading state, retryable error state, and rate-limit state. Keep form values through failure.
- “Edit Preferences” scrolls to the form and preserves the current answers.
- Include a subtle note: “Search results may vary. Check current price, availability, shipping, and seller details on the store website.”
- No separate results page, catalog, gift-detail modal, cart, or checkout.

## States and Boundaries

- **Before search:** landing and form only; no AI result cards.
- **Invalid form:** field-specific errors and incomplete-form message; no server request.
- **Loading:** clear progress feedback; repeat submission is prevented.
- **Success:** exactly three distinct validated gift ideas and app-built store search links appear inline.
- **Invalid or unavailable AI response:** show a friendly retry message; do not render malformed or unvalidated output.
- **Rate limited:** show a friendly wait message; preserve answers.
- **Edit:** return to the finder with answers intact.
- **Shopping:** the visitor verifies products and terms on third-party sites.

## Product Decisions

- Saudi Arabia is the target market and budget currency is SAR.
- Gemini creates gift ideas, while shopping websites provide the actual product listings.
- Exactly three gift ideas appear after a successful search.
- Store search links are generated by trusted application code, from a six-store allowlist.
- The form is on the landing page and results appear inline after submission.
- Interests are optional; recipient and occasion “Other” text is required when selected.
- No public deployment decision has been made; local functionality is the immediate goal.

## What We're Building

- Existing landing UI retained with targeted responsive, navigation, and styling improvements.
- A validated preference form and one secure server-side Gemini recommendation route.
- Three personalized idea cards, trusted shopping search links, and loading/error/retry/edit states.
- A restrained allowlist and category fallback for store selection.

## Deferred From the POC

- Choosing where to deploy or publicly publishing the site.
- Arabic localization, live product feeds, store APIs, and product aggregation.

## Non-Goals

- A static gift catalog as the recommendation source.
- Scraping or real-time product, inventory, seller, or pricing data.
- A conventional online shop, accounts, database, cart, or checkout.
- Arbitrary model-created URLs or unverified product facts.

## Open Questions

- Which exact recipient and occasion preset labels fit the final form? Initial practical options can be used for the MVP.
- Which SAR budget bounds and increments fit the intended audience? The implementation will use clear, adjustable defaults.

---
