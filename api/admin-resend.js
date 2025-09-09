// api/admin-resend.js
import Stripe from "stripe";
import { Resend } from "resend";

const eur = (c) => (typeof c === "number" ? `€${(c/100).toLocaleString("fr-FR",{minimumFractionDigits:2})}` : "€–");
const esc = (s="") => String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;","~":"~","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));
function renderReceiptHTML({ buyer={}, items=[], total_cents=null }) {
  const rows = items.map(i =>
    `<tr><td style="padding:4px 8px">${esc(i.name||"Item")}</td><td style="padding:4px 8px">${i.qty||1}</td><td style="padding:4px 8px">${eur(i.amount_cents)}</td></tr>`
  ).join("");
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b3b31">
      <h2>Thank you for your purchase!</h2>
      <p>We'll retire your credits shortly and email your certificate.</p>
      <h3 style="margin-top:18px">Order summary</h3>
      <table style="border-collapse:collapse;background:#f6fff9;border-radius:8px">
        <thead><tr><th align="left" style="padding:6px 8px">Item</th><th align="left" style="padding:6px 8px">Qty</th><th align="left" style="padding:6px 8px">Subtotal</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="3" style="padding:8px">Details will follow.</td></tr>`}</tbody>
        <tfoot><tr><td colspan="2" style="padding:8px"><b>Total</b></td><td style="padding:8px"><b>${eur(total_cents)}</b></td></tr></tfoot>
      </table>
      <h3 style="margin-top:18px">Buyer</h3>
      <p>${esc(buyer.companyName||buyer.contactName||"")}${buyer.companyName?" (company)":""}<br/>${esc(buyer.contactEmail||"")}</p>
      <p style="color:#387c6d;font-size:12px">LuxOffset</p>
    </div>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!process.env.ADMIN_API_TOKEN || token !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  if (!process.env.RESEND_API_KEY || !process.env.SENDER_EMAIL) {
    return res.status(400).json({ error: "email not configured" });
  }

  const session_id = req.query.session_id || req.body?.session_id;
  if (!session_id) return res.status(400).json({ error: "missing session_id" });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["line_items"] });

    const paid = session.status === "complete" && session.payment_status === "paid";
    if (!paid) return res.status(400).json({ error: "session not paid" });

    const buyer = session.metadata || {};
    const email =
      session.customer_details?.email || session.customer_email || buyer.contactemail || null;
    if (!email) return res.status(400).json({ error: "no email on session" });

    const items = (session.line_items?.data || []).map(li => ({
      name: li.description, qty: li.quantity, amount_cents: li.amount_subtotal
    }));
    const total_cents = session.amount_total ?? null;

    const resend = new Resend(String(process.env.RESEND_API_KEY).trim());
    const r = await resend.emails.send({
      from: String(process.env.SENDER_EMAIL).trim(),
      to: String(email).trim(),
      subject: "Your LuxOffset purchase receipt",
      html: renderReceiptHTML({ buyer, items, total_cents }),
    });
    if (r?.error) return res.status(400).json({ error: r.error.message || "resend failed" });

    try { await stripe.checkout.sessions.update(session_id, { metadata: { ...(session.metadata||{}), emailed: "1" } }); } catch {}
    if (session.payment_intent) {
      try { await stripe.paymentIntents.update(session.payment_intent, { metadata: { emailed: "1" } }); } catch {}
    }

    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ error: e.message || "failed" });
  }
}
