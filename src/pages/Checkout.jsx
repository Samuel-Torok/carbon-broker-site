import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { useCart } from "../lib/cart";
import { Check } from "lucide-react";
import { startCheckout } from "../lib/payments";


export default function Checkout() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const locale = lang === "fr" ? "fr-FR" : "en-US";

 

  const { items, total, clear } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const pay = async () => {
    if (confirmed || items.length === 0) return;
    try {
      await startCheckout(items); // redirects to Stripe
    } catch (e) {
      console.error(e);
      alert("Could not start payment. Please try again.");
    }
  };



  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">{t("checkout.title")}</h1>
        <p className="mt-4 text-white/80">
          {t("checkout.body")} {items.length ? `Total: €${total.toLocaleString(locale)}` : ""}
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/cart-review")}
            className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            {t("checkout.backToCart")}
          </button>

          <button
            onClick={pay}
            disabled={confirmed || items.length === 0}
            className={`rounded-lg px-4 py-2 font-medium ${
              confirmed || items.length === 0
                ? "bg-emerald-500/60 text-emerald-950 cursor-default"
                : "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            }`}
          >
            {t("checkout.confirm")}
          </button>
        </div>

        {/* Receipt */}
        {confirmed && receipt && (
          <div className="mt-8 rounded-2xl ring-1 ring-emerald-400 bg-emerald-500/10 p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 grid place-items-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500 grid place-items-center shadow-lg ring-1 ring-emerald-300/60">
                  <Check className="h-9 w-9 text-emerald-950" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white">{t("checkout.thanksTitle")}</h2>
              <p className="mt-1 text-white/80">{t("checkout.placed")}</p>
            </div>

            <div className="mt-6 space-y-3">
              {receipt.items.map((it, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-sm font-medium text-white/70">{t("cart.itemTitle", { index: i + 1 })}</div>
                  <div className="mt-1 text-white/90">{it.size} tCO₂e • {it.qualityLabel}</div>
                  <div className="text-white/70">
                    {t("cart.csrLine", { plan: it.csr.title, price: it.csr.price.toLocaleString(locale) })}
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                    <div className="text-sm text-white/60">{t("cart.subtotal")}</div>
                    <div className="text-base font-semibold text-white">€{it.total.toLocaleString(locale)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <div className="text-sm text-white/60">{t("cart.grandTotal")}</div>
              <div className="text-lg font-semibold text-white">€{receipt.total.toLocaleString(locale)}</div>
            </div>
          </div>
        )}
      </div>
    </PagePanel>
  );
}
