// src/components/MeetingRequestModal.jsx
import { useState } from "react";
import { useI18n } from "../i18n";

export default function MeetingRequestModal({ open, onClose, defaultCompany = "" }) {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(defaultCompany);
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("either"); // "video" | "in-person" | "either"
  const [platform, setPlatform] = useState("Teams");
  const [slots, setSlots] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);

  if (!open) return null;

  const setSlot = (i, v) => setSlots(s => s.map((x, idx) => idx === i ? v : x));
  const addSlot = () => setSlots(s => s.length >= 3 ? s : [...s, ""]);
  const removeSlot = (i) => setSlots(s => s.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!name || !/\S+@\S+\.\S+/.test(email)) return;
    setSubmitting(true);
    try {
      const payload = {
        who: "meeting",
        locale: lang,
        name, email,
        company, phone,
        mode, platform: mode === "video" ? platform : "",
        slots: slots.filter(Boolean).slice(0,3),
        need: "meeting-request",
        message,
      };
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOk(r.ok);
      if (r.ok) {
        setTimeout(() => onClose?.(), 1200);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 ring-1 ring-white/10 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{t("meet.title","Request a meeting")}</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-white/70 hover:bg-white/10">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-white/70">
              <div className="mb-1">{t("meet.name","Your name")}</div>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:ring-emerald-400/60 focus:outline-none" />
            </label>
            <label className="text-sm text-white/70">
              <div className="mb-1">{t("meet.email","Email")}</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:ring-emerald-400/60 focus:outline-none" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-white/70">
              <div className="mb-1">{t("meet.company","Company")}</div>
              <input value={company} onChange={e=>setCompany(e.target.value)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none" />
            </label>
            <label className="text-sm text-white/70">
              <div className="mb-1">{t("meet.phone","Phone (optional)")}</div>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none" />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-white/80">
            <label className="flex items-center gap-2">
              <input type="radio" name="mode" value="video" checked={mode==="video"} onChange={()=>setMode("video")} />
              {t("meet.video","Video")}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="mode" value="in-person" checked={mode==="in-person"} onChange={()=>setMode("in-person")} />
              {t("meet.inPerson","In person")}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="mode" value="either" checked={mode==="either"} onChange={()=>setMode("either")} />
              {t("meet.either","Either")}
            </label>
          </div>

          {mode === "video" && (
            <label className="text-sm text-white/70">
              <div className="mb-1">{t("meet.platform","Preferred platform")}</div>
              <select value={platform} onChange={e=>setPlatform(e.target.value)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none">
                <option>Teams</option>
                <option>Zoom</option>
                <option>Google Meet</option>
                <option>Other</option>
              </select>
            </label>
          )}

          <div className="text-sm text-white/70">
            <div className="mb-1">{t("meet.slots","Propose up to 3 dates & times (optional)")}</div>
            <div className="space-y-2">
              {slots.map((s,i)=>(
                <div key={i} className="flex items-center gap-2">
                  <input type="datetime-local" value={s} onChange={e=>setSlot(i,e.target.value)} className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none" />
                  <button onClick={()=>removeSlot(i)} className="rounded-lg bg-white/10 px-2 py-2 text-white/70 hover:bg-white/15">−</button>
                </div>
              ))}
              {slots.length < 3 && (
                <button onClick={addSlot} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15">
                  + {t("meet.addSlot","Add another slot")}
                </button>
              )}
            </div>
          </div>

          <label className="text-sm text-white/70">
            <div className="mb-1">{t("meet.msg","Message (optional)")}</div>
            <textarea rows={3} value={message} onChange={e=>setMessage(e.target.value)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none" />
          </label>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-xl bg-white/5 px-4 py-2 text-white ring-1 ring-white/10 hover:bg-white/10">{t("meet.cancel","Cancel")}</button>
            <button disabled={submitting || !name || !/\S+@\S+\.\S+/.test(email)} onClick={submit} className="rounded-xl bg-emerald-500 px-5 py-2 font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-60">
              {submitting ? t("meet.sending","Sending…") : t("meet.send","Send request")}
            </button>
          </div>

          {ok && <div className="text-emerald-300 text-sm">{t("meet.ok","Thanks — we’ve received your request!")}</div>}
        </div>
      </div>
    </div>
  );
}
