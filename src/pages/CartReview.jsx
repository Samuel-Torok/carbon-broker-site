import { Link, useNavigate, useLocation } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { useCart } from "../lib/cart";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import InfoModal from "../components/InfoModal.jsx";

export default function CartReview() {
  const { t, lang } = useI18n();
  const { search } = useLocation();
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoType, setInfoType] = useState("self");
  useEffect(() => {
    const p = new URLSearchParams(search);
    const mode = p.get("info");
    if (mode) { setInfoType(mode); setInfoOpen(true); }
  }, [search]);

  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const navigate = useNavigate();
  const { items, removeItem, total } = useCart();

  if (!items || items.length === 0) {
    return (
      <PagePanel maxWidth="max-w-3xl">
        <div className="mx-auto w-full py-10 text-white/90">
          <p>{t("cart.empty")}</p>
          <Link to="/companies" className="mt-4 inline-block rounded-lg bg-emerald-500 px-4 py-2 text-emerald-950">
            {t("cart.continue")}
          </Link>
        </div>
      </PagePanel>
    );
  }

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">{t("cart.title")}</h1>

        <div className="mt-6 space-y-4">
          {items.map((it, i) => (
            <div key={it.id ?? i} className="relative rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <button
                onClick={() => removeItem(it.id)}
                className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 hover:bg-white/15"
                title={t("cart.remove")}
                aria-label={t("cart.remove")}
              >
                <Trash2 className="h-4 w-4 text-white/80" />
              </button>

              <div className="text-sm font-medium text-white/70">{t("cart.itemTitle", { index: i + 1 })}</div>
              <div className="mt-1 text-white/90">
                {(it.size ?? it.meta?.qty ?? "—")} tCO₂e • {(it.qualityLabel ?? it.meta?.quality ?? "—")}
              </div>
              {it.csr && (
                <div className="mt-1 text-white/70">
                  {t("cart.csrLine", { plan: it.csr.title, price: (it.csr.price ?? 0).toLocaleString(locale) })}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="text-sm text-white/60">{t("cart.subtotal")}</div>
                <div className="text-base font-semibold text-white">€{(it.total ?? 0).toLocaleString(locale)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <div className="text-sm text-white/60">{t("cart.grandTotal")}</div>
          <div className="text-lg font-semibold text-white">€{(total ?? 0).toLocaleString(locale)}</div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400"
          >
            {t("cart.checkout")}
          </button>
          <Link
            to="/companies"
            className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            {t("cart.continue")}
          </Link>
        </div>

        {infoOpen && <InfoModal type={infoType} onClose={()=>setInfoOpen(false)} />}
      </div>
    </PagePanel>
  );
}
