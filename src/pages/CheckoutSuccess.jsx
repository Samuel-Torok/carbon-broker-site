import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { addOptedInCompaniesFromCart, addOptedInIndividualsFromCart } from "../lib/leaderboard";
import PagePanel from "@/components/PagePanel";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n";

export default function CheckoutSuccess() {
  const { clear } = useCart();
  const { search } = useLocation();
  const { lang } = useI18n();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(search);
      const sid = params.get("session_id");
      if (!sid) return;

      const r = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verify?session_id=${encodeURIComponent(sid)}`
      );
      const data = await r.json();

      if (r.ok && data?.paid && Array.isArray(data.items)) {
        addOptedInCompaniesFromCart(data.items);
        addOptedInIndividualsFromCart(data.items);
        try { localStorage.setItem("indiv:resetAfterPurchase", "1"); } catch {}
        clear();
        setOk(true);
      }
    };
    run().catch(console.error);
  }, [search, clear]);

  const copy = lang === "fr"
    ? {
        verifying: "Vérification du paiement…",
        wait: "Veuillez patienter.",
        title: "Paiement validé",
        body:
          "Vos crédits carbone seront retirés prochainement (sous 3 jours ouvrables). " +
          "Votre certificat — ainsi que les éventuelles options supplémentaires — sera envoyé à l’adresse e-mail indiquée.",
        terms: "Consulter les conditions",
      }
    : {
        verifying: "Verifying payment…",
        wait: "Please wait.",
        title: "Payment successful",
        body:
          "Your carbon credits will be retired shortly (within the next 3 business days). " +
          "Your certificate — and any selected add-ons — will be sent to the email you provided.",
        terms: "View terms",
      };

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto max-w-lg text-center space-y-5 pt-2">
        {ok ? (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 grid place-items-center">
              <ShieldCheck className="h-9 w-9 text-emerald-400" aria-hidden />
            </div>
            <h1 className="text-3xl font-semibold text-emerald-400">
              {copy.title}
            </h1>
            <p className="text-white/80 leading-relaxed">{copy.body}</p>

            <div className="pt-2">
              <Link
                className="underline underline-offset-4 hover:text-white"
                to="/terms"
              >
                {copy.terms}
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-emerald-400">
              {copy.verifying}
            </h1>
            <p className="text-white/60" aria-live="polite">{copy.wait}</p>
          </>
        )}
      </div>
    </PagePanel>
  );
}
