import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { useCart } from "../lib/cart";

const PRICE_PER_TON = { standard: 12, premium: 16, elite: 22 };

export default function Companies() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t, lang } = useI18n();
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const [size, setSize] = useState(100);
  const [quality, setQuality] = useState("standard");

  // CSR options translated
  const CSR_OPTIONS = [
    { id: "none", title: t("companies.csr.none"), desc: t("companies.csr.noneDesc"), price: 0 },
    { id: "starter", title: t("order.addons.items.starter.title"), desc: t("order.addons.items.starter.desc"), price: 390 },
    { id: "plus", title: t("order.addons.items.plus.title"), desc: t("order.addons.items.plus.desc"), price: 990 },
    { id: "pro", title: t("order.addons.items.pro.title"), desc: t("order.addons.items.pro.desc"), price: 2490 },
  ];
  const [csr, setCsr] = useState(CSR_OPTIONS[0]);

  const basePrice = useMemo(() => size * (PRICE_PER_TON[quality] ?? 12), [size, quality]);
  const total = basePrice + csr.price;

  const qualityOptions = [
    { key: "standard", label: t("packages.qualities.standard") },
    { key: "premium", label: t("packages.qualities.premium") },
    { key: "elite", label: t("packages.qualities.elite") },
  ];

  return (
    <PagePanel maxWidth="max-w-5xl">
      <div className="mx-auto w-full pb-24">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-emerald-400">{t("companies.title")}</h1>

        {/* Hero */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
            <img src="/images/corporate.jpg" alt={t("companies.imageCaption")} className="h-64 w-full object-cover" />
            <div className="px-4 pb-3 pt-1 text-xs text-white/60">{t("companies.imageCaption")}</div>
          </div>

          <ul className="space-y-3 text-white/80 leading-relaxed">
            <li className="flex gap-3"><Check className="mt-1 h-5 w-5 text-emerald-400" />{t("companies.benefits.list1")}</li>
            <li className="flex gap-3"><Check className="mt-1 h-5 w-5 text-emerald-400" />{t("companies.benefits.list2")}</li>
            <li className="flex gap-3"><Check className="mt-1 h-5 w-5 text-emerald-400" />{t("companies.benefits.list3")}</li>
          </ul>
        </div>

        {/* Configure package */}
        <div className="mt-10 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <h3 className="mb-4 text-white/90 font-semibold">{t("packages.configure")}</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="col-span-1 text-sm text-white/70">
              <div className="mb-2">{t("packages.sizeLabel")}</div>
              <input
                type="number" min={1} step={1} value={size}
                onChange={(e) => setSize(Math.max(1, Number(e.target.value || 1)))}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>

            <label className="col-span-1 md:col-span-2 text-sm text-white/70">
              <div className="mb-2">{t("packages.qualityLabel")}</div>
              <div className="relative">
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full appearance-none rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                >
                  {qualityOptions.map((q) => (
                    <option key={q.key} value={q.key}>{q.label}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </div>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <div className="text-sm text-white/60">{t("packages.estimatedTotal")}</div>
            <div className="text-lg font-semibold text-white">€{basePrice.toLocaleString(locale)}</div>
          </div>

          <div className="mt-2 text-xs text-white/50">{t("packages.disclaimer")}</div>
        </div>

        {/* CSR add-ons */}
        <div className="mt-8">
          <h3 className="mb-3 text-white/90 font-semibold">{t("order.addons.title")}</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {CSR_OPTIONS.map((opt) => {
              const active = csr.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setCsr(opt)}
                  className={`text-left rounded-2xl p-4 ring-1 transition ${active ? "bg-emerald-500/10 ring-emerald-400" : "bg-white/5 ring-white/10 hover:bg-white/7"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{opt.title}</div>
                    <div className="text-white/80">€{opt.price.toLocaleString(locale)}</div>
                  </div>
                  <div className="mt-2 text-sm text-white/70">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <div className="text-sm text-white/60">{t("packages.estimatedTotal")}</div>
            <div className="text-lg font-semibold text-white">€{total.toLocaleString(locale)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              const qualityLabel = qualityOptions.find(q => q.key === quality)?.label ?? quality;
              addItem({ size, qualityKey: quality, qualityLabel, csr, basePrice, total });
              navigate("/cart-review");
            }}

            className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-medium text-emerald-950 hover:bg-emerald-400"
          >
            {t("packages.proceed")}
          </button>

          <Link to="/contact" className="block w-full rounded-xl bg-white/5 px-6 py-3 text-center font-medium text-white ring-1 ring-white/10 hover:bg-white/10">
            {t("order.buttons.requestMeeting")}
          </Link>
        </div>
      </div>
    </PagePanel>
  );
}
