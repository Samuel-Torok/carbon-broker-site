import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { getLeaderboard, QUALITY_COEFF } from "../lib/leaderboard";
import { useState, useEffect, useMemo } from "react";
import { Crown, Medal } from "lucide-react";

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
const medalRing = {
  1: "ring-2 ring-yellow-400/70",
  2: "ring-2 ring-zinc-300/70",
  3: "ring-2 ring-amber-600/70",
};
const glowBg = {
  1: "from-yellow-400/20 via-amber-300/10 to-transparent",
  2: "from-zinc-300/20 via-zinc-200/10 to-transparent",
  3: "from-amber-600/20 via-orange-500/10 to-transparent",
};

function initialOf(name = "") {
  const s = String(name).trim();
  return s ? s[0].toUpperCase() : "A";
}

function PodiumCard({ rank, name, qty }) {
  const isChampion = rank === 1;
  return (
    <div className={`relative flex flex-col items-center ${isChampion ? "sm:-translate-y-1" : ""}`}>
      {/* glow */}
      <div className={`pointer-events-none absolute -inset-x-6 -top-8 h-28 bg-gradient-to-b ${glowBg[rank]} blur-2xl`} />
      {/* tile */}
      <div
        className={`relative w-full max-w-xs rounded-2xl bg-white/[0.04] backdrop-blur-sm ring-1 ring-white/10 ${medalRing[rank]} px-5 py-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20`}>
              <span className="text-lg font-semibold">{initialOf(name)}</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide opacity-70">#{rank}</div>
              <div className="font-semibold truncate">{name || "Anonymous"}</div>
            </div>
          </div>
          {rank === 1 ? (
            <Crown className="h-6 w-6 text-yellow-400 drop-shadow" aria-hidden />
          ) : (
            <Medal className={`h-6 w-6 ${rank === 2 ? "text-zinc-300" : "text-amber-600"}`} aria-hidden />
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <div className="text-[11px] opacity-70">Total</div>
            <div className="font-medium">{(qty ?? 0).toLocaleString()} tCO₂e</div>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <div className="text-[11px] opacity-70">≈ km by car</div>
            <div className="font-medium">{kmText(qty)}</div>
          </div>
        </div>
      </div>
      {/* pedestal */}
      <div
        className={`mt-2 w-12 rounded-t-xl bg-white/10 ${rank === 1 ? "h-24" : rank === 2 ? "h-16" : "h-12"}`}
        aria-hidden
      />
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
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch(() => {
        if (alive) setRows([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [view]);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);

  return (
    <PagePanel
      title={t("lb.title", "Public Leaderboard")}
      subtitle={t(
        "lb.pitch",
        "Welcome to our public leaderboard—see who’s leading on climate action. Stack your offsets and unlock occasional rewards."
      )}
    >
      {/* See prizes button BELOW intro text */}
      <div className="mt-2">
        <a
          href="/prizes"
          className="inline-flex items-center rounded-full px-3 py-1.5 text-sm ring-1 ring-white/20 bg-white/5 hover:bg-white/10 transition"
        >
          {t("lb.prizes", "See current prizes")}
        </a>
      </div>

      {/* Tabs */}
      <div className="mt-4 mb-5 inline-flex flex-col sm:flex-row gap-2 sm:gap-0 rounded-xl ring-1 ring-white/15 overflow-hidden w-full sm:w-auto">
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

      {/* Podium */}
      {!loading && top3.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
          {top3.length === 1 && (
            <>
              <div className="sm:col-start-2">
                <PodiumCard rank={1} name={top3[0]?.name} qty={top3[0]?.qty} />
              </div>
            </>
          )}
          {top3.length === 2 && (
            <>
              <PodiumCard rank={1} name={top3[0]?.name} qty={top3[0]?.qty} />
              <PodiumCard rank={2} name={top3[1]?.name} qty={top3[1]?.qty} />
            </>
          )}
          {top3.length === 3 && (
            <>
              <div className="sm:order-1"><PodiumCard rank={2} name={top3[1]?.name} qty={top3[1]?.qty} /></div>
              <div className="sm:order-0"><PodiumCard rank={1} name={top3[0]?.name} qty={top3[0]?.qty} /></div>
              <div className="sm:order-2"><PodiumCard rank={3} name={top3[2]?.name} qty={top3[2]?.qty} /></div>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-3 sm:px-4 py-2">#</th>
              <th className="px-3 sm:px-4 py-2">{view === "company" ? t("lb.company", "Company") : t("lb.name", "Name")}</th>
              <th className="px-3 sm:px-4 py-2">{t("lb.total", "Total tCO₂e")}</th>
              <th className="px-3 sm:px-4 py-2">{t("lb.km", "≈ Car km")}</th>
              <th className="px-3 sm:px-4 py-2">{t("lb.weighted", "Weighted score")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-4 py-6 text-center text-white/70">
                  {t("lb.loading", "Loading...")}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-4 py-6 text-center text-white/70">
                  {t("lb.empty", "No entries yet—be the first!")}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className="odd:bg-white/0 even:bg-white/[.03]">
                  <td className="px-3 sm:px-4 py-2">
                    <span className={rankClass(i + 1)}>{i + 1}</span>
                  </td>
                  <td className="px-3 sm:px-4 py-2">{r.name || t("lb.anon", "Anonymous")}</td>
                  <td className="px-3 sm:px-4 py-2">{(r.qty ?? 0).toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-2">{kmText(r.qty)}</td>
                  <td className="px-3 sm:px-4 py-2">{Number(r.score ?? 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Disclaimers */}
      <div className="mt-4 text-[11px] sm:text-xs text-white/60 space-y-1">
        <p>
          {t(
            "lb.disclaimer1",
            "Please compete fairly. Marketplace purchases are not included in this leaderboard."
          )}
        </p>
        <p>
          {t(
            "lb.disclaimer2",
            `Weighted score = tonnes × quality coefficient (Standard ×${QUALITY_COEFF.standard}, Premium ×${QUALITY_COEFF.premium}, Elite ×${QUALITY_COEFF.elite}).`
          )}
        </p>
        <p>
          {t(
            "lb.disclaimer3",
            "Car-km equivalence uses ~120 g CO₂/km (approximation for a typical passenger car)."
          )}
        </p>
      </div>
    </PagePanel>
  );
}
