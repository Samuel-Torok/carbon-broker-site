import PagePanel from "../components/PagePanel.jsx";
import { Trophy } from "lucide-react";
import { useI18n } from "../i18n";
import { getLeaderboard, QUALITY_COEFF } from "../lib/leaderboard";
import { useState, useMemo } from "react";

export default function Leaderboard() {
  const { t } = useI18n();
  const [view, setView] = useState("individual"); // "individual" | "company"
  const rows = useMemo(() => getLeaderboard(view), [view]);

  return (
    <PagePanel
      title={t("lb.title","Public Leaderboard")}
      subtitle={t("lb.sub","Compete kindly: rankings are weighted by credit quality (Standard ×1, Premium ×1.25, Elite ×1.5).")}
      icon={Trophy}
    >
      <div className="mb-3 inline-flex rounded-xl ring-1 ring-white/15 overflow-hidden">
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

      <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">{view==="company" ? t("lb.company","Company") : t("lb.name","Name")}</th>
              <th className="px-4 py-2">{t("lb.email","Email")}</th>
              <th className="px-4 py-2">{t("lb.total","Total tCO₂e")}</th>
              <th className="px-4 py-2">{t("lb.weighted","Weighted score")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-white/70">{t("lb.empty","No entries yet—be the first!")}</td></tr>
            ) : rows.map((r,i)=>(
              <tr key={i} className="odd:bg-white/0 even:bg-white/[.03]">
                <td className="px-4 py-2">{i+1}</td>
                <td className="px-4 py-2">{r.name || t("lb.anon","Anonymous")}</td>
                <td className="px-4 py-2 text-white/70">{r.email || "—"}</td>
                <td className="px-4 py-2">{r.qty.toLocaleString()}</td>
                <td className="px-4 py-2">{r.score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-white/60">
        {t("lb.note",`Quality coefficients: Standard ×${QUALITY_COEFF.standard}, Premium ×${QUALITY_COEFF.premium}, Elite ×${QUALITY_COEFF.elite}.`)}
      </div>
    </PagePanel>
  );
}
