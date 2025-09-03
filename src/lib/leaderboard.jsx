// simple localStorage-backed leaderboard with quality coefficient
const KEY = "leaderboardPurchases_v1";
export const QUALITY_COEFF = { standard: 1.0, premium: 1.25, elite: 1.5 };

export function addPurchase(entry) {
  const list = JSON.parse(localStorage.getItem(KEY) || "[]");
  list.push({ ...entry, ts: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getLeaderboard() {
  const list = JSON.parse(localStorage.getItem(KEY) || "[]");
  const agg = new Map();
  for (const p of list) {
    const coeff = QUALITY_COEFF[p.quality] ?? 1;
    const score = (p.qty || 0) * coeff;
    const key = (p.email || p.name || "anon").toLowerCase();
    const prev = agg.get(key) || { name: p.name, email: p.email, qty: 0, score: 0 };
    prev.qty += p.qty || 0;
    prev.score += score;
    agg.set(key, prev);
  }
  return Array.from(agg.values()).sort((a,b)=>b.score - a.score);
}
