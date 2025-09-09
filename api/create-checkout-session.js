import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  const { items = [], customer_email, return_url } = req.body || {};
  const origin = process.env.ORIGIN || `https://${req.headers.host}`;

  // Map your cart items to Stripe line_items.
  const toCents = v => (typeof v === "number" ? Math.round(v * 100) : undefined);
  const line_items = items.map(i =>
    i.priceId
      ? { price: i.priceId, quantity: i.qty || 1 }
      : {
          price_data: {
            currency: i.currency || "eur",
            product_data: { name: i.name || i.title || "Carbon offset" },
            unit_amount: i.amount_cents ?? toCents(i.amount),
          },
          quantity: i.qty || 1,
        }
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded",
    line_items,
    customer_email: customer_email || undefined,
    return_url: `${return_url || `${origin}/checkout/return`}?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.status(200).json({ client_secret: session.client_secret });
}
