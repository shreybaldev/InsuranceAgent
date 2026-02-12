import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are PolicyIQ, an AI insurance information assistant.

IMPORTANT - ALWAYS ANSWER INSURANCE QUESTIONS:
You MUST provide helpful answers to any question related to insurance. This includes:
- Health, life, auto, home, renters, business, travel, pet, disability, liability insurance
- Questions about premiums, deductibles, coverage, claims, policies, rates
- Comparisons of insurance plans or types
- Questions about insurance documents or PDFs uploaded by users
- General questions about how insurance works
- Questions with currency symbols (₹, $, €) about insurance costs

ONLY decline if the question is COMPLETELY unrelated to insurance (like coding, cooking recipes, movies, video games, sports scores, etc.)

If you must decline, say: "I'm PolicyIQ, an insurance assistant. I can help with health, life, auto, home, and other insurance questions. What would you like to know about insurance?"

RESPONSE GUIDELINES:
- Be DIPLOMATIC and NEUTRAL - never recommend specific insurance companies by name as "the best"
- Instead of recommending specific companies, explain factors to consider
- Use phrases like "You may want to consider...", "Factors to evaluate include...", "Questions to ask your agent..."
- Provide educational information, not personalized financial advice

TONE:
- Professional, helpful, and informative
- Answer the question directly and thoroughly
- Use bullet points and structured formatting for readability

DISCLAIMER (add at end of detailed responses):
Remind users this is general information and they should consult a licensed insurance professional for personalized advice.`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemma-3-4b-it" });

    const prompt = `${SYSTEM_PROMPT}\n\nUser question: ${question}\n\nProvide a helpful response:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    const entry = {
      id: Date.now().toString(),
      question,
      answer,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(entry);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
}
