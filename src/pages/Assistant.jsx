import { useState, useRef, useEffect } from "react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Assistant() {
  const i18n = useI18n();
  const { t } = i18n;
  const locale = i18n?.lang || i18n?.locale || "en";
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const [messages, setMessages] = useState([
    { role: "assistant", content: t("assistant.greeting") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  // If the user switches language, refresh the greeting for a clean start
  useEffect(() => {
    setMessages([{ role: "assistant", content: t("assistant.greeting") }]);
  }, [locale]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    try {
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, locale })
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setMessages(m => [...m, { role: "assistant", content: data.text || "…" }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: t("assistant.error") }]);
      console.error(e);
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
              <div className="text-sm opacity-70 mb-1">{m.role==="user"?t("assistant.you"):t("assistant.assistant")}</div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && send()}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            placeholder={t("assistant.placeholder")}
            aria-label={t("assistant.placeholder")}
          />
          <button onClick={send} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500/80">
            {loading ? "…" : t("assistant.send")}
          </button>
        </div>

        <p className="text-xs opacity-60 pt-2">
          {t("assistant.disclaimer")} {t("assistant.powered")}
        </p>
      </main>
    </PagePanel>
  );
}
