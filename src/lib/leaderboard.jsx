// src/lib/leaderboard.js
const KEY = "leaderboardPurchases_v2";
export const QUALITY_COEFF = { standard: 1.0, premium: 1.25, elite: 1.5 };

export function addPurchase({ group = "individual", name, email, qty = 0, quality = "standard" }) {
  const list = JSON.parse(localStorage.getItem(KEY) || "[]");
  list.push({ group, name, email, qty, quality, ts: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getLeaderboard(group = "individual") {
  const list = JSON.parse(localStorage.getItem(KEY) || "[]").filter(p => p.group === group);
  const agg = new Map();
  for (const p of list) {
    const coeff = QUALITY_COEFF[p.quality] ?? 1;
    const score = (p.qty || 0) * coeff;
    const key = (p.name || p.email || "anon").toLowerCase();
    const prev = agg.get(key) || { name: p.name, email: p.email, qty: 0, score: 0 };
    prev.qty += p.qty || 0;
    prev.score += score;
    agg.set(key, prev);
  }
  return Array.from(agg.values()).sort((a,b)=>b.score - a.score);
}

export function addOptedInCompaniesFromCart(items = []) {
  items.forEach((it) => {
    const type = (it?.meta?.type || it?.type || "").toLowerCase();
    if (type === "company" && it?.meta?.leaderboardOptIn) {
      addPurchase({
        group: "company",
        name: it.meta?.companyName || "Company",
        email: it.meta?.meEmail,
        qty: it.size ?? it.meta?.qty ?? 0,
        quality: it.qualityKey ?? "standard",
      });
    }
  });
}

export function addOptedInIndividualsFromCart(items = []) {
  items.forEach((it) => {
    const type = (it?.meta?.type || it?.type || "").toLowerCase(); // "individual" | "company"
    if (type === "company") return;
    if (!it?.meta?.leaderboard) return;

    const mode = (it?.meta?.mode || "").toLowerCase(); // "self" | "gift"
    const name  = mode === "gift" ? (it.meta?.recName  || "Recipient")  : (it.meta?.meName  || "Anonymous");
    const email = mode === "gift" ? (it.meta?.recEmail || undefined)     : (it.meta?.meEmail || undefined);
    const qty = it.size ?? it.meta?.qty ?? 0;
    const quality = it.qualityKey || "standard";

    addPurchase({
      group: "individual",
      name,
      email,
      qty,
      quality
    });
  });
}
