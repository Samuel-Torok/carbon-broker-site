import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OpenAI from "openai";
import { randomUUID } from "crypto";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./contactRoutes.js";
import PRICING, { normalizeQuality, eurToCents } from "../shared/pricing.js";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORDERS_DIR = path.join(__dirname, "data", "orders");



const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost"] }));

app.use((req, _res, next) => { console.log(req.method, req.url); next(); });


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


async function persistOrder(session, items) {
  // build order record – keep it flexible
  const record = {
    id: session.id,
    client_reference_id: session.client_reference_id || null,
    status: session.status,
    payment_status: session.payment_status,
    currency: session.currency,
    amount_total: session.amount_total,
    customer_email: session.customer_details?.email || session.customer_email || null,
    created_at: new Date().toISOString(),
    items,                      // <-- your full cart snapshot (company/individual meta etc.)
  };

  // ensure dir structure: data/orders/YYYY/MM/DD/
  const d = new Date();
  const y = String(d.getUTCFullYear());
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const dir = path.join(ORDERS_DIR, y, m, day);
  await fsp.mkdir(dir, { recursive: true });

  const file = path.join(dir, `${session.id}.json`);

  // idempotent write – skip if already saved
  try { await fsp.access(file); return; } catch {}

  await fsp.writeFile(file, JSON.stringify(record, null, 2), "utf8");
  // also append to rolling NDJSON (optional)
  await fsp.appendFile(path.join(ORDERS_DIR, "orders.ndjson"), JSON.stringify(record) + "\n", "utf8");
}


// ---- single source of truth for Stripe line_items
function buildLineItems(cartItems = []) {
  const items = [];

  for (const it of cartItems) {
    const isCompany = (it?.meta?.type === "company");
    const audience  = isCompany ? "companies" : "individuals";

    const qKey = normalizeQuality(it.qualityKey || it.meta?.quality || it.quality);
    const perTonne = PRICING[audience].perTonne[qKey] ?? PRICING[audience].perTonne.standard;
    const qty = Math.max(
      PRICING.qtyLimits.min,
      Math.min(PRICING.qtyLimits.max, Number(it.size || it.meta?.qty || 1))
    );

    // main offset line
    items.push({
      price_data: {
        currency: PRICING.currency,
        product_data: { name: `${isCompany ? "Company" : "Individual"} offset (${qKey})` },
        unit_amount: eurToCents(perTonne),
      },
      quantity: qty,
    });

    // CSR add-on (company)
    if (isCompany && it.csr?.id && it.csr.id !== "none") {
      const csrPrice = PRICING.companies.csr[it.csr.id] ?? 0;
      if (csrPrice > 0) {
        items.push({
          price_data: {
            currency: PRICING.currency,
            product_data: { name: `CSR add-on: ${it.csr.id}` },
            unit_amount: eurToCents(csrPrice),
          },
          quantity: 1,
        });
      }
    }

    // Gift add-on (individual)
    if (!isCompany && it?.meta?.addons?.giftCard) {
      items.push({
        price_data: {
          currency: PRICING.currency,
          product_data: { name: "Gift card (physical)" },
          unit_amount: eurToCents(PRICING.individuals.addons.giftCard),
        },
        quantity: 1,
      });
    }
  }
  return items;
}



// ---- dev health
app.get("/health", (_, res) => res.json({ ok: true }));

// ---- simple in-memory store of items by session id (dev)
const pending = new Map();



app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const cartItems = Array.isArray(req.body?.items) ? req.body.items : [];
    const lineItems = buildLineItems(cartItems);

    // stash cart snapshot and pass ref to Stripe
    const ref = randomUUID();
    pending.set(ref, cartItems);

    // optional: debug to verify € values
    console.log(
      "LINE_ITEMS_DEBUG",
      lineItems.map(li => ({
        name: li.price_data.product_data.name,
        unit_amount: li.price_data.unit_amount,
        qty: li.quantity,
      }))
    );


    const base = req.body.return_url || "http://localhost:5173/checkout/return";
    const returnUrl = /\bsession_id=/.test(base)
      ? base
      : `${base}${base.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: lineItems,
      customer_email: req.body.customer_email,
      client_reference_id: ref,
      return_url: returnUrl, // ensures Stripe appends ?session_id=...
    });


    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    res.status(400).json({ error: err.message || "Unable to create session" });
  }
});






// ---- verify endpoint (used by CheckoutSuccess)
// GET /api/verify?session_id=cs_test_...
app.get("/api/verify", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: "missing session_id" });

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "line_items.data.price.product"],
    });

    const paid = session.status === "complete" && session.payment_status === "paid";

    console.log("VERIFY_DEBUG", {
      id: session.id,
      status: session.status,                // "open" | "complete" | "expired"
      payment_status: session.payment_status // "paid" | "unpaid" | "no_payment_required"
    });

    const ref = session.client_reference_id || "";
    const items = pending.get(ref) || [];

    if (paid) {
      await persistOrder(session, items);   // writes JSON & ndjson
      console.log("ORDER_SAVED", {
        id: session.id,
        items: items.length,
        amount_total: session.amount_total
      });
      if (ref) pending.delete(ref);         // cleanup memory
    }

    // return more fields so UI can decide
    return res.json({
      paid,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      items,
    });
  } catch (err) {
    console.error("verify error:", err);
    res.status(400).json({ error: err.message });
  }
});




app.get("/api/checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ["line_items.data.price.product"],
    });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err?.message || "Failed to retrieve session" });
  }
});




// ---- webhook (optional now)
app.post("/api/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  (_req, res) => res.sendStatus(200)
);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`API on :${PORT}`));


app.options("/api/chat", (req, res) => { for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v); res.status(204).end(); });

app.post("/api/chat", async (req, res) => {
  for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v);
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const userMessages = Array.isArray(body.messages) ? body.messages : [];
    const locale = String(body.locale || "en").toLowerCase();
    const language = locale.startsWith("fr") ? "French" : "English";

    const r = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system",
          content: `You are Zephyr Carbon's concise, accurate website assistant. Always reply in ${language} unless the user asks otherwise. Keep answers short and factual.` },
        ...userMessages,
      ],
    });

    res.json({ text: r.choices?.[0]?.message?.content || "" });
  } catch (e) {
    console.error("chat error:", e);
    res.status(500).json({ error: e.message });
  }
});


app.use("/api", contactRoutes);


