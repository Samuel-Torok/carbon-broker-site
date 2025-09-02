import { useEffect, useState } from "react";

export default function InfoModal({ type, onClose }) {
  const isGift = type === "gift";
  const [meName, setMeName] = useState("");
  const [meEmail, setMeEmail] = useState("");
  const [recName, setRecName] = useState("");
  const [recEmail, setRecEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const save = () => {
    const payload = { type, meName, meEmail, recName: isGift ? recName : undefined, recEmail: isGift ? recEmail : undefined, message };
    sessionStorage.setItem("checkoutInfo", JSON.stringify(payload));
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 ring-1 ring-white/15 p-5">
        <h3 className="text-lg font-semibold mb-1">{isGift ? "Gift details" : "Your details"}</h3>
        <p className="text-sm text-white/70 mb-4">
          {isGift
            ? "We’ll retire the credits to the recipient’s name and send the certificate."
            : "We retire credits to your name and email for your records."}
        </p>

        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Your name" className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                   value={meName} onChange={e=>setMeName(e.target.value)} />
            <input placeholder="Your email" className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                   value={meEmail} onChange={e=>setMeEmail(e.target.value)} />
          </div>

          {isGift && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Recipient name" className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                     value={recName} onChange={e=>setRecName(e.target.value)} />
              <input placeholder="Recipient email" className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                     value={recEmail} onChange={e=>setRecEmail(e.target.value)} />
            </div>
          )}

          <textarea placeholder="Personal message (optional)"
                    className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2 min-h-[90px]"
                    value={message} onChange={e=>setMessage(e.target.value)} />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">Close</button>
          <button onClick={save} className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3 py-2 font-medium">Save</button>
        </div>
      </div>
    </div>
  );
}
