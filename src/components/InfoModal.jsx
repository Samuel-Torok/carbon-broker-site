import { useEffect, useState } from "react";
import { useI18n } from "../i18n";

export default function InfoModal({ type = "self", onClose, onSave }) {
  const { t } = useI18n();
  const isGift = type === "gift";
  const isCompany = type === "company";

  const [meName, setMeName] = useState("");
  const [meEmail, setMeEmail] = useState("");

  const [recName, setRecName] = useState("");
  const [recEmail, setRecEmail] = useState("");
  const [message, setMessage] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyVat, setCompanyVat] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [meRole, setMeRole] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const canSave = () => {
    if (!meName || !meEmail) return false;
    if (isCompany && !companyName) return false;
    if (isGift && (!recName || !recEmail)) return false;
    return true;
  };

  const save = () => {
    const payload = {
      type,
      meName, meEmail,
      ...(isGift ? { recName, recEmail, message } : {}),
      ...(isCompany ? {
        companyName, companyVat, companyWebsite, companyCountry, companyAddress, meRole, leaderboardOptIn
      } : {})
    };
    try { sessionStorage.setItem("checkoutInfo", JSON.stringify(payload)); } catch {}
    onSave?.(payload);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 ring-1 ring-white/15 p-6">
        <h3 className="text-xl font-semibold mb-1">
          {isCompany ? t("companyModal.title") : isGift ? t("giftModal.title") : t("selfModal.title")}
        </h3>
        <p className="text-sm text-white/70 mb-5">
          {isCompany ? t("companyModal.desc") : isGift ? t("giftModal.desc") : t("selfModal.desc")}
        </p>

        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder={t("companyModal.yourName")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                   value={meName} onChange={e=>setMeName(e.target.value)} />
            <input placeholder={t("companyModal.yourEmail")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                   value={meEmail} onChange={e=>setMeEmail(e.target.value)} />
            {isCompany && (
              <input placeholder={t("companyModal.yourRole")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                     value={meRole} onChange={e=>setMeRole(e.target.value)} />
            )}
          </div>

          {isCompany && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder={t("companyModal.companyName")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                       value={companyName} onChange={e=>setCompanyName(e.target.value)} />
                <input placeholder={t("companyModal.vat")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                       value={companyVat} onChange={e=>setCompanyVat(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input placeholder={t("companyModal.website")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                       value={companyWebsite} onChange={e=>setCompanyWebsite(e.target.value)} />
                <input placeholder={t("companyModal.country")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                       value={companyCountry} onChange={e=>setCompanyCountry(e.target.value)} />
                <input placeholder={t("companyModal.address")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                       value={companyAddress} onChange={e=>setCompanyAddress(e.target.value)} />
              </div>
              <label className="mt-1 inline-flex items-center gap-2 text-sm text-white/80">
                <input type="checkbox" className="h-4 w-4 rounded bg-white/5"
                       checked={leaderboardOptIn} onChange={e=>setLeaderboardOptIn(e.target.checked)} />
                {t("companyModal.leaderboardOptIn")}
              </label>
            </>
          )}

          {isGift && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder={t("giftModal.recipientName")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                     value={recName} onChange={e=>setRecName(e.target.value)} />
              <input placeholder={t("giftModal.recipientEmail")} className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
                     value={recEmail} onChange={e=>setRecEmail(e.target.value)} />
            </div>
          )}

          {!isCompany && (
            <textarea placeholder={t("selfModal.message")}
                      className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2 min-h-[90px]"
                      value={message} onChange={e=>setMessage(e.target.value)} />
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">{t("common.close","Close")}</button>
          <button disabled={!canSave()} onClick={save}
                  className={`rounded-lg px-3 py-2 font-medium ${canSave() ? "bg-emerald-500 hover:bg-emerald-400 text-emerald-950" : "bg-white/10 text-white/40 cursor-not-allowed"}`}>
            {t("common.save","Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
