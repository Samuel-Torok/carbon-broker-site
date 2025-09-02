import { Link, useLocation, useNavigate } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";

export default function CartReview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <PagePanel maxWidth="max-w-3xl">
        <div className="mx-auto w-full py-10 text-white/90">
          <p>Cart is empty.</p>
          <Link to="/companies" className="mt-4 inline-block rounded-lg bg-emerald-500 px-4 py-2 text-emerald-950">
            Configure a package
          </Link>
        </div>
      </PagePanel>
    );
  }

  const { size, quality, csr, basePrice, total } = state;

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">Order review</h1>

        <div className="mt-6 rounded-2xl bg-white/5 overflow-hidden ring-1 ring-white/10">
          <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/70">Order summary</div>
          <div className="px-5 py-4 space-y-2 text-white/85">
            <div className="text-white/80">
              {size} tCO₂e • {quality} – Estimated total €{basePrice.toLocaleString("en-US")}
            </div>
            <div className="text-white/80">CSR add-on: {csr.title} (€{csr.price.toLocaleString("en-US")})</div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
            <div className="text-sm text-white/60">Grand total</div>
            <div className="text-lg font-semibold text-white">€{total.toLocaleString("en-US")}</div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/checkout", { state })}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400"
          >
            Go to checkout
          </button>
          <button
            onClick={() => navigate("/companies", { state })}
            className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Back to edit
          </button>
        </div>
      </div>
    </PagePanel>
  );
}
