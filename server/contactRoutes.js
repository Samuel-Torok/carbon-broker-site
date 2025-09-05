// server/contactRoutes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "contacts.jsonl");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

router.post("/contact", express.json(), async (req, res) => {
  const { name, email, who, need, message, locale } = req.body ?? {};
  if (!name || !email) return res.status(400).json({ error: "Missing name/email" });

  const record = {
    id: (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
    ts: new Date().toISOString(),
    name, email, who, need,
    message: message || "",
    locale: locale || "en",
    ip: req.ip,
    ua: req.headers["user-agent"] || "",
  };

  try {
    fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf8");
    if (process.env.SLACK_WEBHOOK_URL) {
      fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New contact: ${record.name} — ${record.email}\nWho: ${who}\nNeed: ${need}\nMsg: ${record.message}`,
        }),
      }).catch(() => {});
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Write failed" });
  }
});

export default router;


// ----- simple auth helper -----
function isAuthed(req) {
  const u = process.env.CONTACT_USER || "admin";
  const p = process.env.CONTACT_PASS || "change-me";
  const expected = "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
  return req.headers.authorization === expected;
}
function requireAuth(res) {
  res.set("WWW-Authenticate", 'Basic realm="contacts"');
}

// ----- list JSON -----
router.get("/contact/list", (req, res) => {
  if (!isAuthed(req)) return requireAuth(res), res.status(401).end();
  const lines = fs.existsSync(FILE)
    ? fs.readFileSync(FILE, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse)
    : [];
  res.json(lines);
});

// ----- export CSV -----
router.get("/contact/export.csv", (req, res) => {
  if (!isAuthed(req)) return requireAuth(res), res.status(401).end();
  const rows = fs.existsSync(FILE)
    ? fs.readFileSync(FILE, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse)
    : [];
  const header = ["ts","name","email","who","need","message","locale"];
  const csv = [header.join(",")]
    .concat(rows.map(r => header.map(k => `"${String(r[k] ?? "").replace(/"/g,'""')}"`).join(",")))
    .join("\n");
  res.type("text/csv").send(csv);
});
