// api/leaderboard.js
import Stripe from "stripe";

const COEFF = { standard: 1.0, premium: 1.25, elite: 1.5 };

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const group = String(req.query.group || "individual").toLowerCase(); // "individual" | "company"
    const by = new Map(); // key = stripe customer id (or session id fallback)

    let starting_after;
    // Fetch many sessions; adjust max loops if needed
    for (let pages = 0; pages < 20; pages++) {
      const list = await stripe.checkout.sessions.list({ limit: 100, starting_after });
      for (const s of list.data) {
        if (!(s.status === "complete" && s.payment_status === "paid")) continue;
        const m = s.metadata || {};
        if ((m.leader_consent || "").toLowerCase() !== "yes") continue;
        const g = (m.leader_group || "individual").toLowerCase();
        if (g !== group) continue;

        const qty = Number(m.leader_qty || 0) || 0;
        const qual = (m.leader_quality || "standard").toLowerCase();
        const coeff = COEFF[qual] ?? 1.0;

        const emailKey = (m.leader_email || s.customer_details?.email || "")
          .trim()
          .toLowerCase();
        const key = s.customer || (emailKey ? `email:${emailKey}` : s.id);
        const name = (m.leader_name && m.leader_name.trim()) || "Anonymous";

        const curr = by.get(key) || { name, qty: 0, score: 0 };
        if (!curr.name && name) curr.name = name;
        curr.qty += qty;
        curr.score += qty * coeff;
        by.set(key, curr);
      }
      if (!list.has_more) break;
      starting_after = list.data[list.data.length - 1]?.id;
    }

    const rows = Array.from(by.values())
      .map(r => ({ name: r.name || "Anonymous", qty: r.qty, score: Number(r.score.toFixed(2)) }))
      .sort((a, b) => b.score - a.score);

    res.json(rows);
  } catch (err) {
    console.error("leaderboard error:", err);
    res.status(400).json({ error: err.message || "failed to build leaderboard" });
  }
}
