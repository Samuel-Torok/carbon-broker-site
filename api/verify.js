import Stripe from "stripe";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    const buyer = session.metadata || {};
    const email = session.customer_details?.email || session.customer_email || buyer.contactemail || null;

    const items = (session.line_items?.data || []).map(li => ({
      name: li.description, qty: li.quantity, amount_cents: li.amount_subtotal, currency: li.currency,
    }));
    const total_cents = session.amount_total ?? null;

    // --- Send receipt/certificate email once (idempotent via metadata flag)
    if (paid && resend && email && session.metadata?.emailed !== "1") {
      const html = renderReceiptHTML({ buyer, items, total_cents });
      try {
        await resend.emails.send({
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "Your LuxOffset purchase receipt",
          html,
        });
        // mark emailed to avoid duplicates
        try {
          await stripe.checkout.sessions.update(session_id, {
            metadata: { ...(session.metadata || {}), emailed: "1" },
          });
        } catch {}
        if (session.payment_intent) {
          try {
            await stripe.paymentIntents.update(session.payment_intent, {
              metadata: { emailed: "1" },
            });
          } catch {}
        }
      } catch (e) {
        // Don’t fail the verify call just because email failed
        console.error("email send error:", e);
      }
    }

    res.status(200).json({
      paid, status, payment_status,
      buyer,
      customer_email: email,
      items,
      total_cents,
      order_ref: session.client_reference_id || buyer.order_ref || null,
      created: session.created,
    });
  } catch (e) {
    res.status(400).json({ error: e.message || "verify failed" });
  }
}

// --- tiny HTML template
function eur(cents) { return typeof cents === "number" ? `€${(cents/100).toLocaleString("fr-FR",{minimumFractionDigits:2})}` : "€–"; }
function escape(s=""){ return String(s).replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])); }
function renderReceiptHTML({ buyer={}, items=[], total_cents=null }) {
  const rows = items.map(i =>
    `<tr><td style="padding:4px 8px">${escape(i.name||"Item")}</td><td style="padding:4px 8px">${i.qty||1}</td><td style="padding:4px 8px">${eur(i.amount_cents)}</td></tr>`
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
    <p>${escape(buyer.companyName||buyer.contactName||"")}${buyer.companyName?" (company)":""}<br/>
       ${escape(buyer.contactEmail||"")}</p>
    <p style="color:#387c6d;font-size:12px">LuxOffset</p>
  </div>`;
}
