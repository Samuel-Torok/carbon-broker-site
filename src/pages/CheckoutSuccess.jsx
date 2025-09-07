import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { addOptedInCompaniesFromCart, addOptedInIndividualsFromCart } from "../lib/leaderboard";
import PagePanel from "@/components/PagePanel";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n";

export default function CheckoutSuccess() {
  const { clear } = useCart();
  const { lang } = useI18n();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [st, setSt] = useState({
    loading: true,
    paid: false,
    status: "",
    payment_status: "",
    error: "",
  });

  const API =
    (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, "")) ||
    "http://localhost:4242";

  useEffect(() => {
    if (!sessionId) {
      setSt(s => ({ ...s, loading: false, error: "missing session_id" }));
      return;
    }

    let timer;
    let tries = 0;

    async function verify() {
      try {
        const r = await fetch(`${API}/api/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Verify failed");

        // When paid, persist leaderboard + clear cart
        if (data.paid && Array.isArray(data.items)) {
          addOptedInCompaniesFromCart(data.items);
          addOptedInIndividualsFromCart(data.items);
          try { localStorage.setItem("indiv:resetAfterPurchase", "1"); } catch {}
          clear();
        }

        setSt({
          loading: false,
          paid: !!data.paid,
          status: data.status || "",
          payment_status: data.payment_status || "",
          error: "",
        });

        // If not paid and not completed yet, poll a few more times
        if (!data.paid && data.status !== "complete" && tries++ < 20) {
          timer = setTimeout(verify, 1500);
        }
      } catch (e) {
        setSt(s => ({ ...s, loading: false, error: e.message || "Verify error" }));
      }
    }

    verify();
    return () => clearTimeout(timer);
  }, [sessionId, API, clear]);

  const copy = lang === "fr"
    ? {
        verifying: "Vérification du paiement…",
        wait: "Veuillez patienter.",
        title: "Paiement validé",
        body:
          "Vos crédits carbone seront retirés prochainement (sous 3 jours ouvrables). " +
          "Votre certificat — ainsi que les éventuelles options supplémentaires — sera envoyé à l’adresse e-mail indiquée.",
        processingTitle: "Paiement en cours de traitement",
        processingBody: "Votre commande est complète et le moyen de paiement la traite encore.",
        notDoneTitle: "Paiement non effectué",
        notDoneBody: "Il semble que le paiement n’ait pas été finalisé.",
        terms: "Consulter les conditions",
        backHome: "Retour à l’accueil",
        backCart: "Retour au panier",
      }
    : {
        verifying: "Verifying payment…",
        wait: "Please wait.",
        title: "Payment successful",
        body:
          "Your carbon credits will be retired shortly (within the next 3 business days). " +
          "Your certificate — and any selected add-ons — will be sent to the email you provided.",
        processingTitle: "Payment processing",
        processingBody: "Your order is complete and your payment method is still processing.",
        notDoneTitle: "Payment not completed",
        notDoneBody: "It looks like the payment wasn’t finished.",
        terms: "View terms",
        backHome: "Back home",
        backCart: "Back to cart",
      };

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto max-w-lg text-center space-y-5 pt-2">
        {/* Loading */}
        {st.loading && (
          <>
            <h1 className="text-2xl font-semibold text-emerald-400">{copy.verifying}</h1>
            <p className="text-white/60" aria-live="polite">{copy.wait}</p>
          </>
        )}

        {/* Error */}
        {!st.loading && st.error && (
          <>
            <h1 className="text-2xl font-semibold text-red-300">Error</h1>
            <p className="text-white/70">{st.error}</p>
            <Link className="underline underline-offset-4 hover:text-white" to="/cart-review">
              {copy.backCart}
            </Link>
          </>
        )}

        {/* Success */}
        {!st.loading && !st.error && st.paid && (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 grid place-items-center">
              <ShieldCheck className="h-9 w-9 text-emerald-400" aria-hidden />
            </div>
            <h1 className="text-3xl font-semibold text-emerald-400">{copy.title}</h1>
            <p className="text-white/80 leading-relaxed">{copy.body}</p>
            <div className="pt-2 space-x-4">
              <Link className="underline underline-offset-4 hover:text-white" to="/terms">{copy.terms}</Link>
              <Link className="underline underline-offset-4 hover:text-white" to="/">{copy.backHome}</Link>
            </div>
          </>
        )}

        {/* Completed but not paid yet (e.g. bank/wallet still processing) */}
        {!st.loading && !st.error && !st.paid && st.status === "complete" && (
          <>
            <h1 className="text-2xl font-semibold text-amber-300">{copy.processingTitle}</h1>
            <p className="text-white/80 leading-relaxed">{copy.processingBody}</p>
            <p className="text-white/60 text-sm">
              Status: {st.status} / {st.payment_status || "processing"}
            </p>
            <Link className="underline underline-offset-4 hover:text-white" to="/">
              {copy.backHome}
            </Link>
          </>
        )}

        {/* Still open/unpaid */}
        {!st.loading && !st.error && !st.paid && st.status !== "complete" && (
          <>
            <h1 className="text-2xl font-semibold text-white/80">{copy.notDoneTitle}</h1>
            <p className="text-white/70">{copy.notDoneBody}</p>
            <Link className="underline underline-offset-4 hover:text-white" to="/cart-review">
              {copy.backCart}
            </Link>
          </>
        )}
      </div>
    </PagePanel>
  );
}
