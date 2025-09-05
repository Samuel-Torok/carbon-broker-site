import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

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
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Empty cart" });
    }
    let amount;
    try {
      amount = computeTotalCents(items);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: { currency: "eur", product_data: { name: "Carbon offset purchase" }, unit_amount: amount },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart-review`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
    });

    pending.set(session.id, { items });
    res.json({ id: session.id, url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
});

// ---- verify endpoint (used by CheckoutSuccess)
app.get("/api/verify", async (req, res) => {
  try {
    const sessionId = String(req.query.session_id || "");
    if (!sessionId) return res.status(400).json({ error: "Missing session_id" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const cached = pending.get(sessionId);
    if (paid && cached) {
      res.json({ paid: true, items: cached.items });
      pending.delete(sessionId);
    } else {
      res.json({ paid: false });
    }
  } catch {
    res.status(500).json({ error: "Verify failed" });
  }
});

// ---- webhook (optional now)
app.post("/api/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  (_req, res) => res.sendStatus(200)
);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`API on :${PORT}`));
