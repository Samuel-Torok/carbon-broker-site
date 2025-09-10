// api/contact.js  (serverless function on Vercel)
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM  = process.env.CONTACT_FROM || "LuxOffset <notifications@resend.dev>";
const ADMIN = process.env.ADMIN_EMAIL || "you@example.com";

const esc = s => String(s ?? "")
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;").replace(/'/g,"&#039;");

function ackCopy(locale, isMarket, ctx) {
  const fr = String(locale || "").toLowerCase().startsWith("fr");
  if (fr) {
    return {
      subject: isMarket ? "Merci — Nous avons bien reçu votre demande"
                         : "Merci — Message bien reçu",
      html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
        <p>Bonjour ${esc(ctx.name) || ""},</p>
        <p>${isMarket
          ? "Merci pour votre demande. Nous revenons très vite avec la disponibilité et un devis."
          : "Merci pour votre message. Nous vous répondrons au plus vite."}</p>
        ${isMarket ? `<p><b>Récapitulatif :</b></p>
        <pre style="background:#f6f6f9;padding:12px;border-radius:8px;white-space:pre-wrap">
${esc((ctx.need ? `need: ${ctx.need}\n` : "") + (ctx.message || ""))}</pre>` : ""}
        <p>Cordialement,<br>L’équipe LuxOffset</p>
      </div>`
    };
  }
  return {
    subject: isMarket ? "Thanks — we received your enquiry"
                       : "Thanks — we received your message",
    html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
      <p>Hi ${esc(ctx.name) || ""},</p>
      <p>${isMarket
        ? "Thanks for your enquiry. We’ll get back to you shortly with availability and pricing."
        : "Thanks for reaching out. We’ll get back to you as soon as possible."}</p>
      ${isMarket ? `<p><b>Summary you sent:</b></p>
      <pre style="background:#f6f6f9;padding:12px;border-radius:8px;white-space:pre-wrap">
${esc((ctx.need ? `need: ${ctx.need}\n` : "") + (ctx.message || ""))}</pre>` : ""}
      <p>Best,<br>The LuxOffset team</p>
    </div>`
  };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")   return res.status(405).send("Method Not Allowed");

  try {
    const { name = "", email = "", who = "", need = "", message = "", locale = "en" } = req.body || {};
    if (!name || !/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ ok:false, error:"bad_request" });

    const isMarket = String(who).toLowerCase() === "marketplace" || String(need).startsWith("sample:");

    const adminSubject = isMarket
      ? `📝 New marketplace enquiry — ${name} <${email}>`
      : `📩 New contact — ${name} <${email}>`;

    const adminHtml = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
      <h2>${isMarket ? "Marketplace enquiry" : "Contact form"}</h2>
      <ul>
        <li><b>Name:</b> ${esc(name)}</li>
        <li><b>Email:</b> ${esc(email)}</li>
        ${who  ? `<li><b>Who:</b> ${esc(who)}</li>` : ""}
        ${need ? `<li><b>Need:</b> ${esc(need)}</li>` : ""}
      </ul>
      ${message ? `<p><b>Message:</b><br>${esc(message).replace(/\n/g,"<br>")}</p>` : ""}
    </div>`;

    const ack = ackCopy(locale, isMarket, { name, need, message });

    await Promise.allSettled([
      resend.emails.send({ from: FROM, to: ADMIN, replyTo: email, subject: adminSubject, html: adminHtml }),
      resend.emails.send({ from: FROM, to: email, subject: ack.subject, html: ack.html })
    ]);

    return res.status(200).json({ ok:true });
  } catch (err) {
    console.error("api/contact error:", err);
    return res.status(500).json({ ok:false, error:"server_error" });
  }
}
