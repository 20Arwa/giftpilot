import { NextRequest, NextResponse } from "next/server";
import { generateGiftIdeas } from "@/lib/gemini";
import { checkRecommendationLimit } from "@/lib/rate-limit";
import { geminiResponseSchema, preferencesSchema } from "@/lib/recommendation-schema";
import { buildStoreLinks } from "@/lib/stores";

function requestIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check your answers and try again." }, { status: 400 });
  }

  const parsedPreferences = preferencesSchema.safeParse(body);
  if (!parsedPreferences.success) {
    return NextResponse.json({ error: "Please check that your recipient, occasion, and interests are meaningful, and that your budget is valid." }, { status: 400 });
  }

  const limit = checkRecommendationLimit(requestIp(request));
  if (!limit.allowed) {
    return NextResponse.json({ error: "You’ve made a few requests. Please wait a little and try again." }, {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSeconds) },
    });
  }

  try {
    const generated = await generateGiftIdeas(parsedPreferences.data);
    const parsedResponse = geminiResponseSchema.safeParse(generated);
    if (!parsedResponse.success) {
      return NextResponse.json({ error: "We couldn’t prepare reliable ideas. Please try again." }, { status: 502 });
    }

    if (!parsedResponse.data.preferencesValid) {
      return NextResponse.json({
        status: "invalid_preferences",
        error: "We couldn’t understand the recipient or occasion. Please add a little more detail and try again.",
        recommendations: [],
      }, { status: 422 });
    }

    const ideas = parsedResponse.data.recommendations;
    const titles = ideas.map((idea) => idea.title.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim());
    const queries = ideas.map((idea) => idea.searchQuery.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim());
    if (new Set(titles).size !== 3 || new Set(queries).size !== 3) {
      return NextResponse.json({ error: "We couldn’t prepare three distinct ideas. Please try again." }, { status: 502 });
    }

    const recommendations = ideas.map((idea) => ({
      title: idea.title,
      reason: idea.reason,
      category: idea.category,
      searchQuery: idea.searchQuery,
      stores: buildStoreLinks(idea.storeIds, idea.category, idea.searchQuery),
    }));

    return NextResponse.json({ recommendations });
  } catch (error) {
    const missingKey = error instanceof Error && error.message === "MISSING_GEMINI_KEY";
    if (!missingKey) console.error("Gift recommendation request failed.");
    return NextResponse.json({
      error: missingKey
        ? "Gift ideas aren’t connected yet. Please try again later."
        : "Something went wrong while finding gift ideas. Please try again.",
    }, { status: missingKey ? 503 : 502 });
  }
}
