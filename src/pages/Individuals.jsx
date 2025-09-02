import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Gift, Leaf, Info, Sliders } from "lucide-react";
import PagePanel from "../components/PagePanel.jsx";
import { useCart } from "../lib/cart";
import { useI18n } from "../i18n";



/* ---- pricing + choices ---- */
const QUALITY_OPTIONS = [
  { id: "standard", label: "Standard", pricePerTonne: 12 },
  { id: "premium", label: "Premium", pricePerTonne: 20 },
];
const AMOUNTS = [1, 2, 5, 10, 25, 50, 100];

/* ---- quick equivalences (indicative only) ---- */
function Equivalence({ tco2 }) {
  const shortHaulPerFlight = 0.15; // tCO2e / one-way (very rough)
  const longHaulRt = 1.6;          // tCO2e / round trip (very rough)
  const carPer1kKm = 0.2;          // tCO2e per ~1000 km (very rough)

  const flightsShort = Math.max(1, Math.round(tco2 / shortHaulPerFlight));
  const flightsLongRt = Math.max(1, Math.round(tco2 / longHaulRt));
  const carKm = Math.round((tco2 / carPer1kKm) * 1000);

  return (
    <div className="mt-2 text-xs text-white/70">
      ≈ {flightsShort} short-haul flights · ≈ {flightsLongRt} long-haul round trips · ≈ {carKm.toLocaleString()} km by car (est.)
    </div>
  );
}

/* ---- “For myself” card ---- */
function SelfBlock({ onAdd, t }) {
  const [qty, setQty] = useState(10);
  const [quality, setQuality] = useState(QUALITY_OPTIONS[0]);
  const [customProjects, setCustomProjects] = useState(false);
  const total = useMemo(() => qty * quality.pricePerTonne, [qty, quality]);

  return (
    <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 p-5 md:p-6 backdrop-blur">
      <div className="flex items-center gap-2 text-emerald-400 mb-2">
        <Leaf className="h-5 w-5"/><h3 className="font-semibold text-lg">{t("indiv.self.title","Offset for myself")}</h3>
      </div>
      <p className="text-sm text-white/80">
        {t("indiv.self.lede","Pick how much and the quality you prefer. If you don’t want to choose projects yourself, we’ll build the most convenient, high-quality mix for you.")}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs text-white/70">{t("indiv.amount","Amount (tCO₂e)")}</label>
          <select value={qty} onChange={(e)=>setQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2">
            {AMOUNTS.map(a => <option key={a} value={a}>{a} tCO₂e</option>)}
          </select>
          <Equivalence tco2={qty} />
        </div>

        <div>
          <label className="text-xs text-white/70">{t("indiv.quality","Quality tier")}</label>
          <select value={quality.id}
                  onChange={(e)=>setQuality(QUALITY_OPTIONS.find(q=>q.id===e.target.value))}
                  className="mt-1 w-full rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2">
            {QUALITY_OPTIONS.map(q => (
              <option key={q.id} value={q.id}>
                {q.label} — €{q.pricePerTonne}/t
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-white/60 flex items-center gap-1">
            <Info className="h-3.5 w-3.5"/>{t("indiv.qualityNote","Premium reflects scarcer, often newer projects.")}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/70">{t("indiv.projects","Project selection")}</label>
          <div className="mt-1 flex items-center gap-2">
            <input id="self-custom" type="checkbox" checked={customProjects} onChange={()=>setCustomProjects(v=>!v)}
                   className="h-4 w-4 rounded border-white/20 bg-white/5"/>
            <label htmlFor="self-custom" className="text-sm">
              {t("indiv.chooseProjects","I want to choose the projects myself")}
            </label>
          </div>
          <div className="mt-1 text-xs text-amber-300/80">
            {t("indiv.priceNote","Note: prices may be higher when you choose projects yourself.")}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-white/80">Subtotal: <span className="font-semibold">€{total.toLocaleString()}</span></div>
        <button
          onClick={()=>onAdd({ mode:"self", qty, quality:quality.id, customProjects })}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2 font-medium transition"
        >
          {customProjects ? t("indiv.toMarketplace","Choose projects in marketplace") : t("indiv.addCart","Add to cart")}
          <ArrowRight className="h-4 w-4"/>
        </button>
      </div>
    </div>
  );
}

/* ---- Gift card ---- */
function GiftBlock({ onAdd, t }) {
  const [qty, setQty] = useState(5);
  const [quality, setQuality] = useState(QUALITY_OPTIONS[0]);
  const [customProjects, setCustomProjects] = useState(false);
  const [giftCard, setGiftCard] = useState(false);
  const [eCert, setECert] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(true);

  const addOnTotal = (giftCard?10:0) + (eCert?0:0) + (includePhoto?0:0);
  const total = useMemo(() => qty * quality.pricePerTonne + addOnTotal, [qty, quality, giftCard, eCert, includePhoto]);

  return (
    <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 p-5 md:p-6 backdrop-blur">
      <div className="flex items-center gap-2 text-emerald-400 mb-2">
        <Gift className="h-5 w-5"/><h3 className="font-semibold text-lg">{t("indiv.gift.title","Gift a carbon offset")}</h3>
      </div>
      <p className="text-sm text-white/80">
        {t("indiv.gift.lede","Perfect for someone who truly cares about the planet. If you offset for yourself, credits are retired to you immediately (not transferable). For gifts, we retire them in the recipient’s name and send a beautiful certificate.")}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-xs text-white/70">{t("indiv.amount","Amount (tCO₂e)")}</label>
          <select value={qty} onChange={(e)=>setQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2">
            {AMOUNTS.map(a => <option key={a} value={a}>{a} tCO₂e</option>)}
          </select>
          <Equivalence tco2={qty} />
        </div>

        <div>
          <label className="text-xs text-white/70">{t("indiv.quality","Quality tier")}</label>
          <select value={quality.id}
                  onChange={(e)=>setQuality(QUALITY_OPTIONS.find(q=>q.id===e.target.value))}
                  className="mt-1 w-full rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2">
            {QUALITY_OPTIONS.map(q => (
              <option key={q.id} value={q.id}>
                {q.label} — €{q.pricePerTonne}/t
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-white/70">{t("indiv.projects","Project selection")}</label>
          <div className="mt-1 flex items-center gap-2">
            <input id="gift-custom" type="checkbox" checked={customProjects} onChange={()=>setCustomProjects(v=>!v)}
                   className="h-4 w-4 rounded border-white/20 bg-white/5"/>
            <label htmlFor="gift-custom" className="text-sm">
              {t("indiv.chooseProjects","I want to choose the projects myself")}
            </label>
          </div>
          <div className="mt-1 text-xs text-amber-300/80">
            {t("indiv.priceNote","Note: prices may be higher when you choose projects yourself.")}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
          <div className="flex items-center gap-2">
            <input id="addon-card" type="checkbox" checked={giftCard} onChange={()=>setGiftCard(v=>!v)}/>
            <label htmlFor="addon-card" className="text-sm font-medium">Gift card (physical) +€10</label>
          </div>
          <p className="mt-1 text-xs text-white/70">Elegant card with a unique retirement code.</p>
        </div>
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
          <div className="flex items-center gap-2">
            <input id="addon-ecert" type="checkbox" checked={eCert} onChange={()=>setECert(v=>!v)}/>
            <label htmlFor="addon-ecert" className="text-sm font-medium">Electronic certificate</label>
          </div>
          <p className="mt-1 text-xs text-white/70">PDF with recipient’s name and message.</p>
        </div>
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
          <div className="flex items-center gap-2">
            <input id="addon-photo" type="checkbox" checked={includePhoto} onChange={()=>setIncludePhoto(v=>!v)}/>
            <label htmlFor="addon-photo" className="text-sm font-medium">Add a personal photo</label>
          </div>
          <p className="mt-1 text-xs text-white/70">We’ll place it on the certificate.</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-white/80">Subtotal: <span className="font-semibold">€{total.toLocaleString()}</span></div>
        <button
          onClick={()=>onAdd({
            mode:"gift",
            qty,
            quality:quality.id,
            customProjects,
            addons:{ giftCard, eCert, includePhoto }
          })}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2 font-medium transition"
        >
          {customProjects ? t("indiv.toMarketplace","Choose projects in marketplace") : t("indiv.addCart","Add to cart")}
          <ArrowRight className="h-4 w-4"/>
        </button>
      </div>
    </div>
  );
}

/* ---- Page ---- */
export default function Individuals() {
  const { t } = useI18n();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAdd = (opts) => {
    if (opts.customProjects) {
      navigate(`/marketplace?from=individuals&type=${opts.mode}`);
      return;
    }
    const unitPrice = QUALITY_OPTIONS.find(q=>q.id===opts.quality)?.pricePerTonne ?? 12;
    const addonsPrice =
      (opts.addons?.giftCard ? 10 : 0) +
      (opts.addons?.eCert ? 0 : 0) +
      (opts.addons?.includePhoto ? 0 : 0);
    const price = opts.qty * unitPrice + addonsPrice;

    const qualityLabel =
      opts.quality === "premium"
        ? (t?.("packages.qualities.premium") || "Premium")
        : (t?.("packages.qualities.standard") || "Standard");

    // IMPORTANT: match CartReview's expected shape
    addItem({
      size: opts.qty,
      qualityLabel,
      csr: { title: (t?.("companies.csr.none") || "No thanks"), price: 0 },
      total: price,
      meta: { type:"individual", mode:opts.mode, qty:opts.qty, quality:opts.quality, addons:opts.addons || {} }
    });

    navigate(`/cart-review?info=${opts.mode}`);
  };

  return (
    <PagePanel
      title={t("indiv.hero.title","Hi there! Ready to reduce your footprint or surprise someone who cares?")}
      subtitle={t("indiv.hero.sub","You’re in the right place — offset for yourself or gift verified carbon in a few clicks.")}
      icon={Sliders}
    >
      <div className="mt-2 mb-6">
        <img
          src="/images/individuals-hero.jpg"
          alt={t("indiv.hero.imageAlt","Beautiful nature scene")}
          className="w-full aspect-[16/9] rounded-2xl object-cover ring-1 ring-white/10"
        />
      </div>



      <div className="grid gap-6">
        <SelfBlock onAdd={handleAdd} t={t}/>
        <GiftBlock onAdd={handleAdd} t={t}/>
      </div>

      <div className="mt-6 text-xs text-white/60">
        {t("indiv.disclaimer","Equivalences are indicative; actual footprints vary by route, vehicle, habits, and other factors.")}
      </div>
    </PagePanel>
  );
}
