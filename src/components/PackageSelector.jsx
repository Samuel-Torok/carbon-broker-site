import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function PackageSelector({ audience = "company" }) {
  const isCompany = audience === "company";
  const sizes = isCompany ? [100, 500, 1000, 5000, 10000] : [1, 5, 10, 20, 50];
  const basePrice = isCompany ? 12 : 15; // €/tCO2e (example)
  const qualities = [
    { id: "standard", label: "Standard", x: 1.0 },
    { id: "premium", label: "Premium (nature-based, recent)", x: 1.25 },
    { id: "elite", label: "Elite (cookstoves/REDD+, newest)", x: 1.5 },
  ];

  const [size, setSize] = useState(sizes[0]);
  const [quality, setQuality] = useState(qualities[0].id);

  const total = useMemo(() => {
    const q = qualities.find(q => q.id === quality)?.x ?? 1;
    return size * basePrice * q;
  }, [size, quality]);

  return (
    <Card className="border-slate-200/60 dark:border-slate-700">
      <CardHeader>
        <CardTitle>{isCompany ? "Buy packages for companies" : "Buy packages for individuals"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm">Size (tCO₂e)</span>
          <select
            className="rounded-md border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            {sizes.map(s => <option key={s} value={s}>{s.toLocaleString()}</option>)}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm">Quality</span>
          <select
            className="rounded-md border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            {qualities.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
          </select>
        </label>

        <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <div className="text-sm text-slate-500">Estimated total</div>
          <div className="text-2xl font-extrabold">€{total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
        </div>

        <Button className="sm:col-span-2">Proceed</Button>
        <p className="sm:col-span-2 text-xs text-slate-500">
          Final pricing depends on project, vintage and availability. We’ll confirm by email.
        </p>
      </CardContent>
    </Card>
  );
}
