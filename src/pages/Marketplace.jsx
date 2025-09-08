import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";
import { useCart } from "../lib/cart";
import { Info, Package2, ShoppingCart, Factory, Leaf, Wind, Flame, Droplets, MapPin } from "lucide-react";
import { MARKET_STOCK, MARKET_SAMPLES } from "../../shared/marketplaceData.js";

/**
 * Marketplace
 * - Tab 1: In-stock items (limited inventory) → short info form → add to cart → go to checkout
 * - Tab 2: Sample projects (not in stock yet) → short enquiry form → POST /api/contact
 *
 * PLACEHOLDERS are provided below; once you have real data you can:
 *   1) Replace STOCK_DEFAULT and SAMPLES_DEFAULT, OR
 *   2) Fetch from your server (e.g., /api/market/list) and set state, keeping the same shape.
 */



function useItemsFromI18nOrDefault(t, key, fallback) {
  const v = t(key);
  return useMemo(() => (Array.isArray(v) ? v : fallback), [v]);
}

export default function Marketplace() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const stockItems  = MARKET_STOCK.filter(i => i.active !== false);
  const sampleItems = MARKET_SAMPLES.filter(i => i.active !== false);

  const ICONS = { flame: Flame, leaf: Leaf, wind: Wind, factory: Factory, droplets: Droplets };
  const IconFor = (key) => ICONS[key] || Package2;


  const [tab, setTab] = useState("stock"); // "stock" | "samples"

  // modal state
  const [enquireFor, setEnquireFor] = useState(null); // sample item
  const [buyFor, setBuyFor] = useState(null);         // stock item

  // enquiry (samples)
  const [eqName, setEqName] = useState("");
  const [eqEmail, setEqEmail] = useState("");
  const [eqCompany, setEqCompany] = useState("");
  const [eqQty, setEqQty] = useState(10);
  const [eqMsg, setEqMsg] = useState("");
  const [sendingEnquiry, setSendingEnquiry] = useState(false);
  const validEq = eqName && /\S+@\S+\.\S+/.test(eqEmail);

  // purchase (stock)
  const [pName, setPName] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pNotes, setPNotes] = useState("");
  const [pQty, setPQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const validBuy = pName && /\S+@\S+\.\S+/.test(pEmail) && buyFor && pQty >= (buyFor?.minOrderTonnes ?? 1);
  const totalForBuy = buyFor ? Math.max(0, pQty) * buyFor.priceEur : 0;

  const openBuy = (item) => {
    setBuyFor(item);
    setPQty(Math.max(item.minOrderTonnes || 1, 1));
    setPName("");
    setPEmail("");
    setPNotes("");
  };

  const submitEnquiry = async () => {
    if (!validEq || !enquireFor) return;
    try {
      setSendingEnquiry(true);
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: eqName,
          email: eqEmail,
          who: "marketplace",
          need: `sample:${enquireFor.id}`,
          message:
            `Interested in sample project "${enquireFor.title}"` +
            ` | qty≈${eqQty} tCO₂e` +
            (eqCompany ? ` | company=${eqCompany}` : "") +
            (eqMsg ? ` | note=${eqMsg}` : ""),
          locale: lang,
        }),
      });
      setEnquireFor(null);
      alert(t("market.toast.enquiryOk", "Thanks — we’ll follow up by email."));
    } catch {
      alert(t("market.toast.enquiryErr", "Could not send your enquiry. Please try again."));
    } finally {
      setSendingEnquiry(false);
    }
  };

  const addStockToCartAndCheckout = async () => {
    if (!validBuy || !buyFor) return;
    try {
      setAdding(true);
      const cartItem = {
        // match existing cart/checkout shape (Individuals/Companies)
        size: pQty,
        qualityKey: "market",
        qualityLabel: buyFor.standard,
        csr: { title: t("companies.csr.none") || "No thanks", price: 0 },
        total: totalForBuy,
        meta: {
          type: "market",
          mode: "stock",
          projectId: buyFor.id,
          title: buyFor.title,
          standard: buyFor.standard,
          vintage: buyFor.vintage,
          origin: buyFor.origin,
          pricePerTonne: buyFor.priceEur,
          qty: pQty,
          meName: pName,
          meEmail: pEmail,
          message: pNotes || "",
        },
      };
      addItem(cartItem);
      setBuyFor(null);
      navigate("/checkout");
    } finally {
      setAdding(false);
    }
  };

  return (
    <PagePanel maxWidth="max-w-6xl">
      <main className="py-12 text-slate-100 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold title-gradient">{t("market.title","Marketplace")}</h1>
          <p className="opacity-80">{t("market.subtitle","Browse sample projects or purchase from limited in-stock inventory.")}</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={()=>setTab("stock")}
            className={`rounded-xl px-3 py-1.5 text-sm ring-1 ${tab==="stock" ? "bg-emerald-500 text-emerald-950 ring-emerald-400" : "bg-white/10 text-white/85 ring-white/15 hover:bg-white/15"}`}
          >
            {t("market.tab.stock","In stock")}
          </button>
          <button
            onClick={()=>setTab("samples")}
            className={`rounded-xl px-3 py-1.5 text-sm ring-1 ${tab==="samples" ? "bg-emerald-500 text-emerald-950 ring-emerald-400" : "bg-white/10 text-white/85 ring-white/15 hover:bg-white/15"}`}
          >
            {t("market.tab.samples","Sample projects")}
          </button>
        </div>

        {/* In-stock */}
        {tab === "stock" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t("market.stock.heading","Current availability (limited stock)")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stockItems.map((it) => {
                const Icon = IconFor(it.icon);
                const out = (it.stockTonnes ?? 0) < (it.minOrderTonnes ?? 1);
                return (
                  <article key={it.id} className="rounded-2xl ring-1 ring-white/12 bg-slate-950/80 overflow-hidden backdrop-blur">
                    <div className="relative">
                      {it.image ? (
                        <img src={it.image} alt="" className="w-full h-auto object-cover" style={{ aspectRatio: "4 / 3" }}/>
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-emerald-500/40 to-indigo-500/40" />
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge variant="outline">{it.standard}</Badge>
                        <Badge className="bg-white/10">{it.vintage}</Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-white/85">
                        <Icon className="h-4 w-4" />
                        <h3 className="font-semibold">{it.title}</h3>
                      </div>
                      <div className="text-sm opacity-85">{it.type}</div>
                      <div className="text-xs opacity-75 inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5"/>{it.origin}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xl font-bold">€{it.priceEur}<span className="text-sm opacity-70">/tCO₂e</span></div>
                        <div className="text-xs opacity-75">
                          {t("market.stock.left","Left")}: <b>{it.stockTonnes}</b> t • {t("market.stock.min","Min")} {it.minOrderTonnes} t
                        </div>
                      </div>

                      <div className="mt-3">
                        <Button
                          disabled={out}
                          onClick={() => openBuy(it)}
                          className={`w-full justify-center ${out ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-gradient-to-r from-emerald-400 to-indigo-400 text-white border-0 hover:brightness-110"}`}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {out ? t("market.stock.soldOut","Sold out") : t("market.buyNow","Buy now")}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="text-xs opacity-70">{t("market.placeholderNote","These are placeholder items for testing. Real inventory will appear here soon.")}</p>
          </section>
        )}

        {/* Samples */}
        {tab === "samples" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t("market.samples.heading","Explore sample projects")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sampleItems.map((it) => {
                const Icon = it.icon ?? Package2;
                return (
                  <article key={it.id} className="rounded-2xl ring-1 ring-white/12 bg-slate-950/80 overflow-hidden backdrop-blur">
                    <div className="relative">
                      {it.image ? (
                        <img src={it.image} alt="" className="w-full h-auto object-cover" style={{ aspectRatio: "4 / 3" }}/>
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-emerald-500/40 to-indigo-500/40" />
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge variant="outline">{it.standard}</Badge>
                        {it.indicative && <Badge className="bg-white/10">{it.indicative}</Badge>}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-white/85">
                        <Icon className="h-4 w-4" />
                        <h3 className="font-semibold">{it.title}</h3>
                      </div>
                      <div className="text-sm opacity-85">{it.type}</div>
                      <div className="text-xs opacity-75 inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5"/>{it.origin}
                      </div>

                      <div className="mt-3">
                        <Button
                          onClick={() => setEnquireFor(it)}
                          className="w-full justify-center bg-white/10 hover:bg-white/15 text-white ring-1 ring-white/15"
                        >
                          {t("market.enquire","Enquire")}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="text-xs opacity-70">{t("market.placeholderNote","These are placeholder items for testing. Real inventory will appear here soon.")}</p>
          </section>
        )}

        {/* Enquiry modal (samples) */}
        {enquireFor && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
            <div className="w-[min(640px,90vw)] rounded-2xl bg-white p-5 text-emerald-950 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{t("market.forms.enquiryTitle","Tell us a bit about you")}</h4>
                <div className="text-sm text-emerald-800/80 mt-1">
                    {t("market.forms.enquirySub","We’ll get back to you with availability and pricing for")} “{enquireFor.title}”.
                  </div>
                </div>
                <button onClick={()=>setEnquireFor(null)} className="text-emerald-700 hover:text-emerald-900">×</button>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder={t("market.forms.name","Your name")} value={eqName} onChange={e=>setEqName(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                  <input placeholder={t("market.forms.email","Your email")} value={eqEmail} onChange={e=>setEqEmail(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                </div>
                <input placeholder={t("market.forms.company","Company (optional)")} value={eqCompany} onChange={e=>setEqCompany(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <label className="text-sm text-emerald-900/90">{t("market.forms.qty","Approx. quantity (tCO₂e)")}</label>
                  <input type="number" min={1} max={100000} value={eqQty} onChange={e=>setEqQty(Number(e.target.value||"0"))} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                </div>
                <textarea placeholder={t("market.forms.notes","Notes (optional)")} value={eqMsg} onChange={e=>setEqMsg(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2 min-h-[84px]"/>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setEnquireFor(null)} className="rounded-lg px-3 py-1.5 ring-1 ring-emerald-700/30">
                  {t("market.forms.cancel","Cancel")}
                </button>
                <button
                  onClick={submitEnquiry}
                  disabled={!validEq || sendingEnquiry}
                  className={`rounded-lg px-3 py-1.5 ${(!validEq || sendingEnquiry) ? "bg-emerald-500/60 text-emerald-950 cursor-default" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
                >
                  {sendingEnquiry ? t("market.forms.sending","Sending…") : t("market.forms.send","Send enquiry")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buy modal (in-stock) */}
        {buyFor && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
            <div className="w-[min(640px,90vw)] rounded-2xl bg-white p-5 text-emerald-950 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{t("market.forms.buyTitle","Quick details to proceed")}</h4>
                  <div className="text-sm text-emerald-800/80 mt-1">
                    “{buyFor.title}” — €{buyFor.priceEur}/tCO₂e
                  </div>
                </div>
                <button onClick={()=>setBuyFor(null)} className="text-emerald-700 hover:text-emerald-900">×</button>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder={t("market.forms.name","Your name")} value={pName} onChange={e=>setPName(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                  <input placeholder={t("market.forms.email","Your email")} value={pEmail} onChange={e=>setPEmail(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <label className="text-sm text-emerald-900/90">
                    {t("market.forms.qtyExact","Quantity (tCO₂e)")}
                    <span className="ml-1 text-xs text-emerald-900/70">({t("market.stock.min","Min")} {buyFor.minOrderTonnes} t, {t("market.stock.left","Left")}: {buyFor.stockTonnes} t)</span>
                  </label>
                  <input type="number" min={buyFor.minOrderTonnes} max={buyFor.stockTonnes} value={pQty} onChange={e=>setPQty(Math.max(buyFor.minOrderTonnes, Math.min(buyFor.stockTonnes, Number(e.target.value||"0"))))} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2"/>
                </div>

                <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2 flex items-center justify-between">
                  <span className="text-sm text-emerald-900/90">{t("market.forms.subtotal","Subtotal")}</span>
                  <span className="font-semibold">€{totalForBuy.toLocaleString()}</span>
                </div>

                <textarea placeholder={t("market.forms.notes","Notes (optional)")} value={pNotes} onChange={e=>setPNotes(e.target.value)} className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 px-3 py-2 min-h-[84px]"/>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setBuyFor(null)} className="rounded-lg px-3 py-1.5 ring-1 ring-emerald-700/30">
                  {t("market.forms.cancel","Cancel")}
                </button>
                <button
                  onClick={addStockToCartAndCheckout}
                  disabled={!validBuy || adding}
                  className={`rounded-lg px-3 py-1.5 ${(!validBuy || adding) ? "bg-emerald-500/60 text-emerald-950 cursor-default" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
                >
                  {adding ? t("market.forms.processing","Processing…") : t("market.forms.checkout","Go to checkout")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs opacity-70 flex items-center gap-2">
          <Info className="h-3.5 w-3.5" />
          {t("market.disclaimer","Marketplace prices can be indicative; availability can change rapidly. We’ll confirm exact pricing/stock by email.")}
        </div>
      </main>
    </PagePanel>
  );
}
