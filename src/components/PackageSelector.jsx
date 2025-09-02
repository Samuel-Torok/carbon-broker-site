import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useI18n } from "../i18n";

export default function PackageSelector({ audience = "company", onChange }) {
  const { t, lang } = useI18n();
  const isCompany = audience === "company";

  // popular suggestions
  const sizes = isCompany ? [100, 500, 1000, 5000, 10000] : [1, 5, 10, 20, 50];
  const basePrice = isCompany ? 12 : 15;

  const qualities = [
    { id: "standard", x: 1.0 },
    { id: "premium",  x: 1.25 },
    { id: "elite",    x: 1.5 },
  ];

  const [size, setSize] = useState(sizes[0]);
  const [quality, setQuality] = useState(qualities[0].id);
  
  const total = useMemo(() => {
    const q = qualities.find(q => q.id === quality)?.x ?? 1;
    return Number(size || 0) * basePrice * q;
  }, [size, quality, basePrice]);

  useEffect(() => {
    onChange?.({ audience, size: Number(size), quality, total });
  }, [audience, size, quality, total, onChange]);

  const nf = (n) => Number(n).toLocaleString(lang, { maximumFractionDigits: 0 });

  const listId = isCompany ? "sizes-company" : "sizes-individual";

  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>{t("packages.configure")}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        {/* Quantity (custom number + suggestions) */}
        <label className="grid gap-2">
          <span className="text-sm text-white/80">{t("packages.sizeLabel")}</span>
          <input
            type="number"
            min={isCompany ? 1 : 1}
            step={isCompany ? 10 : 1}
            list={listId}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="rounded-md border border-white/10 bg-white/10 p-2 text-white placeholder-white/60
                       focus:outline-none focus:ring-0 focus:border-white/20"
          />
          <datalist id={listId}>
            {sizes.map((s) => <option key={s} value={s} />)}
          </datalist>
        </label>

     {/* Quality */}
    <label className="grid gap-2">
      <span className="text-sm text-white/80">{t("packages.qualityLabel")}</span>

      <div className="relative">
        <select
          className="w-full appearance-none rounded-md border border-white/10 bg-white/10 p-2 pr-10 text-white
                    focus:outline-none focus:ring-0 focus:border-white/20"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
        >
          {qualities.map((q) => (
            <option
              key={q.id}
              value={q.id}
              className="bg-slate-900 text-white"
            >
              {t(`packages.qualities.${q.id}`)}
            </option>
          ))}
        </select>

        {/* Custom chevron (so the OS arrow/shiny style is gone) */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .92 1.18l-4.17 3.3a.75.75 0 0 1-.92 0l-4.17-3.3a.75.75 0 0 1-.02-1.06z"/>
        </svg>
      </div>
    </label>

        {/* Price preview */}
        <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-sm text-white/70">{t("packages.estimatedTotal")}</div>
          <div className="text-2xl font-extrabold">€{nf(total)}</div>
        </div>

        <p className="sm:col-span-2 text-xs text-white/60">
          {t("packages.disclaimer")}
        </p>
      </CardContent>
    </Card>
  );
}
