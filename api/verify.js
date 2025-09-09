import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    const session_id = req.query.session_id || req.url.split("session_id=")[1];
    if (!session_id) return res.status(400).json({ error: "missing session_id" });

    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["line_items"] });
    const status = session.status || "";
    const payment_status = session.payment_status || "";
    const paid = status === "complete" && payment_status === "paid";

    const buyer = session.metadata || {}; // <<— the details you saved
    const items = (session.line_items?.data || []).map(li => ({
      name: li.description,
      qty: li.quantity,
      amount_cents: li.amount_subtotal,
      currency: li.currency,
    }));

    res.status(200).json({
      paid, status, payment_status,
      buyer,
      customer_email: session.customer_details?.email || session.customer_email || null,
      items,
      total_cents: session.amount_total ?? null,
      order_ref: session.client_reference_id || buyer.order_ref || null,
      created: session.created,
    });
  } catch (e) {
    res.status(400).json({ error: e.message || "verify failed" });
  }
}
