import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import PagePanel from "../components/PagePanel.jsx";

const CSR_OPTIONS = [
  { id: "none", title: "No thanks", desc: "Proceed without CSR marketing support.", price: 0 },
  { id: "starter", title: "Starter", desc: "Claims review + copy for website & 3 social posts, basic visuals.", price: 390 },
  { id: "plus", title: "Plus", desc: "Starter + 1-page case study and image pack.", price: 990 },
  { id: "pro", title: "Pro", desc: "Plus + short video script & campaign guidance.", price: 2490 },
];

const PRICE_PER_TON = { Standard: 12 };

export default function Companies() {
  const navigate = useNavigate();
  const [size, setSize] = useState(100);
  const [quality] = useState("Standard");
  const [csr, setCsr] = useState(CSR_OPTIONS[0]);

  const basePrice = useMemo(() => size * PRICE_PER_TON[quality], [size, quality]);
  const total = basePrice + csr.price;

  return (
    <PagePanel maxWidth="max-w-5xl">
      <div className="mx-auto w-full pb-24">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-emerald-400">For companies (SME)</h1>

        {/* Hero */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
            {/* Prefer a local image to avoid hotlink issues */}
            <img
              src="/images/corporate.jpg"
              alt="Illustrative corporate setting"
              className="h-64 w-full object-cover"
            />
            <div className="px-4 pb-3 pt-1 text-xs text-white/60">Illustrative corporate setting.</div>
          </div>

          <ul className="space-y-3 text-white/80 leading-relaxed">
            <li className="flex gap-3">
              <Check className="mt-1 h-5 w-5 text-emerald-400" />
              Address residual Scope 1–3 emissions (after your own reductions).
            </li>
            <li className="flex gap-3">
              <Check className="mt-1 h-5 w-5 text-emerald-400" />
              Support independently verified climate projects with transparent retirements.
            </li>
            <li className="flex gap-3">
              <Check className="mt-1 h-5 w-5 text-emerald-400" />
              Strengthen CSR, procurement and stakeholder communications with evidence.
            </li>
          </ul>
        </div>

        {/* Configure package */}
        <div className="mt-10 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h3 className="mb-4 text-white/90 font-semibold">Configure your package</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="col-span-1 text-sm text-white/70">
              <div className="mb-2">Size (tCO₂e)</div>
              <input
                type="number"
                min={1}
                step={1}
                value={size}
                onChange={(e) => setSize(Math.max(1, Number(e.target.value || 1)))}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>

            <label className="col-span-1 md:col-span-2 text-sm text-white/70">
              <div className="mb-2 flex items-center gap-2">
                Quality <Lock className="h-4 w-4 text-white/40" />
              </div>
              <select
                disabled
                value={quality}
                className="w-full cursor-not-allowed rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15"
              >
                <option>Standard</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <div className="text-sm text-white/60">Price preview</div>
            <div className="text-lg font-semibold text-white">€{basePrice.toLocaleString("en-US")}</div>
          </div>

          <div className="mt-2 text-xs text-white/50">
            Final pricing depends on project, vintage and availability. We’ll confirm by email.
          </div>
        </div>

        {/* CSR add-ons */}
        <div className="mt-8">
          <h3 className="mb-3 text-white/90 font-semibold">Add-ons (CSR marketing)</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {CSR_OPTIONS.map((opt) => {
              const active = csr.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setCsr(opt)}
                  className={`text-left rounded-2xl p-4 ring-1 transition ${
                    active ? "bg-emerald-500/10 ring-emerald-400" : "bg-white/5 ring-white/10 hover:bg-white/7"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{opt.title}</div>
                    <div className="text-white/80">€{opt.price.toLocaleString("en-US")}</div>
                  </div>
                  <div className="mt-2 text-sm text-white/70">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <div className="text-sm text-white/60">Price preview</div>
            <div className="text-lg font-semibold text-white">€{total.toLocaleString("en-US")}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() =>
              navigate("/cart-review", {
                state: { size, quality, csr, basePrice, total },
              })
            }
            className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-medium text-emerald-950 hover:bg-emerald-400"
          >
            Proceed
          </button>

          <Link
            to="/contact"
            className="block w-full rounded-xl bg-white/5 px-6 py-3 text-center font-medium text-white ring-1 ring-white/10 hover:bg-white/10"
          >
            Ask for a meeting in person
          </Link>
        </div>
      </div>
    </PagePanel>
  );
}
