// shared/pricing.js
const PRICING = {
  currency: "eur",

  individuals: {
    // per-tonne
    perTonne: { standard: 12, premium: 20, elite: 30 },
    addons: { giftCard: 10 }, // flat fee
  },

  companies: {
    perTonne: { standard: 9, premium: 16, elite: 22 },
    csr: { starter: 390, plus: 990, pro: 2490 },
  },

  // optional: clamp limits used in inputs
  qtyLimits: { min: 1, max: 100000 },
};

// Accepts "std", "standard", "high", "premium", "pro", etc.
function normalizeQuality(q) {
  const s = String(q || "").toLowerCase();
  if (["std","standard","basic","regular","default"].includes(s)) return "standard";
  if (["premium","high","plus","pro","gold"].includes(s)) return "premium";
  if (["elite","ultra","top"].includes(s)) return "elite";
  return "standard";
}

function eurToCents(n) { return Math.round(Number(n) * 100); }

export { PRICING as default, normalizeQuality, eurToCents };
