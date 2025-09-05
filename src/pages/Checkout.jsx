import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { useCart } from "../lib/cart";
import { createEmbeddedSession, mountEmbeddedCheckout } from "../lib/payments";

export default function Checkout() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const { items, total } = useCart();
  const [mounting, setMounting] = useState(false);

  const pay = async () => {
    if (mounting || items.length === 0) return;
    try {
      setMounting(true);
      const { clientSecret } = await createEmbeddedSession(items);
      await mountEmbeddedCheckout(clientSecret, "#stripe-checkout");
    } catch (e) {
      console.error(e);
      alert("Could not start payment. Please try again.");
      setMounting(false);
    }
  };

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">{t("checkout.title")}</h1>
        <p className="mt-4 text-white/80">
          {t("checkout.body")} {items.length ? `Total: €${total.toLocaleString(locale)}` : ""}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/cart-review")}
            className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            {t("checkout.backToCart")}
          </button>

          <button
            onClick={pay}
            disabled={mounting || items.length === 0}
            className={`rounded-lg px-4 py-2 font-medium ${
              mounting || items.length === 0
                ? "bg-emerald-500/60 text-emerald-950 cursor-default"
                : "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            }`}
          >
            {mounting ? t("checkout.loading") : t("checkout.confirm")}
          </button>
        </div>

        {/* Stripe Embedded Checkout mounts here */}
        <div id="stripe-checkout" className="mt-8 min-h-[640px] rounded-2xl bg-white/5 ring-1 ring-white/10" />
      </div>
    </PagePanel>
  );
}
