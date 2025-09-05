import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OpenAI from "openai";
import contactRoutes from "./contactRoutes.js";
dotenv.config();


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const app = express();
// allow your Vite origin in dev; fallback to open when env missing
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json());

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || "").trim(), {
  apiVersion: "2024-06-20",
});


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

// ---- create checkout session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items = [], customer_email, metadata = {} } = req.body;

    const line_items = items.map((it, idx) => {
      const name = it.title || it.name || `Carbon offset`;
      const qty  = Number(it.quantity ?? it.qty ?? 1);

      // Try many common fields for price per unit (EUR)
      const unitPriceEur = Number(
        it.unitPriceEur ??
        it.unit_price ??
        it.pricePerTonne ??
        it.price_per_tonne ??
        it.price ??
        it.unit_price_eur ??
        0
      );

      let unit_amount; // cents
      let quantity = (Number.isFinite(qty) && qty > 0) ? qty : 1;

      if (Number.isFinite(unitPriceEur) && unitPriceEur > 0) {
        unit_amount = Math.round(unitPriceEur * 100);
      } else if (Number.isFinite(Number(it.total)) && Number(it.total) > 0) {
        // Fallback: charge the item total as a single line
        unit_amount = Math.round(Number(it.total) * 100);
        quantity = 1;
      } else {
        // Last-resort fallback (keep UI and charge consistent if no price sent)
        const perTon = Number(process.env.PRICE_PER_TON_EUR ?? 60);
        const size   = Number(it.size ?? 1);
        unit_amount  = Math.round(perTon * size * 100);
        quantity     = 1;
      }

      if (!Number.isFinite(unit_amount) || unit_amount < 1) {
        throw new Error(`Bad unit_amount for "${name}" (${unitPriceEur || it.total || 0})`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: { name },
          unit_amount,
        },
        quantity,
      };
    });


    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items,
      customer_email,
      metadata: {
        ...metadata,
        cart: metadata.cart || JSON.stringify(items), // snapshot for /verify
      },
      return_url: `${process.env.CLIENT_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    res.status(400).json({ error: err.message });
  }
});


// ---- verify endpoint (used by CheckoutSuccess)
// GET /api/verify?session_id=cs_test_...
app.get("/api/verify", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: "missing session_id" });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.status === "complete" && session.payment_status === "paid";

    let items = [];
    try {
      items = JSON.parse(session.metadata?.cart || "[]"); // snapshot from session creation
    } catch {}

    return res.json({ paid, items });
  } catch (err) {
    console.error("verify error:", err);
    res.status(400).json({ error: err.message });
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



app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost"],
  methods: ["GET", "POST"],
}));


app.use("/api", contactRoutes);
