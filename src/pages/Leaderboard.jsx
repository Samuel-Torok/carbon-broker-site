import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { getLeaderboard, QUALITY_COEFF } from "../lib/leaderboard";
import { useState, useEffect, useMemo } from "react";

const KM_PER_TONNE = 8333.33; // ~120 gCO₂/km → 1 tCO₂ ≈ 8,333 km

function kmText(t) {
  return Math.round((t || 0) * KM_PER_TONNE).toLocaleString();
}
function rankClass(n) {
  if (n === 1) return "bg-gradient-to-b from-amber-200 to-yellow-400 bg-clip-text text-transparent font-semibold";
  if (n === 2) return "bg-gradient-to-b from-zinc-200 to-zinc-400 bg-clip-text text-transparent font-semibold";
  if (n === 3) return "bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent font-semibold";
  return "text-white";
}
function PodiumCard({ rank, name, qty, score }) {
  const heights = { 1: "h-28", 2: "h-20", 3: "h-16" };
  const rings = {
    1: "ring-yellow-400/60",
    2: "ring-zinc-300/60",
    3: "ring-amber-600/60"
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`rounded-2xl ring-1 ${rings[rank]} bg-white/[0.03] px-4 py-3 w-full`}>
        <div className="text-center text-xs uppercase tracking-wide opacity-70">#{rank}</div>
        <div className="text-center font-semibold truncate">{name || "Anonymous"}</div>
        <div className="mt-1 text-center text-xs opacity-80">{(qty ?? 0).toLocaleString()} tCO₂e</div>
        <div className="text-center text-[11px] opacity-60">≈ {kmText(qty)} km by car</div>
      </div>
      <div className={`w-10 rounded-t-xl bg-white/10 ${heights[rank]}`} />
    </div>
  );
}

export default function Leaderboard() {
  const { t } = useI18n();
  const [view, setView] = useState("individual");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getLeaderboard(view)
      .then(data => { if (alive) setRows(data); })
      .catch(() => { if (alive) setRows([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [view]);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);

  return (
    <PagePanel
      title={t("lb.title","Public Leaderboard")}
      // small hype line under the title
      subtitle={t(
        "lb.pitch",
        "Welcome to our public leaderboard—see who’s leading on climate action. Stack your offsets and unlock occasional rewards."
      )}
      // no trophy icon
    >
      {/* Tabs + prizes button */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-xl ring-1 ring-white/15 overflow-hidden">
          <button
            onClick={() => setView("individual")}
            className={`px-3 py-1.5 text-sm ${view === "individual" ? "bg-emerald-500 text-emerald-950" : "bg-white/5 text-white"}`}
          >
            {t("lb.tab.ind", "Individuals")}
          </button>
          <button
            onClick={() => setView("company")}
            className={`px-3 py-1.5 text-sm ${view === "company" ? "bg-emerald-500 text-emerald-950" : "bg-white/5 text-white"}`}
          >
            {t("lb.tab.comp", "Companies")}
          </button>
        </div>

        <a
          href="/prizes"
          className="rounded-full px-3 py-1.5 text-sm ring-1 ring-white/20 bg-white/5 hover:bg-white/10 transition"
        >
          {t("lb.prizes", "See current prizes")}
        </a>
      </div>

      {/* Podium */}
      {!loading && top3.length > 0 && (
        <div className="mb-5 grid grid-cols-3 gap-3 items-end">
          {top3.length === 2 ? (
            <>
              <PodiumCard rank={1} {...{ name: top3[0]?.name, qty: top3[0]?.qty, score: top3[0]?.score }} />
              <PodiumCard rank={2} {...{ name: top3[1]?.name, qty: top3[1]?.qty, score: top3[1]?.score }} />
              <div />
            </>
          ) : (
            <>
              <PodiumCard rank={2} {...{ name: top3[1]?.name, qty: top3[1]?.qty, score: top3[1]?.score }} />
              <PodiumCard rank={1} {...{ name: top3[0]?.name, qty: top3[0]?.qty, score: top3[0]?.score }} />
              <PodiumCard rank={3} {...{ name: top3[2]?.name, qty: top3[2]?.qty, score: top3[2]?.score }} />
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">{view==="company" ? t("lb.company","Company") : t("lb.name","Name")}</th>
              <th className="px-4 py-2">{t("lb.total","Total tCO₂e")}</th>
              <th className="px-4 py-2">{t("lb.km","≈ Car km")}</th>
              <th className="px-4 py-2">{t("lb.weighted","Weighted score")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-white/70">{t("lb.loading","Loading...")}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-white/70">{t("lb.empty","No entries yet—be the first!")}</td></tr>
            ) : rows.map((r,i)=>(
              <tr key={i} className="odd:bg-white/0 even:bg-white/[.03]">
                <td className="px-4 py-2">
                  <span className={rankClass(i+1)}>{i+1}</span>
                </td>
                <td className="px-4 py-2">{r.name || t("lb.anon","Anonymous")}</td>
                <td className="px-4 py-2">{(r.qty ?? 0).toLocaleString()}</td>
                <td className="px-4 py-2">{kmText(r.qty)}</td>
                <td className="px-4 py-2">{Number(r.score ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimers */}
      <div className="mt-4 text-xs text-white/60 space-y-1">
        <p>{t("lb.disclaimer1","Please compete fairly. Marketplace purchases are not included in this leaderboard.")}</p>
        <p>{t("lb.disclaimer2",`Weighted score = tonnes × quality coefficient (Standard ×${QUALITY_COEFF.standard}, Premium ×${QUALITY_COEFF.premium}, Elite ×${QUALITY_COEFF.elite}).`)}</p>
        <p>{t("lb.disclaimer3","Car-km equivalence uses ~120 g CO₂/km (approximation for a typical passenger car).")}</p>
      </div>
    </PagePanel>
  );
}
