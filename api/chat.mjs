import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v);
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v);
    return res.status(405).end();
  }

  try {
    for (const [k,v] of Object.entries(CORS)) res.setHeader(k,v);

    const raw = req.body;
    const body = typeof raw === "string" ? JSON.parse(raw) : (raw || {});
    const userMessages = Array.isArray(body.messages) ? body.messages : [];
    const locale = String(body.locale || "en").toLowerCase();
    const language = locale.startsWith("fr") ? "French" : "English";

    const r = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            `You are Zephyr Carbon's concise, accurate website assistant. ` +
            `Always reply in ${language} unless the user explicitly asks otherwise. ` +
            `Keep answers short and factual.`
        },
        ...userMessages,
      ],
    });

    return res.status(200).json({ text: r.choices?.[0]?.message?.content || "" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
