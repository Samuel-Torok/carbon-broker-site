import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";

export default function PackageSelector({ audience = "company" }) {
  const { t, lang } = useI18n();
  const isCompany = audience === "company";

  // sizes in tonnes (company) or tonnes per individual
  const sizes = isCompany ? [100, 500, 1000, 5000, 10000] : [1, 5, 10, 20, 50];
  const basePrice = isCompany ? 12 : 15; // €/tCO2e (example)

  // pricing tiers (labels from i18n)
  const qualities = [
    { id: "standard", x: 1.0 },
    { id: "premium",  x: 1.25 },
    { id: "elite",    x: 1.5 },
  ];

  const [size, setSize] = useState(sizes[0]);
  const [quality, setQuality] = useState(qualities[0].id);

  const total = useMemo(() => {
    const q = qualities.find(q => q.id === quality)?.x ?? 1;
    return size * basePrice * q;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, quality, basePrice]);

  const nf = (n) => Number(n).toLocaleString(lang, { maximumFractionDigits: 0 });

  return (
    <Card className="border-slate-200/60 dark:border-slate-700">
      <CardHeader>
        <CardTitle>
          {isCompany ? t("packages.titleCompany") : t("packages.titleIndividuals")}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm">{t("packages.sizeLabel")}</span>
          <select
            className="rounded-md border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            {sizes.map((s) => (
              <option key={s} value={s}>{nf(s)}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm">{t("packages.qualityLabel")}</span>
          <select
            className="rounded-md border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            {qualities.map((q) => (
              <option key={q.id} value={q.id}>
                {t(`packages.qualities.${q.id}`)}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <div className="text-sm text-slate-500">{t("packages.estimatedTotal")}</div>
          <div className="text-2xl font-extrabold">€{nf(total)}</div>
        </div>

        <Button className="sm:col-span-2">{t("packages.proceed")}</Button>

        <p className="sm:col-span-2 text-xs text-slate-500">
          {t("packages.disclaimer")}
        </p>
      </CardContent>
    </Card>
  );
}
