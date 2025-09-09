import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { useCart } from "../lib/cart";
import { startCheckout, destroyEmbeddedCheckout } from "../lib/payments";

function deriveBuyer(items = []) {
  const first = items.find(i => i?.meta) || {};
  const m = first.meta || {};
  return {
    kind: m.type || (m.companyName ? "company" : "individual"),
    companyName: m.companyName || m.company || "",
    contactName: m.contactName || m.name || m.fullName || "",
    contactEmail: m.contactEmail || m.email || "",
    phone: m.phone || "",
    address: m.address || m.street || "",
    city: m.city || "",
    country: m.country || "",
    vat: m.vat || m.vatNumber || "",
    notes: m.notes || "",
  };
}


export default function Checkout() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const { items, total } = useCart();
  const [mounting, setMounting] = useState(false);
  const embeddedRef = useRef(null);

  const pay = async () => {
    if (mounting || items.length === 0) return;
    try {
      const buyer = deriveBuyer(items);               // <<— NEW
      embeddedRef.current = await startCheckout(items, "#stripe-checkout", buyer); // <<— changed
    } catch (e) {
      console.error(e);
      alert(e.message || "Could not start payment. Please try again.");
      setMounting(false);
    }
  };

  // destroy embedded when leaving this page (prevents the "multiple objects" error)
  useEffect(() => () => destroyEmbeddedCheckout(), []);

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">{t("checkout.title")}</h1>
        <p className="mt-4 text-white/80">
          {t("checkout.body")} {items.length ? `Total: €${total.toLocaleString(locale)}` : ""}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => { destroyEmbeddedCheckout(); navigate("/cart-review"); }}
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

        <div id="stripe-checkout" className="mt-8 min-h-[640px] rounded-2xl bg-white/5 ring-1 ring-white/10" />
      </div>
    </PagePanel>
  );
}
