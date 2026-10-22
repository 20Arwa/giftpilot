---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

### Phase 1 — Landing and finder experience

- [ ] **1. Keep the design and make the finder ready to use**
  Becomes usable: Visitors see the existing GiftPilot landing design and a visible on-page Saudi gift finder; navigation lands at the form and the hero phrase is fully visible at mobile, tablet, and desktop widths.
  Why now: This is the first visible checkpoint. It preserves what the learner likes and fixes the navigation/responsive issues before adding AI behavior.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Components > Landing and Finder`
  Build: Replace the old shelf navigation with Gift finder; keep the hero/how-it-works composition; make form visible and anchorable; style most elements with Tailwind and shared tokens; improve native select styling and responsive typography/wrapping.
  Verify (mechanical): Run the production build. Confirm no catalog cards are rendered before search, required anchors exist, and the hero copy has bounded responsive width with wrapping. Inspect the page at narrow, tablet, and desktop widths.
  Learner check: Open the local page at mobile and desktop widths, use the header and hero CTAs, and give visual feedback before the AI flow proceeds.
  Commit: `Preserve GiftPilot landing and finder design`

### Phase 2 — Validated AI recommendation core

- [ ] **2. Validate preferences and SAR budget before any AI call**
  Becomes usable: Incomplete or invalid preferences show clear messages and make no request; valid preferences are normalized consistently in browser and server.
  Why now: Deterministic validation is independently verifiable and protects the API before the external model is connected.
  PRD ref: `prd.md > Features and Behavior > Finding a Gift`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Data Model and Contracts > Preferences`, `spec.md > Shared Schemas and Helpers`
  Build: Add shared Zod schema, trim required values, conditional Other fields (60 chars), optional interests (200 chars), and shared SAR bounds/range check. Keep invalid submit clickable with `aria-disabled` styling and a message above the button; do not submit. Add loading and duplicate-submit prevention.
  Verify (mechanical): Run build and a focused schema check for blank fields, Other requirements, limits, budget bounds/order, and valid optional interests. Confirm invalid form handler does not call fetch.
  Learner check: Try blank values, both Other fields, and text at/over the limit; confirm errors identify the field and valid answers remain entered.
  Commit: `Validate finder preferences and SAR budget`

- [ ] **3. Generate and validate three ideas; build safe store links**
  Becomes usable: The private route returns three distinct, structured gift ideas with links built only for approved stores; invalid provider output never reaches the UI.
  Why now: This is GiftPilot's central value and external-service risk. Verify model output and link safety before styling the result states.
  PRD ref: `prd.md > Features and Behavior > AI Gift Ideas`, `prd.md > Features and Behavior > Store Search Links`
  Spec ref: `spec.md > Recommendation Route`, `spec.md > Shared Schemas and Helpers`, `spec.md > Store URL builders`, `spec.md > Failure Modes and Security`
  Build: Add server-only Gemini SDK integration, structured output request, response Zod schema, exact-three/distinct checks, six-store ID allowlist, fixed URL builders, category fallback, and five-per-IP/ten-minute best-effort rate limiter. Never ask for or trust model URLs/prices.
  Verify (mechanical): Run build and route checks for invalid preferences, unknown IDs, duplicate/invalid recommendations, URL encoding, host allowlist, missing key/provider error, and rate limit. With a key configured, make a local valid request and inspect all three validated ideas. Confirm no key in client bundles or tracked files.
  Learner check: Review one successful result and the generated store links; verify the browser opens only the expected store hosts and the budget is presented as a target.
  Commit: `Add secure AI ideas and trusted store search links`

### Phase 3 — Inline results and complete recovery flow

- [ ] **4. Show inline results and clear loading, error, and retry states**
  Becomes usable: A valid search displays exactly three idea cards inline; loading, provider failure, and 429 states are understandable and keep the answers available.
  Why now: The verified server contract can now be connected to the user's journey without mixing UI bugs with AI output validation.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Features and Behavior > Results and Recovery`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Inline Results`, `spec.md > Components > Landing and Finder`
  Build: Add result cards with idea title/category/reason/query and relevant external store links; show the price/availability note; render no cards before success; loading/error/rate messaging; scroll to results after success.
  Verify (mechanical): Run build and local route/UI checks for pending, success, malformed response, 429, and provider error. Confirm exactly three cards only on success, and each external link has safe target/rel.
  Learner check: Submit a valid finder request and inspect the three cards, links, budget language, and store verification note.
  Commit: `Show inline gift ideas and recovery states`

- [ ] **5. Edit answers, retry, and verify the full local journey**
  Becomes usable: Visitor can return to the form with answers intact, retry errors, and complete the end-to-end local flow without broken responsive sections.
  Why now: This closes the loop and verifies that UI state, route behavior, and external links work together.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behavior > Results and Recovery`
  Spec ref: `spec.md > Components > Landing and Finder`, `spec.md > Failure Modes and Security`, `spec.md > Where it runs`
  Build: Implement Edit Preferences scrolling and retained inputs, retry without clearing answers, final responsive/focus/accessibility corrections, and remove obsolete catalog code/data only after reference audit. Preserve useful illustration assets.
  Verify (mechanical): Run production build and lint; inspect local flow at mobile/tablet/desktop sizes; verify API validation and responses, result links, retry/edit, no-result-before-submit, key secrecy, and no horizontal overflow.
  Learner check: Kick the tires on the complete local experience and report anything broken, confusing, or worth changing before final review.
  Commit: `Complete GiftPilot discovery flow`

## Hands-on Checkpoints

- [ ] Early visual feedback completed — after slice 1; apply feedback before the AI route/UI work.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 5.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- Product direction updated per learner request: replaced the static catalog/store with three AI-generated gift ideas and application-built search links for six approved Saudi shopping sites. Removed obsolete catalog matching, separate results page, and product detail modal requirements.
- Added SAR preference bounds, shared Zod validation, free-text limits, inline results, server-side Gemini response validation, store allowlist, and no-verified-price disclosure. Public deployment remains undecided.
