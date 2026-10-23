# GiftPilot

![GiftPilot hero section](public/images/hero-section.png)

GiftPilot is an AI-powered gift discovery application designed for visitors in Saudi Arabia. It helps users find three personalized gift ideas based on the recipient, occasion, budget, and interests, with links to search for those ideas on selected shopping sites.

**Note:** GiftPilot is a gift discovery tool, not an online store. It does not list or verify individual products, prices, availability, or sellers. Visitors should confirm product details, shipping information, and prices directly on the store's website.

---

## Demo Video
https://drive.google.com/file/d/1vtgH9vhIo9obos2vhAKh7_l8TN55-FVD/view?usp=drivesdk

---

## Features

- **Personalized Gift Recommendations**: Get three gift ideas tailored to the recipient, occasion, budget, and interests.
- **Shopping Search Links**: Explore gift ideas on selected shopping sites.
- **Preference-Based Search**: Adjust your preferences to discover alternative recommendations.
- **Input Validation**: Validate recommendation requests and provide helpful feedback when the submitted preferences are invalid.
- **Graceful AI Setup Handling**: The application can start without an API key; recommendation requests display a retryable setup message when AI access is unavailable.

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Gemini API

---

## Getting Started (Run Locally)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and add your Google AI Studio API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Keep your API key private. It is used by the server-side API route and must not be exposed through a `NEXT_PUBLIC_` environment variable.

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Checks

Run the following commands to check the project:

```bash
npm run lint
npm run build
```

---

## Security and Limitations

- The Gemini API key must remain server-side and must never be committed to the repository.
- The request limit is a small, in-memory, best-effort limit. It is not a shared global counter and should not be treated as production-grade rate limiting.
- AI recommendations and shopping search links are intended to help users discover ideas, not to guarantee product availability, suitability, or pricing.
- Public deployment is undecided and is outside the scope of the current MVP.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.