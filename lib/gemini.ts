import "server-only";
import { GoogleGenAI } from "@google/genai";
import type { FinderPreferences } from "@/lib/recommendation-schema";

const responseJsonSchema = {
  type: "OBJECT",
  properties: {
    preferencesValid: {
      type: "BOOLEAN",
      description: "True only when the recipient and occasion are understandable enough to make relevant gift recommendations.",
    },
    message: {
      type: "STRING",
      description: "Always English. Empty for valid preferences; for invalid preferences, a short helpful clarification in English, regardless of the language or content of the user's input.",
    },
    recommendations: {
      type: "ARRAY",
      minItems: 0,
      maxItems: 3,
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          reason: { type: "STRING" },
          category: { type: "STRING", enum: ["electronics", "fashion", "home", "beauty", "books and stationery", "food and treats", "hobbies and creative", "experiences", "other"] },
          searchQuery: { type: "STRING" },
          storeIds: { type: "ARRAY", items: { type: "STRING", enum: ["amazon_sa", "noon", "shein", "aliexpress", "jarir", "extra"] } },
        },
        required: ["title", "reason", "category", "searchQuery", "storeIds"],
        propertyOrdering: ["title", "reason", "category", "searchQuery", "storeIds"],
      },
    },
  },
  required: ["preferencesValid", "message", "recommendations"],
  propertyOrdering: ["preferencesValid", "message", "recommendations"],
};

export async function generateGiftIdeas(preferences: FinderPreferences) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("MISSING_GEMINI_KEY");

  const ai = new GoogleGenAI({ apiKey });
  const recipient = preferences.recipient === "Other" ? preferences.customRecipient : preferences.recipient;
  const occasion = preferences.occasion === "Other" ? preferences.customOccasion : preferences.occasion;
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    contents: `You are GiftPilot, a thoughtful gift idea assistant for Saudi Arabia. First assess whether the recipient and occasion are understandable enough to make relevant suggestions. Accept unfamiliar or unusual but plausible names, nicknames, Arabic names and text, transliterations, and personal descriptions. Do not reject a name only because it is uncommon. Interests are optional: ignore them if they are blank or unclear; never reject otherwise understandable recipient and occasion preferences because of interests.\n\nAll natural-language text in your response, including titles, reasons, search terms, and validation messages, must be in English regardless of the language or content of the user's input. Do not switch languages or include Arabic or other non-English text in these fields.\n\nIf the recipient or occasion is clearly nonsensical or too unclear to recommend for, return preferencesValid=false, a brief helpful clarification in English, and an empty recommendations array. Do not make or include gift ideas in this case.\n\nOtherwise return preferencesValid=true, an empty message, and exactly three distinct gift IDEAS, not named products or listings. The budget is a target in SAR, not a verified product price. Do not invent prices, ratings, sellers, inventory, shipping, or links. Return useful search terms and select only relevant store IDs from: amazon_sa, noon, shein, aliexpress, jarir, extra. Keep reasons short and personalized.\n\nPreferences:\nRecipient: ${recipient}\nOccasion: ${occasion}\nTarget budget: SAR ${preferences.budgetMin} to SAR ${preferences.budgetMax}\nInterests: ${preferences.interests || "Not specified"}`,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema,
      temperature: 0.75,
    },
  });
  if (!response.text) throw new Error("EMPTY_GEMINI_RESPONSE");
  return JSON.parse(response.text) as unknown;
}
