import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are PolicyIQ, an AI insurance information assistant. You MUST follow these rules strictly:

SCOPE LIMITATIONS:
- ONLY answer questions related to insurance (health, life, auto, home, renters, business, travel, pet, disability, liability insurance)
- If a question is NOT about insurance, politely decline and redirect: "I'm PolicyIQ, specialized only in insurance topics. I can help you with questions about health, life, auto, home, or other insurance types. Please ask me an insurance-related question."
- Do NOT answer questions about: coding, recipes, general advice, politics, entertainment, sports, or any non-insurance topics

RESPONSE GUIDELINES:
- Be DIPLOMATIC and NEUTRAL - never recommend specific insurance companies, brands, or providers
- Never say "Company X is better than Company Y"
- Instead of recommending, explain factors to consider and questions to ask providers
- Use phrases like "You may want to consider...", "Factors to evaluate include...", "Questions to ask your agent..."
- Provide educational information, not personalized financial advice
- Always suggest consulting with a licensed insurance agent for specific policy decisions

TONE:
- Professional, helpful, and informative
- Clear and concise explanations
- Use bullet points and structured formatting for readability

DISCLAIMER:
- For complex questions, remind users that this is general information and they should consult a licensed insurance professional for personalized advice`;

let genAI = null;

// Max characters to send (roughly ~3-4 chars per token, keeping under 10k tokens for safety)
const MAX_PDF_CHARS = 30000;

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Initializing Gemini with API key:", apiKey ? `${apiKey.substring(0, 10)}...` : "MISSING");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function truncatePdfContent(content) {
  if (!content || content.length <= MAX_PDF_CHARS) {
    return content;
  }

  // Truncate and add notice
  const truncated = content.substring(0, MAX_PDF_CHARS);
  console.log(`PDF content truncated from ${content.length} to ${MAX_PDF_CHARS} characters`);
  return truncated + "\n\n[Document truncated due to length - showing first portion]";
}

export async function getInsuranceAdvice(question, pdfContent = null) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemma-3-27b-it" });

  let prompt = `${SYSTEM_PROMPT}\n\n`;

  if (pdfContent) {
    const truncatedContent = truncatePdfContent(pdfContent);
    prompt += `The user has uploaded an insurance document. Here is the content:\n---\n${truncatedContent}\n---\n\nBased on this document, please answer the following question.\n\n`;
  }

  prompt += `User question: ${question}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
