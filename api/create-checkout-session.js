import Stripe from "stripe";

const NUM = (v) => (Number.isFinite(v) ? Number(v) : undefined);

// try to infer an item's unit price (in **cents** if available, otherwise euros→cents)
function toUnitCents(item) {
  const qty = NUM(item.qty) ?? 1;
  const currency = (item.currency || "eur").toLowerCase();

  // explicit cents fields first
  const centsDirect =
    NUM(item.unit_amount_cents) ??
    NUM(item.amount_cents) ??
    NUM(item.priceCents) ??
    NUM(item.eurCents);
  if (centsDirect != null) return { cents: Math.round(centsDirect), qty, currency };

  // euros fields -> cents
  const euros =
    NUM(item.unit_amount) ??
    NUM(item.amount) ??
    NUM(item.unitPrice) ??
    NUM(item.price) ??
    NUM(item.price_eur) ??
    NUM(item.eur);
  if (euros != null) return { cents: Math.round(euros * 100), qty, currency };

  // derive from totals
  if (NUM(item.total_cents) != null && qty > 0)
    return { cents: Math.round(NUM(item.total_cents) / qty), qty, currency };
  if (NUM(item.total) != null && qty > 0)
    return { cents: Math.round((NUM(item.total) * 100) / qty), qty, currency };

  return null;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const { items = [], customer_email, return_url, total_cents } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items in request");

    // build line items; accept priceId OR infer amounts
    let line_items = [];
    for (const it of items) {
      if (it.priceId) {
        line_items.push({ price: it.priceId, quantity: it.qty || 1 });
        continue;
      }
      const parsed = toUnitCents(it);
      if (!parsed) continue; // skip unusable shapes; we'll fallback below
      line_items.push({
        price_data: {
          currency: parsed.currency,
          product_data: { name: it.name || it.title || "Order item" },
          unit_amount: parsed.cents,
        },
        quantity: parsed.qty,
      });
    }

    // fallback: aggregate a single line item from total
    if (line_items.length === 0) {
      const aggCents =
        NUM(total_cents) ??
        items.reduce((s, it) => {
          const p = toUnitCents(it);
          return s + (p ? p.cents * (p.qty || 1) : 0);
        }, 0);

      if (!aggCents || !Number.isFinite(aggCents) || aggCents <= 0)
        throw new Error("No valid amounts in payload");

      line_items = [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "LuxOffset purchase" },
            unit_amount: Math.round(aggCents),
          },
          quantity: 1,
        },
      ];
    }

    const origin = process.env.ORIGIN || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items,
      customer_email: customer_email || undefined,
      return_url: `${return_url || `${origin}/checkout/return`}?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    res.status(400).json({ error: err?.raw?.message || err?.message || "create session failed" });
  }
}
