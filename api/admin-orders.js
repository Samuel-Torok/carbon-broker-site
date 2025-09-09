import Stripe from "stripe";

export default async function handler(req, res) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!process.env.ADMIN_API_TOKEN || token !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));
    const list = await stripe.checkout.sessions.list({ limit, expand: ["data.line_items"] });

    const orders = list.data
      .filter(s => s.status === "complete" && s.payment_status === "paid")
      .map(s => ({
        id: s.id,
        created: s.created,
        email: s.customer_details?.email || s.customer_email || null,
        buyer: s.metadata || {},
        total_cents: s.amount_total,
        currency: s.currency,
        items: (s.line_items?.data || []).map(li => ({
          name: li.description, qty: li.quantity, amount_cents: li.amount_subtotal
        })),
        order_ref: s.client_reference_id || null,
        emailed: (s.metadata?.emailed === "1"),
      }));

    res.json({ orders });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
