---
doc: scope
status: approved
---

# GiftPilot — Project Scope

## The Unique Kernel

GiftPilot is an AI-powered gift discovery assistant for people in Saudi Arabia. It turns a recipient, occasion, SAR budget, and interests into three personalized gift ideas, then gives the visitor trusted search links for relevant Saudi shopping sites. The ideas are suggestions, not live product listings.

## Who It's For

People in Saudi Arabia who want help finding a thoughtful gift for a friend, relative, partner, colleague, or another recipient.

## The Core Loop

1. Open the cheerful GiftPilot landing page and go to the gift finder.
2. Enter the recipient, occasion, target budget in SAR, and optional interests.
3. Ask Gemini for three distinct gift ideas and concise reasons tailored to the answers.
4. Review search links for relevant stores (Amazon.sa, Noon, SHEIN, AliExpress, Jarir, and eXtra).
5. Open a store search in a new tab, then check actual products, prices, availability, delivery, and sellers on that store.
6. Edit the preferences and search again if needed.

## What "Working" Looks Like

A visitor can submit complete preferences and receive exactly three distinct gift ideas with titles, reasons, categories, useful search terms, and relevant links to approved stores. The budget is described as a target, never as a verified price filter. No result is shown before a successful search, and failure keeps the entered answers available for retry.

## The POC Boundary

- One responsive landing page with the existing playful visual identity and an on-page finder.
- A server-side Gemini request using a private environment key.
- Three structured AI ideas, with results displayed inline after successful submission.
- A six-store ID allowlist and application-built store search URLs.
- Shared preference and response validation, including character limits.
- A small best-effort in-memory request limit.
- Local development and verification; deployment is undecided and not required.

## Explicitly Cut

- A conventional online store, browsable static catalog, product database, and catalog-matching recommendation logic.
- Product APIs, scraping, price aggregation, carts, checkout, accounts, and payments.
- Claims about verified prices, stock, ratings, shipping, sellers, or store-applied budget filters.
- AI-supplied URLs or any store ID outside the application allowlist.
- Public deployment as a hackathon requirement.

## Inspiration & Identity

Keep the existing bright, warm, playful GiftPilot design. The interface should feel welcoming and simple, with a gift illustration, confident headline, warm paper and peach tones, deep plum accents, rounded controls, and friendly concise copy. The site helps visitors discover ideas and then explore real stores; it is not itself a shop.

---
