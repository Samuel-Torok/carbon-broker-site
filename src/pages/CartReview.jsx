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
  const [detailsItem, setDetailsItem] = useState(null);
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
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate("/get-started")}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-emerald-950 hover:bg-emerald-400"
            >
              {t("cart.continueShopping")}
            </button>
          </div>


        </div>
      </PagePanel>
    );
  }

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">{t("cart.title")}</h1>

        <div className="mt-6 space-y-4">
          {items.map((it, i) => {
            const kind = it?.meta?.mode || (it?.meta?.type === "company" ? "company" : (it?.kind || "self"));

            return (
              <div
                key={it.id ?? i}
                onClick={() => setDetailsItem(it)}
                className="relative cursor-pointer rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 hover:bg-white/7.5"
              >

                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(it.id); }}
                  className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 hover:bg-white/15"
                  title={t("cart.remove")}
                  aria-label={t("cart.remove")}
                >
                  <Trash2 className="h-4 w-4 text-white/80" />
                </button>

                {/* Title */}
                <div className="text-sm font-semibold text-white/80">
                  {t(`cart.type.${kind}`)}
                </div>

                {/* Core line */}
                <div className="mt-0.5 text-white/90">
                  {(it.size ?? it.meta?.qty ?? "—")} {t("common.tCO2e","tCO₂e")} • {(it.qualityLabel ?? it.meta?.quality ?? "—")}
                </div>

                {/* Company-only CSR line */}
                {kind === "company" && it.csr && (
                  <div className="mt-1 text-white/70">
                    {t("cart.csrLine", { plan: it.csr.title, price: (it.csr.price ?? 0).toLocaleString(locale) })}
                  </div>
                )}

                {/* Gift-only add-ons */}
                {kind === "gift" && it.meta?.addons && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {it.meta.addons.giftCard && (
                      <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs ring-1 ring-white/15">
                        {t("cart.giftLine.card", { price: (it.meta.addons.giftCardPrice ?? 10).toLocaleString(locale) })}
                      </span>
                    )}
                    {it.meta.addons.eCert && (
                      <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs ring-1 ring-white/15">
                        {t("cart.giftLine.eCert")}
                      </span>
                    )}
                    {it.meta.addons.includePhoto && (
                      <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs ring-1 ring-white/15">
                        {t("cart.giftLine.photo")}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="text-sm text-white/60">{t("cart.subtotal")}</div>
                  <div className="text-base font-semibold text-white">€{(it.total ?? 0).toLocaleString(locale)}</div>
                </div>
              </div>
            );
          })}

        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/get-started")}
              className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              {t("cart.continueShopping")}
            </button>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400"
          >
            {t("cart.checkout")}
          </button>
        </div>




        {infoOpen && <InfoModal type={infoType} onClose={()=>setInfoOpen(false)} />}
      </div>
      {detailsItem && (() => {
        const it = detailsItem;
        const kind = it?.meta?.mode || (it?.meta?.type === "company" ? "company" : (it?.kind || "self"));
        return (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
            <div className="w-[min(720px,92vw)] rounded-2xl bg-white p-6 text-emerald-950 shadow-2xl">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{t(`cart.type.${kind}`)}</h3>
                <button onClick={() => setDetailsItem(null)} className="text-emerald-700 hover:text-emerald-900">×</button>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div><b>{t("cart.details.qty")}:</b> {(it.size ?? it.meta?.qty ?? "—")} {t("common.tCO2e","tCO₂e")}</div>
                <div><b>{t("cart.details.quality")}:</b> {it.qualityLabel ?? it.meta?.quality ?? "—"}</div>

                {/* Buyer / recipient */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><b>{t("cart.details.buyer")}:</b> {it.meta?.meName || "—"} ({it.meta?.meEmail || "—"})</div>
                  {kind === "gift" && (
                    <div><b>{t("cart.details.recipient")}:</b> {it.meta?.recName || "—"} ({it.meta?.recEmail || "—"})</div>
                  )}
                </div>

                {/* Company CSR */}
                {kind === "company" && it.csr && (
                  <div><b>{t("cart.details.csr")}:</b> {t("cart.csrLine", { plan: it.csr.title, price: (it.csr.price ?? 0).toLocaleString(lang === "fr" ? "fr-FR" : "en-US") })}</div>
                )}

                {/* Gift add-ons */}
                {kind === "gift" && it.meta?.addons && (
                  <div>
                    <b>{t("cart.details.addons")}:</b>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {it.meta.addons.giftCard && <span className="inline-flex items-center rounded-md bg-emerald-600/10 px-2 py-1 text-xs ring-1 ring-emerald-600/30">
                        {t("cart.giftLine.card", { price: (it.meta.addons.giftCardPrice ?? 10).toLocaleString(lang === "fr" ? "fr-FR" : "en-US") })}
                      </span>}
                      {it.meta.addons.eCert && <span className="inline-flex items-center rounded-md bg-emerald-600/10 px-2 py-1 text-xs ring-1 ring-emerald-600/30">
                        {t("cart.giftLine.eCert")}
                      </span>}
                      {it.meta.addons.includePhoto && <span className="inline-flex items-center rounded-md bg-emerald-600/10 px-2 py-1 text-xs ring-1 ring-emerald-600/30">
                        {t("cart.giftLine.photo")}
                      </span>}
                      {!it.meta.addons.giftCard && !it.meta.addons.eCert && !it.meta.addons.includePhoto && <span>{t("cart.details.none")}</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-600/10 px-4 py-3 ring-1 ring-emerald-600/25">
                <div className="text-sm">{t("cart.subtotal")}</div>
                <div className="text-base font-semibold">€{(it.total ?? 0).toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}</div>
              </div>
            </div>
          </div>
        );
      })()}

    </PagePanel>
  );
}
