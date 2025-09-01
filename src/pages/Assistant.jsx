import { useState, useRef } from "react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Assistant() {
  const { t } = useI18n();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me about projects, pricing, or certificates." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter(m=>m.role!=="system") })
      });
      const data = await r.json();
      setMessages(m => [...m, { role: "assistant", content: data.text || "…" }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Error contacting AI. Try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 0);
    }
  }

  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-4 leading-7">
        <h1 className="text-3xl font-bold title-gradient">{t("assistant.title")}</h1>
        <p className="opacity-80">{t("assistant.subtitle")}</p>

        <div ref={boxRef} className="rounded-2xl ring-1 ring-white/10 bg-white/5 p-4 h-[60vh] overflow-auto space-y-3">
          {messages.map((m,i)=>(
            <div key={i} className={`p-3 rounded-xl max-w-[85%] ${m.role==="user"?"ml-auto bg-emerald-500/10":"bg-white/5"}`}>
              <div className="text-sm opacity-70 mb-1">{m.role==="user"?"You":"Assistant"}</div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && send()}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            placeholder="Type your question…"
          />
          <button onClick={send} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500/80">
            {loading ? "…" : "Send"}
          </button>
        </div>
      </main>
    </PagePanel>
  );
}
