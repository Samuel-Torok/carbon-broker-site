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


// Build valid Stripe line_items (EUR, integer cents)
function buildLineItems(raw = []) {
  return raw.flatMap((it, idx) => {
    const qty = Math.max(1, Math.round(Number(it.size ?? it.quantity ?? 1)));
    const type = normType(it.type);
    const quality = normQual(it.quality);
    const key = `${type}/${quality}`;
    const unit = PRICE[key];
    if (!unit) throw new Error(`Unknown pricing key: ${key}`);

    const main = {
      quantity: qty,
      price_data: {
        currency: "eur",
        unit_amount: unit, // cents from PRICE
        product_data: {
          name: `${type} offset (${quality})`,
          metadata: { type, quality },
        },
      },
    };

    const extras = [];
    if (it.csr?.title) {
      const csrKey = String(it.csr.title).toLowerCase();
      if (CSR[csrKey] != null) {
        extras.push({
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: CSR[csrKey],
            product_data: {
              name: `CSR plan: ${csrKey}`,
              metadata: { kind: "csr", key: csrKey },
            },
          },
        });
      }
    }

    return [main, ...extras];
  });
}



// ---- dev health
app.get("/health", (_, res) => res.json({ ok: true }));

// ---- simple in-memory store of items by session id (dev)
const pending = new Map();

// ---- price book (ALL in cents)
const PRICE = {
  "individual/std": 900,
  "individual/high": 1200,
  "company/std": 1000,
  "company/high": 1400,
};
const CSR = { starter: 39000, plus: 99000, pro: 249000 };

// ---- helpers (single definitions)
function normType(t) {
  const s = String(t || "").toLowerCase();
  return s.startsWith("comp") ? "company" : "individual";
}
function normQual(q) {
  const s = String(q || "").toLowerCase();
  if (["std", "standard", "basic", "regular", "default"].includes(s)) return "std";
  if (["high", "premium", "plus", "pro", "gold"].includes(s)) return "high";
  return "std";
}
function keyFor(type, quality) {
  return `${normType(type)}/${normQual(quality)}`;
}
function computeTotalCents(items) {
  let total = 0;
  for (const it of items) {
    const k = keyFor(it.type, it.quality);
    const unit = PRICE[k];
    if (!unit) throw new Error(`Unknown pricing key: ${k}`);
    const qty = Math.max(1, Math.round(Number(it.size || 1)));
    if (!Number.isFinite(qty)) throw new Error("Bad quantity");
    total += unit * qty;

    if (it.csr?.title) {
      const key = String(it.csr.title).toLowerCase();
      if (CSR[key] != null) total += CSR[key];
    }
  }
  return total;
}

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items = [], customer_email } = req.body;
    const line_items = buildLineItems(items);

    const ref = randomUUID().slice(0, 12);
    pending.set(ref, items); // temp snapshot in memory

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items,
      customer_email: customer_email || undefined,
      client_reference_id: ref,
      return_url: `${process.env.CLIENT_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe error:", err?.raw?.message || err.message);
    res.status(400).json({ error: err?.raw?.message || err.message });
  }
});






// ---- verify endpoint (used by CheckoutSuccess)
// GET /api/verify?session_id=cs_test_...
app.get("/api/verify", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: "missing session_id" });

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    const paid = session.status === "complete" && session.payment_status === "paid";

    // recover snapshot saved at session creation
    const ref = session.client_reference_id || "";
    const items = pending.get(ref) || [];

    if (paid) {
      await persistOrder(session, items); // <-- write JSON only on successful payment
      if (ref) pending.delete(ref);       // cleanup memory
    }

    return res.json({ paid, items });
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

