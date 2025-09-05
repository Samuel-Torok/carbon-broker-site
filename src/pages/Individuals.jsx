import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Gift,
  Leaf,
  Info,
  Plane,
  Car,
} from "lucide-react";
import PagePanel from "../components/PagePanel.jsx";
import { useCart } from "../lib/cart";
import { useI18n } from "../i18n";


/* --- quality options (same tiers as Companies) --- */
const QUALITY_OPTIONS = [
  { id: "standard", label: "Standard", pricePerTonne: 12 },
  { id: "premium",  label: "Premium (nature-based, recent)", pricePerTonne: 20 },
  { id: "elite",    label: "Elite (cookstoves/REDD+, newest)", pricePerTonne: 30 },
];

/* fixed package sizes */
const PRESETS = [1, 2, 5, 10, 25, 50, 100];

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
const emailOk = (s) => /^\S+@\S+\.\S+$/.test(s || "");
const DRAFT_KEY = (kind) => `indiv:draft:${kind}`;

function loadDraft(kind) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY(kind));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveDraft(kind, data) {
  try {
    localStorage.setItem(DRAFT_KEY(kind), JSON.stringify(data));
  } catch {}
}


/* visible plane/car chips */
function EquivalenceChips({ tco2 }) {
  const shortHaulPerFlight = 0.15;
  const longHaulRt = 1.6;
  const carPer1kKm = 0.2;

  const flightsShort = Math.max(1, Math.round(tco2 / shortHaulPerFlight));
  const flightsLongRt = Math.max(1, Math.round(tco2 / longHaulRt));
  const carKm = Math.round((tco2 / carPer1kKm) * 1000);

  const Chip = ({ icon: Icon, label }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 px-2.5 py-1 text-xs text-emerald-200">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <Chip icon={Plane} label={`≈ ${flightsShort} short-haul flights`} />
      <Chip icon={Plane} label={`≈ ${flightsLongRt} long-haul round trips`} />
      <Chip icon={Car}   label={`≈ ${carKm.toLocaleString()} km by car`} />
    </div>
  );
}

/* shared selector UI */
function Selector({
  t,
  kind,                // "self" | "gift"
  ringOn,
  onProceed,
  prefill = {},
}) {
  const navigate = useNavigate();
  const draft = useMemo(() => loadDraft(kind), [kind]);


  // quantity UX: one box with presets + "Custom". If "Custom", show number input (with up/down arrows).
  const [qtyChoice, setQtyChoice] = useState(
    draft?.qtyChoice ?? (PRESETS.includes(prefill.qty) ? String(prefill.qty) : "5")
  );
  const [qty, setQty] = useState(
    draft?.qty ?? (prefill.qty ? clamp(prefill.qty, 1, 1000) : 10)
  );

  const [quality, setQuality] = useState(() => {
    const qid = draft?.qualityId ?? prefill.quality;
    return QUALITY_OPTIONS.find((q) => q.id === qid) ?? QUALITY_OPTIONS[0];
  });

  // modal for "choose projects myself"
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [customProjects, setCustomProjects] = useState(
    draft?.customProjects ?? !!prefill.customProjects
  );

  // reveal form after Select
  const [opened, setOpened] = useState(draft?.opened ?? !!prefill.opened);
  const [meName, setMeName]       = useState(draft?.meName   ?? (prefill.meName || ""));
  const [meEmail, setMeEmail]     = useState(draft?.meEmail  ?? (prefill.meEmail || ""));
  const [message, setMessage]     = useState(draft?.message  ?? (prefill.message || ""));
  const [leaderboard, setLeaderboard] = useState(draft?.leaderboard ?? !!prefill.leaderboard);

  // gift-only fields
  const [recName, setRecName]     = useState(draft?.recName  ?? (prefill.recName || ""));
  const [recEmail, setRecEmail]   = useState(draft?.recEmail ?? (prefill.recEmail || ""));

  // optional gift add-ons
  const [giftCard, setGiftCard]   = useState(draft?.giftCard ?? !!prefill.giftCard);
  const [eCert, setECert]         = useState(draft?.eCert ?? (prefill.eCert ?? true));
  const [includePhoto, setIncludePhoto] = useState(draft?.includePhoto ?? !!prefill.includePhoto);

  // After “Proceed”, mark this selector as selected and hide the button
  const [selected, setSelected]   = useState(draft?.selected ?? false);


  const effQty = qtyChoice === "custom" ? qty : Number(qtyChoice);
  const addOnTotal = kind === "gift" ? (giftCard ? 10 : 0) : 0;
  const subtotal = useMemo(
    () => clamp(effQty,1,1000) * quality.pricePerTonne + addOnTotal,
    [effQty, quality, addOnTotal]
  );

  useEffect(() => {
    saveDraft(kind, {
      qtyChoice,
      qty,
      qualityId: quality?.id,
      customProjects,
      opened,
      meName,
      meEmail,
      message,
      leaderboard,
      recName,
      recEmail,
      giftCard,
      eCert,
      includePhoto,
      selected,
    });
  }, [
    kind,
    qtyChoice,
    qty,
    quality?.id,
    customProjects,
    opened,
    meName,
    meEmail,
    message,
    leaderboard,
    recName,
    recEmail,
    giftCard,
    eCert,
    includePhoto,
    selected,
  ]);


  const validBase = effQty >= 1 && effQty <= 1000 && quality?.id;
  const validSelf = validBase && meName && emailOk(meEmail);
  const validGift = validSelf && recName && emailOk(recEmail);
  const isValid = kind === "gift" ? validGift : validSelf;

  const proceed = () => {
    if (!opened || !isValid) return;
    onProceed({
      kind,
      qty: clamp(effQty,1,1000),
      quality: quality.id,
      customProjects,
      meName, meEmail, message, leaderboard,
      ...(kind === "gift" ? { recName, recEmail, addons: { giftCard, eCert, includePhoto } } : {}),
      subtotal
    });
    setSelected(true);
  };

  const onClickChooseProjects = () => setShowProjectsModal(true);
  const visitMarketplace = () => {
    setCustomProjects(true);
    navigate(`/marketplace?from=individuals&type=${kind}`);
  };
  const resetSelector = () => {
    onProceed(null); // also clear parent pick -> ring turns off
    setQtyChoice("5");
    setQty(10);
    setQuality(QUALITY_OPTIONS[0]);
    setCustomProjects(false);
    setOpened(false);
    setMeName("");
    setMeEmail("");
    setMessage("");
    setLeaderboard(false);
    setRecName("");
    setRecEmail("");
    setGiftCard(false);
    setECert(true);
    setIncludePhoto(false);
    setSelected(false);
    try { localStorage.removeItem(DRAFT_KEY(kind)); } catch {}
  };


  return (
    <div className={`rounded-2xl p-5 md:p-6 ring-1 transition ${ringOn ? "ring-emerald-400 bg-white/[.07]" : "ring-white/15 bg-white/10"}`}>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={resetSelector}
          className="text-xs rounded-md px-2.5 py-1 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-white/80"
        >
          {t("indiv.reset","Reset")}
        </button>
      </div>


      {/* quantity + quality + project choice */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Quantity */}
        <div>
          <label className="text-xs text-white/70">{t("indiv.amount","Quantity (tCO₂e)")}</label>
          <div className="mt-1 flex items-center gap-2">
            <select
              value={qtyChoice}
              onChange={(e)=>setQtyChoice(e.target.value)}
              className="w-36 rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
            >
              {PRESETS.map(p => (
                <option key={p} value={String(p)}>{p}</option>
              ))}
              <option value="custom">{t("indiv.custom","Custom")}</option>
            </select>
            {qtyChoice === "custom" && (
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                value={qty}
                onChange={(e)=>setQty(clamp(parseInt(e.target.value || "0",10),1,1000))}
                className="w-28 rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
              />
            )}
          </div>
          <EquivalenceChips tco2={effQty}/>
        </div>

        {/* Quality (same style as Companies; no shiny) */}
        <div>
          <label className="text-xs text-white/70">{t("indiv.quality","Quality tier")}</label>
          <select
            value={quality.id}
            onChange={(e)=>setQuality(QUALITY_OPTIONS.find(q=>q.id===e.target.value))}
            className="mt-1 w-full rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"
          >
            {QUALITY_OPTIONS.map(q=>(
              <option key={q.id} value={q.id}>{q.label} — €{q.pricePerTonne}/t</option>
            ))}
          </select>
          <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
            <Info className="h-3.5 w-3.5"/>{t("indiv.qualityNote","Premium/Elite reflect scarcer, often newer projects.")}
          </div>
        </div>

        {/* Projects button -> modal */}
        <div>
          <label className="text-xs text-white/70">{t("indiv.projects","Project selection")}</label>
          <div className="mt-1">
            <button
              onClick={onClickChooseProjects}
              className="rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/15 px-3 py-2 text-left w-full"
            >
              {t("indiv.chooseProjectsBtn","I want to choose the projects myself")}
            </button>
            <div className="mt-1 text-xs text-white/60">
              {t("indiv.priceNote","Note: prices may be higher when selecting yourself; availability may not be immediate and marketplace prices can be indicative.")}
            </div>
          </div>
        </div>
      </div>

      {/* subtotal bar */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/12">
        <div className="text-sm text-white/75">{t("indiv.subtotal","Subtotal")}</div>
        <div className="text-base font-semibold text-white">€{subtotal.toLocaleString()}</div>
      </div>

      {/* select -> show form */}
      {!opened ? (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/leaderboard")}
            className="text-xs rounded-md px-2.5 py-1 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-white/80"
          >
            {t("indiv.visitLeaderboard", "Visit leaderboard")}
          </button>

          <button
            onClick={()=>setOpened(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2 font-medium"
          >
            {t("indiv.select","Select")} <ArrowRight className="h-4 w-4"/>
          </button>
        </div>
      ) : (
        <>
          {/* details form */}
          <div className="mt-4 grid gap-3">
            <div className="text-sm font-medium text-white/90">
              {t("indiv.details.you","Your details")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder={t("indiv.form.name","Your name")}
                value={meName} onChange={e=>setMeName(e.target.value)}
                className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"/>
              <input
                placeholder={t("indiv.form.email","Your email")}
                value={meEmail} onChange={e=>setMeEmail(e.target.value)}
                className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"/>
            </div>

            {kind === "gift" && (
              <>
                <div className="text-sm font-medium text-white/90">
                  {t("indiv.details.recipient","Recipient details")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder={t("indiv.form.recipientName","Recipient name")}
                    value={recName} onChange={e=>setRecName(e.target.value)}
                    className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"/>
                  <input
                    placeholder={t("indiv.form.recipientEmail","Recipient email")}
                    value={recEmail} onChange={e=>setRecEmail(e.target.value)}
                    className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2"/>
                </div>
                {/* gift add-ons */}
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <input type="checkbox" checked={giftCard} onChange={()=>setGiftCard(v=>!v)}/>
                    <span className="text-sm">{t("indiv.addons.card","Gift card (physical) +€10")}</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <input type="checkbox" checked={eCert} onChange={()=>setECert(v=>!v)}/>
                    <span className="text-sm">{t("indiv.addons.ecert","Electronic certificate")}</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                    <input type="checkbox" checked={includePhoto} onChange={()=>setIncludePhoto(v=>!v)}/>
                    <span className="text-sm">{t("indiv.addons.photo","Add a personal photo")}</span>
                  </label>
                </div>
              </>
            )}

            <textarea
              placeholder={t("indiv.form.message","Personal message (optional)")}
              value={message} onChange={e=>setMessage(e.target.value)}
              className="rounded-lg bg-white/5 ring-1 ring-white/15 px-3 py-2 min-h-[84px]"/>

            {/* leaderboard opt-in + tooltip + visit button */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={leaderboard} onChange={()=>setLeaderboard(v=>!v)}/>
                <span className="text-sm text-white/80">
                  {t("indiv.form.leaderboard","Appear in our public leaderboard")}
                </span>
                <span className="relative group inline-flex">
                  <Info className="h-4 w-4 text-white/70" />
                  <span className="absolute left-5 top-0 z-20 hidden group-hover:block w-72 text-xs rounded-lg bg-white/95 text-emerald-950 p-3 shadow-lg">
                    {kind === "gift"
                      ? t("indiv.lb.tooltip.gift","We have a public leaderboard where you can compete and get gifts if you’re leading; special surprises on occasions (e.g., Christmas). For gifts, the recipient will appear on the leaderboard.")
                      : t("indiv.lb.tooltip.self","We have a public leaderboard where you can compete and get gifts if you’re leading; special surprises on occasions (e.g., Christmas).")}
                  </span>
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/leaderboard")}
                className="text-xs rounded-md px-2.5 py-1 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-white/80"
              >
                {t("indiv.visitLeaderboard", "Visit leaderboard")}
              </button>

            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {!isValid && !selected ? (
              <div className="text-xs text-red-300">
                {t("indiv.form.needs", "Select and fill out the required information to proceed.")}
              </div>
            ) : !selected ? (
              <span className="text-emerald-300 text-xs inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                {t("indiv.ready", "Ready to proceed")}
              </span>
            ) : (
              <span className="text-emerald-300 text-sm inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40 px-2.5 py-1">
                  <Check className="h-4 w-4" />
                  <b>{t("indiv.selected", "Item selected")}</b>
                </span>
              </span>
            )}

            {!selected && (
              <div className="flex gap-2">
                <button
                  onClick={proceed}
                  disabled={!isValid}
                  className={`rounded-lg px-4 py-2 font-medium inline-flex items-center gap-2 ${
                    isValid ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400" : "bg-white/10 text-white/60 cursor-not-allowed"
                  }`}
                >
                  {t("indiv.proceed", "Proceed")} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        </>
      )}

      {/* Projects modal */}
      {showProjectsModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-[min(640px,90vw)] rounded-2xl bg-white p-5 text-emerald-950 shadow-2xl">
            <div className="flex items-start justify-between">
              <h4 className="text-lg font-semibold">
                {t("indiv.projectsModal.title","Choose projects yourself?")}
              </h4>
              <button onClick={()=>setShowProjectsModal(false)} className="text-emerald-700 hover:text-emerald-900">×</button>
            </div>
            <p className="mt-2 text-sm">
              {t("indiv.projectsModal.body","You want to know exactly where and what you impact with your purchase? Great. Visit the marketplace to get an image of what we offer.")}
            </p>
            <p className="mt-2 text-xs text-emerald-700/90">
              {t("indiv.projectsModal.note","Prices may be higher when selecting yourself; availability isn’t always immediate (we deliver as soon as you place your offer). Marketplace prices might sometimes be indicative.")}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShowProjectsModal(false)} className="rounded-lg px-3 py-1.5 ring-1 ring-emerald-700/30">
                {t("indiv.projectsModal.close","Discard")}
              </button>
              <button onClick={visitMarketplace} className="rounded-lg px-3 py-1.5 bg-emerald-600 text-white">
                {t("indiv.projectsModal.visit","Visit marketplace")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Individuals() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [pickedSelf, setPickedSelf] = useState(null);
  const [pickedGift, setPickedGift] = useState(null);
  const [resetSeed, setResetSeed] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("indiv:resetAfterPurchase") === "1") {
      localStorage.removeItem("indiv:resetAfterPurchase");
      try {
        localStorage.removeItem("indiv:draft:self");
        localStorage.removeItem("indiv:draft:gift");
      } catch {}
      setPickedSelf(null);
      setPickedGift(null);
      setResetSeed((n) => n + 1); // <-- force remount of selectors
    }
  }, []);

  // Rehydrate picks from saved drafts when the page mounts (unless we're resetting after purchase)
  useEffect(() => {
    if (localStorage.getItem("indiv:resetAfterPurchase") === "1") return;

    const fromDraft = (kind, d) => {
      if (!d?.selected) return null;
      const effQty = d.qtyChoice === "custom" ? d.qty : Number(d.qtyChoice);
      const q = QUALITY_OPTIONS.find(x => x.id === d.qualityId) ?? QUALITY_OPTIONS[0];
      const addOnTotal = kind === "gift" ? (d.giftCard ? 10 : 0) : 0;
      return {
        kind,
        qty: clamp(effQty, 1, 1000),
        quality: q.id,
        customProjects: !!d.customProjects,
        meName: d.meName || "",
        meEmail: d.meEmail || "",
        message: d.message || "",
        leaderboard: !!d.leaderboard,
        ...(kind === "gift"
          ? { recName: d.recName || "", recEmail: d.recEmail || "", addons: { giftCard: !!d.giftCard, eCert: !!d.eCert, includePhoto: !!d.includePhoto } }
          : {}),
        subtotal: clamp(effQty, 1, 1000) * q.pricePerTonne + addOnTotal,
      };
    };

    const ds = loadDraft("self");
    const dg = loadDraft("gift");
    const pickS = fromDraft("self", ds);
    const pickG = fromDraft("gift", dg);
    if (pickS) setPickedSelf(pickS);
    if (pickG) setPickedGift(pickG);
  }, []);




  const makeCartItem = (sel) => {
    const q = QUALITY_OPTIONS.find(x=>x.id===sel.quality) ?? QUALITY_OPTIONS[0];
    const qualityLabel =
      sel.quality === "premium" ? (t("packages.qualities.premium") || "Premium")
      : sel.quality === "elite" ? (t("packages.qualities.elite") || "Elite")
      : (t("packages.qualities.standard") || "Standard");

    const base = {
      size: sel.qty,
      qualityKey: sel.quality,
      qualityLabel,
      csr: { title: t("companies.csr.none") || "No thanks", price: 0 },
      total: sel.subtotal,
      meta: {
        type: "individual",
        mode: sel.kind,
        qty: sel.qty,
        quality: sel.quality,
        customProjects: !!sel.customProjects,
        meName: sel.meName, meEmail: sel.meEmail, message: sel.message, leaderboard: !!sel.leaderboard,
      },
    };
    if (sel.kind === "gift") {
      base.meta.recName = sel.recName;
      base.meta.recEmail = sel.recEmail;
      base.meta.addons = sel.addons || {};
    }
    return base;
  };

  const handleAddToCart = () => {
    // add to cart
    if (pickedSelf) addItem(makeCartItem(pickedSelf));
    if (pickedGift) addItem(makeCartItem(pickedGift));

    

    // RESET NOW (not only after checkout)
    try {
      localStorage.removeItem("indiv:draft:self");
      localStorage.removeItem("indiv:draft:gift");
    } catch {}
    setPickedSelf(null);
    setPickedGift(null);
    setResetSeed((n) => n + 1); // forces both selectors to remount (ring off)

    navigate("/cart-review");
  };



  const footerEnabled = !!(pickedSelf || pickedGift);

  return (
    <PagePanel
      title={t(
        "indiv.hero.title",
        "Hi there! Looking to reduce your footprint, do nature a favor, or gift real climate impact?"
      )}
      subtitle={t(
        "indiv.hero.sub",
        "You’re in the right place. Offset verified carbon for yourself in minutes — or send a thoughtful gift that retires credits in your recipient’s name."
      )}
      icon={Leaf}
    >
      {/* hero image */}
      <div className="mt-3 mb-6">
        <img
          src="/images/individuals-hero.jpg"
          alt={t("indiv.hero.imageAlt","Beautiful nature scene")}
          className="w-full aspect-[16/9] rounded-2xl object-cover ring-1 ring-white/10"
        />
      </div>

      {/* Section 1 */}
      <section className="mb-2">
        <div className="mb-2 flex items-center gap-2 text-emerald-400">
          <Leaf className="h-5 w-5"/><h3 className="text-lg font-semibold">{t("indiv.self.title","Offset for myself")}</h3>
        </div>
        <p className="text-sm text-white/80">
          {t("indiv.self.lede","Pick quantity and quality. If you don’t choose projects, we’ll assemble the most convenient, high-quality mix for you.")}
        </p>
        <Link to="/learn/individuals" className="text-xs text-emerald-300 underline underline-offset-2">
          {t("indiv.learnMore","Learn more")}
        </Link>
      </section>
      <Selector key={`self-${resetSeed}`} t={t} kind="self" ringOn={!!pickedSelf} onProceed={setPickedSelf} prefill={pickedSelf ?? {}} />

      {/* Section 2 */}
      <section className="mt-8 mb-2">
        <div className="mb-2 flex items-center gap-2 text-emerald-400">
          <Gift className="h-5 w-5"/><h3 className="text-lg font-semibold">{t("indiv.gift.title","Gift a carbon offset")}</h3>
        </div>
        <p className="text-sm text-white/80">
          {t("indiv.gift.lede","For yourself, credits are retired to your name (not transferable). For gifts, we retire them to the recipient’s name and send a beautiful certificate. The recipient appears on the leaderboard if opted in.")}
        </p>
        <Link to="/learn/gifts" className="text-xs text-emerald-300 underline underline-offset-2">
          {t("indiv.learnMore","Learn more")}
        </Link>
      </section>
      <Selector key={`gift-${resetSeed}`} t={t} kind="gift" ringOn={!!pickedGift} onProceed={setPickedGift} prefill={pickedGift ?? {}} />

      {/* footer add to cart */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/leaderboard")}
          className="text-xs rounded-md px-2.5 py-1 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-white/80"
        >
          {t("indiv.visitLeaderboard", "Visit leaderboard")}
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!footerEnabled}
          className={`rounded-lg px-5 py-2.5 font-medium ${footerEnabled ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400" : "bg-white/10 text-white/60 cursor-not-allowed"}`}
        >
          {t("indiv.addToCart","Add selected to cart")}
        </button>
      </div>

      <div className="mt-6 text-xs text-white/60">
        {t("indiv.disclaimer","Equivalences are indicative; actual footprints vary by route, vehicle, habits, and other factors.")}
      </div>
    </PagePanel>
  );
}
