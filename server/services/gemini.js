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

let genAI = null;

const MAX_PDF_CHARS = 30000;

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Add it to Railway variables or a local .env file.");
    }
    console.log("Gemini API key loaded successfully");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function truncatePdfContent(content) {
  if (!content || content.length <= MAX_PDF_CHARS) {
    return content;
  }
  const truncated = content.substring(0, MAX_PDF_CHARS);
  console.log(`PDF content truncated from ${content.length} to ${MAX_PDF_CHARS} characters`);
  return truncated + "\n\n[Document truncated due to length]";
}

function buildPrompt(question, pdfContent = null) {
  let prompt = `${SYSTEM_PROMPT}\n\n`;

  if (pdfContent) {
    const truncatedContent = truncatePdfContent(pdfContent);
    prompt += `The user uploaded a document. Analyze it and answer their question.\n\nDocument:\n---\n${truncatedContent}\n---\n\n`;
  }

  prompt += `User question: ${question}\n\nProvide a helpful response:`;
  return prompt;
}

// Non-streaming version (fallback)
export async function getInsuranceAdvice(question, pdfContent = null) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = buildPrompt(question, pdfContent);

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

// Streaming version
export async function* streamInsuranceAdvice(question, pdfContent = null) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = buildPrompt(question, pdfContent);

  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}
