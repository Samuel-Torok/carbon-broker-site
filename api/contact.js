// Vercel serverless function
import { Resend } from "resend";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDER = process.env.SENDER_EMAIL;           // e.g. "LuxOffset <hello@luxoffset.com>"
const NOTIFY = process.env.NOTIFY_EMAIL || SENDER; // where you receive copies

const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));

export default async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") { for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v); return res.status(204).end(); }
  for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v);

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!resend || !SENDER) throw new Error("Email not configured (RESEND_API_KEY / SENDER_EMAIL).");

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const name    = String(body.name || "").trim();
    const email   = String(body.email || "").trim();
    const who     = String(body.who || "contact").toLowerCase();     // "contact" | "marketplace" | "meeting" | etc.
    const need    = String(body.need || "").trim();                   // free text or "sample:<id>"
    const message = String(body.message || "").trim();
    const locale  = String(body.locale || "en").toLowerCase();
    // NEW: meeting-specific optional fields
    const company  = String(body.company || body.companyName || "").trim();
    const phone    = String(body.phone || "").trim();
    const mode     = String(body.mode || "").toLowerCase();          // "", "video", "in-person", "either"
    const platform = String(body.platform || "").trim();             // "Teams" | "Zoom" | "Google Meet" | ...
    const slots    = Array.isArray(body.slots) ? body.slots.filter(Boolean).slice(0,3) : [];
 

    // basic validation
    if (!name || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid name or email" });
    }

    // pick copy
    const isFr = locale.startsWith("fr");
    const subjects = {
      contact:    isFr ? "Merci — nous avons bien reçu votre message" : "Thanks — we received your message",
      marketplace:isFr ? "Merci — votre demande de projet a été reçue" : "Thanks — your project enquiry was received",
      meeting:    isFr ? "Merci — demande de rendez-vous reçue"       : "Thanks — your meeting request was received",
      default:    isFr ? "Merci — nous vous répondrons très bientôt"   : "Thanks — we’ll get back to you shortly",
    };
    const subject =
      who === "marketplace" ? subjects.marketplace :
      who === "meeting"     ? subjects.meeting     :
      who === "contact"     ? subjects.contact     : subjects.default;

    const introUser = isFr
      ? "Nous avons bien reçu votre demande. Nous revenons vers vous au plus vite par e-mail."
      : "We’ve received your request. We’ll get back to you by email as soon as possible.";

    // NEW: render proposed time slots rows (if any)
    const slotsRows = slots
        .map((s,i)=>`<tr><td style="padding:6px 10px">Slot ${i+1}</td><td style="padding:6px 10px">${escapeHtml(s)}</td></tr>`)
        .join("");

    // user auto-reply
    const userHtml = `
      <div style="font:14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#0b3b31">
        <h2 style="margin:0 0 10px">Hi ${escapeHtml(name)},</h2>
        <p>${introUser}</p>
        <h3 style="margin:18px 0 8px">Summary</h3>
        <table style="border-collapse:collapse;background:#f6fff9;border-radius:8px">
          <tbody>
            <tr><td style="padding:6px 10px">Category</td><td style="padding:6px 10px"><b>${escapeHtml(who || "contact")}</b></td></tr>
            ${company ? `<tr><td style="padding:6px 10px">Company</td><td style="padding:6px 10px">${escapeHtml(company)}</td></tr>` : ""}
            ${phone ? `<tr><td style="padding:6px 10px">Phone</td><td style="padding:6px 10px">${escapeHtml(phone)}</td></tr>` : ""}
            ${mode ? `<tr><td style="padding:6px 10px">Meeting</td><td style="padding:6px 10px">${escapeHtml(mode)}${platform ? " • "+escapeHtml(platform) : ""}</td></tr>` : ""}
            ${slotsRows}
            ${need ? `<tr><td style="padding:6px 10px">Topic</td><td style="padding:6px 10px">${escapeHtml(need)}</td></tr>` : ""}
            ${message ? `<tr><td style="padding:6px 10px;vertical-align:top">Message</td><td style="padding:6px 10px;white-space:pre-wrap">${escapeHtml(message)}</td></tr>` : ""}
          </tbody>
        </table>
        <p style="margin-top:16px;color:#387c6d;font-size:12px">LuxOffset</p>
      </div>`.trim();

    // admin notification (so you can access submissions easily)
    const adminSubject = `[Contact] ${who || "contact"} — ${name}`;
    const adminHtml = `
      <div style="font:14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#0b3b31">
        <h3 style="margin:0 0 10px">New ${escapeHtml(who || "contact")} submission</h3>
        <table style="border-collapse:collapse;background:#fffef8;border-radius:8px">
          <tbody>
            <tr><td style="padding:6px 10px">Name</td><td style="padding:6px 10px"><b>${escapeHtml(name)}</b></td></tr>
            <tr><td style="padding:6px 10px">Email</td><td style="padding:6px 10px">${escapeHtml(email)}</td></tr>
            ${need ? `<tr><td style="padding:6px 10px">Need</td><td style="padding:6px 10px">${escapeHtml(need)}</td></tr>` : ""}
            ${message ? `<tr><td style="padding:6px 10px;vertical-align:top">Message</td><td style="padding:6px 10px;white-space:pre-wrap">${escapeHtml(message)}</td></tr>` : ""}
            <tr><td style="padding:6px 10px">Locale</td><td style="padding:6px 10px">${escapeHtml(locale)}</td></tr>
            <tr><td style="padding:6px 10px">When</td><td style="padding:6px 10px">${new Date().toISOString()}</td></tr>
          </tbody>
        </table>
      </div>`.trim();

    // send both (user + admin)
    const tags = [{ name: "kind", value: "contact" }, { name: "who", value: who || "contact" }];
    await Promise.all([
      resend.emails.send({ from: SENDER, to: email, subject, html: userHtml, tags }),
      resend.emails.send({
        from: SENDER, to: NOTIFY, subject: adminSubject, html: adminHtml,
        reply_to: email, tags
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact api error:", err);
    return res.status(500).json({ error: err?.message || "failed to send" });
  }
}
