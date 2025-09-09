// server/contactRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { Resend } from "resend";

const router = express.Router();

router.use(express.json());                  // parse JSON for all methods under this router
router.options("/contact", (_, res) => res.sendStatus(204)); // preflight
// keep your router.post("/contact", ...) as it is

// --- email setup ---
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "you@example.com";
const FROM_EMAIL  = process.env.CONTACT_FROM || "LuxOffset <notifications@resend.dev>";

// --- best-effort local persistence (not persistent on Vercel) ---
const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR    = path.join(__dirname, "data");
const CONTACTS_FN = path.join(DATA_DIR, "contacts.ndjson");
const MARKET_FN   = path.join(DATA_DIR, "market-enquiries.ndjson");

async function appendNdjson(file, obj) {
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true });
    await fsp.appendFile(file, JSON.stringify(obj) + "\n", "utf8");
  } catch (e) {
    console.warn("appendNdjson:", e.message);
  }
}
const esc = s =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function ackCopy(locale, isMarket, ctx) {
  const fr = String(locale || "").toLowerCase().startsWith("fr");
  if (fr) {
    return {
      subject: isMarket
        ? "Merci — Nous avons bien reçu votre demande"
        : "Merci — Message bien reçu",
      html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
        <p>Bonjour ${esc(ctx.name) || ""},</p>
        <p>${
          isMarket
            ? "Merci pour votre demande. Nous revenons très vite avec la disponibilité et un devis."
            : "Merci pour votre message. Nous vous répondrons au plus vite."
        }</p>
        ${
          isMarket
            ? `<p><b>Récapitulatif :</b></p>
               <pre style="background:#f6f6f9;padding:12px;border-radius:8px;white-space:pre-wrap">${esc((ctx.need ? `need: ${ctx.need}\n` : "") + (ctx.message || ""))}</pre>`
            : ""
        }
        <p>Cordialement,<br>L’équipe LuxOffset</p>
      </div>`
    };
  }
  return {
    subject: isMarket
      ? "Thanks — we received your enquiry"
      : "Thanks — we received your message",
    html: `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
      <p>Hi ${esc(ctx.name) || ""},</p>
      <p>${
        isMarket
          ? "Thanks for your enquiry. We’ll get back to you shortly with availability and pricing."
          : "Thanks for reaching out. We’ll get back to you as soon as possible."
      }</p>
      ${
        isMarket
          ? `<p><b>Summary you sent:</b></p>
             <pre style="background:#f6f6f9;padding:12px;border-radius:8px;white-space:pre-wrap">${esc((ctx.need ? `need: ${ctx.need}\n` : "") + (ctx.message || ""))}</pre>`
          : ""
      }
      <p>Best,<br>The LuxOffset team</p>
    </div>`
  };
}

// --- route ---
router.post("/contact", express.json(), async (req, res) => {
  try {
    const { name = "", email = "", who = "", need = "", message = "", locale = "en" } = req.body || {};
    if (!name || !email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ ok: false, error: "bad_request" });
    }

    const isMarket =
      String(who).toLowerCase() === "marketplace" || String(need).startsWith("sample:");

    const payload = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      source: isMarket ? "marketplace" : "site",
      name,
      email,
      who,
      need,
      message,
      locale,
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
      ua: req.headers["user-agent"] || ""
    };

    await appendNdjson(isMarket ? MARKET_FN : CONTACTS_FN, payload);

    // admin email
    const adminSubject = isMarket
      ? `📝 New marketplace enquiry — ${name} <${email}>`
      : `📩 New contact — ${name} <${email}>`;
    const adminHtml = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
        <h2>${isMarket ? "Marketplace enquiry" : "Contact form"}</h2>
        <ul>
          <li><b>Name:</b> ${esc(name)}</li>
          <li><b>Email:</b> ${esc(email)}</li>
          ${who ? `<li><b>Who:</b> ${esc(who)}</li>` : ""}
          ${need ? `<li><b>Need:</b> ${esc(need)}</li>` : ""}
        </ul>
        ${message ? `<p><b>Message:</b><br>${esc(message).replace(/\n/g, "<br>")}</p>` : ""}
        <p style="color:#667">IP: ${esc(payload.ip)} · UA: ${esc(payload.ua)}</p>
      </div>`;

    // user ack
    const ack = ackCopy(locale, isMarket, { name, need, message });

    await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: adminSubject,
        html: adminHtml
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: ack.subject,
        html: ack.html
      })
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

export default router;
