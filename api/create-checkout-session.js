import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const { items = [], customer_email, return_url } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items in request");

    const origin = process.env.ORIGIN || `https://${req.headers.host}`;
    const toCents = (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) throw new Error(`Invalid amount: ${v}`);
      return Math.round(n * 100);
    };

    const line_items = items.map((i) => {
      if (i.priceId) return { price: i.priceId, quantity: i.qty || 1 };

      const name = i.name || i.title || "Order item";
      const unit = i.unit_amount ?? i.amount ?? i.unitPrice ?? i.price;
      const currency = (i.currency || "eur").toLowerCase();

      return {
        price_data: {
          currency,
          product_data: { name },
          unit_amount: toCents(unit),
        },
        quantity: i.qty || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items,
      customer_email: customer_email || undefined,
      return_url: `${return_url || `${origin}/checkout/return`}?session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.status(200).json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    const msg = err?.raw?.message || err?.message || "create session failed";
    return res.status(400).json({ error: msg });
  }
}
