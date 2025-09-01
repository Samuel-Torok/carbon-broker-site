import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const body = req.body || {};
    const userMessages = Array.isArray(body.messages) ? body.messages : [];
    const r = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // swap to "gpt-5-mini" later if enabled
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are Zephyr Carbon’s concise, accurate website assistant." },
        ...userMessages
      ],
    });
    res.status(200).json({ text: r.choices?.[0]?.message?.content || "" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
