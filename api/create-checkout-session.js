import Stripe from "stripe";
import { randomUUID } from "crypto";

const NUM = (v) => (Number.isFinite(v) ? Number(v) : undefined);

function toUnitCents(item) {
  const qty = NUM(item.qty) ?? 1;
  const currency = (item.currency || "eur").toLowerCase();
  const centsDirect =
    NUM(item.unit_amount_cents) ?? NUM(item.amount_cents) ?? NUM(item.priceCents) ?? NUM(item.eurCents);
  if (centsDirect != null) return { cents: Math.round(centsDirect), qty, currency };
  const euros =
    NUM(item.unit_amount) ?? NUM(item.amount) ?? NUM(item.unitPrice) ?? NUM(item.price) ?? NUM(item.price_eur) ?? NUM(item.eur);
  if (euros != null) return { cents: Math.round(euros * 100), qty, currency };
  if (NUM(item.total_cents) != null && qty > 0) return { cents: Math.round(NUM(item.total_cents) / qty), qty, currency };
  if (NUM(item.total) != null && qty > 0) return { cents: Math.round((NUM(item.total) * 100) / qty), qty, currency };
  return null;
}

// flatten nested buyer object into Stripe-friendly metadata (max ~50 keys)
function flattenBuyer(buyer = {}, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(buyer)) {
    const key = (prefix ? `${prefix}_${k}` : k).toLowerCase();
    if (v && typeof v === "object") flattenBuyer(v, key, out);
    else if (v != null) out[key] = String(v).slice(0, 490);
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const { items = [], customer_email, return_url, total_cents, buyer = {} } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items in request");

    let line_items = [];
    for (const it of items) {
      if (it.priceId) { line_items.push({ price: it.priceId, quantity: it.qty || 1 }); continue; }
      const p = toUnitCents(it);
      if (!p) continue;
      line_items.push({
        price_data: { currency: p.currency, product_data: { name: it.name || it.title || "Order item" }, unit_amount: p.cents },
        quantity: p.qty,
      });
    }
    if (line_items.length === 0) {
      const agg = NUM(total_cents) ?? items.reduce((s, it) => { const p = toUnitCents(it); return s + (p ? p.cents * (p.qty || 1) : 0); }, 0);
      if (!agg || !Number.isFinite(agg) || agg <= 0) throw new Error("No valid amounts in payload");
      line_items = [{ price_data: { currency: "eur", product_data: { name: "LuxOffset purchase" }, unit_amount: Math.round(agg) }, quantity: 1 }];
    }

    const origin = process.env.ORIGIN || `https://${req.headers.host}`;
    const ref = randomUUID();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items,
      customer_email: customer_email || undefined,
      client_reference_id: ref,
      metadata: { order_ref: ref, ...flattenBuyer(buyer) },  // <<— stores details in Stripe
      return_url: `${return_url || `${origin}/checkout/return`}?session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.status(200).json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return res.status(400).json({ error: err?.raw?.message || err?.message || "create session failed" });
  }
}
