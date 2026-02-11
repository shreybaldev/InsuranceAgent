// ============================================
// SUGGESTED QUESTIONS CONFIGURATION
// ============================================
// Edit this file to change the suggested questions
// shown to users in the chat interface.
// ============================================

export const QUERY_TYPES = [
  {
    id: "buy",
    label: "Buy New Policy",
    icon: "🛒",
    placeholder: "Ask me anything about buying insurance...",
  },
  {
    id: "claim",
    label: "File a Claim",
    icon: "📋",
    placeholder: "Ask about filing or tracking your claim...",
  },
  {
    id: "renew",
    label: "Renew Policy",
    icon: "🔄",
    placeholder: "Ask about renewal or switching policies...",
  },
];

export const SUGGESTED_QUESTIONS = [
  "Compare health insurance plans under ₹10,000",
  "How do I claim my car insurance?",
  "Should I renew or switch my policy?",
];

// You can also organize questions by query type if needed:
export const QUESTIONS_BY_TYPE = {
  buy: [
    "Compare health insurance plans under ₹10,000",
    "What's the best term life insurance?",
    "How much car insurance do I need?",
  ],
  claim: [
    "How do I claim my car insurance?",
    "What documents are needed for a health claim?",
    "How long does claim settlement take?",
  ],
  renew: [
    "Should I renew or switch my policy?",
    "Will my premium increase on renewal?",
    "Can I add coverage when renewing?",
  ],
};
