# GiftPilot

GiftPilot helps visitors in Saudi Arabia discover three personalized gift ideas and search for them on selected shopping sites. GiftPilot does not list or verify products or prices; visitors should check price, availability, shipping, and seller details on the store site.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add a Google AI Studio key as `GEMINI_API_KEY`.
3. Start the development server with `npm run dev`.
4. Open `http://localhost:3000`.

The Gemini key is used only by the server route. Do not commit `.env.local` or expose the key with a `NEXT_PUBLIC_` variable. The app can still start without a key; recommendation requests will show a retryable setup message.

## Checks

- `npm run lint`
- `npm run build`

The request limit is a small in-memory best-effort limit, not a shared global counter. Public deployment is undecided and is not part of this MVP.
