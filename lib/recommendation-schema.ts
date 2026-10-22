import { z } from "zod";

export const BUDGET_MIN = 20;
export const BUDGET_MAX = 3000;
export const BUDGET_STEP = 10;

export const STORE_IDS = ["amazon_sa", "noon", "shein", "aliexpress", "jarir", "extra"] as const;
export const GIFT_CATEGORIES = [
  "electronics",
  "fashion",
  "home",
  "beauty",
  "books and stationery",
  "food and treats",
  "hobbies and creative",
  "experiences",
  "other",
] as const;
export const RECIPIENT_OPTIONS = ["Friend", "Family member", "Brother", "Sister", "Partner", "Colleague", "Parent", "Other"] as const;
export const OCCASION_OPTIONS = ["Birthday", "Graduation", "Wedding", "Anniversary", "New baby", "Thank you", "Eid", "Other"] as const;

const requiredText = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `Use ${max} characters or fewer.`);

const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

function hasClearlyInvalidTextPattern(value: string) {
  const normalized = value.normalize("NFKC").trim().toLocaleLowerCase();
  const letters = normalized.match(/\p{L}/gu) ?? [];
  if (letters.length < 2 || /(\p{L})\1{3,}/u.test(normalized)) return true;

  const compact = normalized.replace(/[^\p{L}\p{N}]/gu, "");
  if (/^(\p{L}{2,4})\1+$/u.test(compact)) return true;

  const hasKeyboardRun = keyboardRows.some((row) => {
    const sequences = [row, [...row].reverse().join("")];
    return sequences.some((sequence) => {
      for (let index = 0; index <= sequence.length - 4; index += 1) {
        if (normalized.includes(sequence.slice(index, index + 4))) return true;
      }
      return false;
    });
  });
  if (hasKeyboardRun) return true;

  const words = normalized.match(/\p{L}+/gu) ?? [];
  return words.length >= 3 && words.every((word) => word === words[0]);
}

const recipientFieldsSchema = z.object({
  recipient: z.enum(RECIPIENT_OPTIONS),
  customRecipient: z.string().optional(),
});

const occasionFieldsSchema = z.object({
  occasion: z.enum(OCCASION_OPTIONS),
  customOccasion: z.string().optional(),
});

export const preferencesSchema = z.object({
  recipient: z.enum(RECIPIENT_OPTIONS, { error: "Choose who the gift is for." }),
  customRecipient: z.string().trim().max(60, "Use 60 characters or fewer.").optional().default(""),
  occasion: z.enum(OCCASION_OPTIONS, { error: "Choose an occasion." }),
  customOccasion: z.string().trim().max(60, "Use 60 characters or fewer.").optional().default(""),
  budgetMin: z.number().finite().min(BUDGET_MIN).max(BUDGET_MAX),
  budgetMax: z.number().finite().min(BUDGET_MIN).max(BUDGET_MAX),
  interests: z.string().trim().max(200, "Use 200 characters or fewer.").optional().default(""),
})
  .refine((value) => value.recipient !== "Other" || !hasClearlyInvalidTextPattern(value.customRecipient), {
    path: ["customRecipient"],
    error: "Please enter a name or short description for the recipient.",
    when(payload) {
      return recipientFieldsSchema.safeParse(payload.value).success;
    },
  })
  .refine((value) => value.occasion !== "Other" || !hasClearlyInvalidTextPattern(value.customOccasion), {
    path: ["customOccasion"],
    error: "Please describe the occasion in a few meaningful words.",
    when(payload) {
      return occasionFieldsSchema.safeParse(payload.value).success;
    },
  })
  .superRefine((value, ctx) => {
    if (value.budgetMin > value.budgetMax) {
      ctx.addIssue({ code: "custom", path: ["budgetMax"], message: "Maximum budget must be at least the minimum." });
    }
  })
  .refine((value) => !value.interests || !hasClearlyInvalidTextPattern(value.interests), {
    path: ["interests"],
    error: "Enter a clear interest, or leave this optional field blank.",
    when(payload) {
      return z.object({ interests: z.string().optional() }).safeParse(payload.value).success;
    },
  });

export const ideaSchema = z.object({
  title: requiredText(100, "Gift idea"),
  reason: requiredText(320, "Reason"),
  category: z.enum(GIFT_CATEGORIES),
  searchQuery: requiredText(120, "Search terms"),
  storeIds: z.array(z.string()).max(12).transform((ids) =>
    ids.filter((id): id is StoreId => (STORE_IDS as readonly string[]).includes(id)),
  ),
});

export const geminiResponseSchema = z.object({
  preferencesValid: z.boolean(),
  message: z.string().trim().max(180),
  recommendations: z.array(ideaSchema).max(3),
}).superRefine((result, ctx) => {
  if (result.preferencesValid && result.recommendations.length !== 3) {
    ctx.addIssue({ code: "custom", path: ["recommendations"], message: "Valid preferences require exactly three recommendations." });
  }
  if (!result.preferencesValid && result.recommendations.length !== 0) {
    ctx.addIssue({ code: "custom", path: ["recommendations"], message: "Invalid preferences must not include recommendations." });
  }
  if (!result.preferencesValid && !result.message) {
    ctx.addIssue({ code: "custom", path: ["message"], message: "Invalid preferences require a helpful message." });
  }
  if (result.preferencesValid && result.message) {
    ctx.addIssue({ code: "custom", path: ["message"], message: "Valid preferences must not include a validation message." });
  }
});

export const recommendationSchema = z.object({
  title: z.string(),
  reason: z.string(),
  category: z.enum(GIFT_CATEGORIES),
  searchQuery: z.string(),
  stores: z.array(z.object({ id: z.enum(STORE_IDS), label: z.string(), url: z.string().url() })),
});
export const recommendationResponseSchema = z.object({ recommendations: z.array(recommendationSchema).length(3) });

export type FinderPreferences = z.infer<typeof preferencesSchema>;
export type GiftCategory = (typeof GIFT_CATEGORIES)[number];
export type StoreId = (typeof STORE_IDS)[number];
export type GiftIdea = z.infer<typeof ideaSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
