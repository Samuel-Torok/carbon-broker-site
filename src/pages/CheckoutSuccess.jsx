import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { addOptedInCompaniesFromCart, addOptedInIndividualsFromCart } from "../lib/leaderboard";
import PagePanel from "@/components/PagePanel";

export default function CheckoutSuccess() {
  const { clear } = useCart();
  const { search } = useLocation();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(search);
      const sid = params.get("session_id");
      if (!sid) return;

      // Ask backend if this session is paid and get the server-snapshotted items
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/verify?session_id=${encodeURIComponent(sid)}`);
      const data = await r.json();

      if (r.ok && data?.paid && Array.isArray(data.items)) {
        // Update leaderboard ONLY after verified payment
        addOptedInCompaniesFromCart(data.items);
        addOptedInIndividualsFromCart(data.items);

        try { localStorage.setItem("indiv:resetAfterPurchase", "1"); } catch {}
        clear();
        setOk(true);
      }
    };
    run().catch(console.error);
  }, [search, clear]);

  return (
    <PagePanel maxWidth="max-w-3xl">
       <div className="mx-auto max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold text-emerald-400">
            {ok ? "Payment successful ✅" : "Verifying payment…"}
          </h1>
          {ok ? (
            <>
              <p className="text-white/80">Your offsets will be processed and retired shortly.</p>
              <Link className="underline" to="/buy/individuals">Back to Individuals</Link>
            </>
          ) : (
            <p className="text-white/60">Please wait.</p>
          )}
        </div>
    </PagePanel>
  );
}


