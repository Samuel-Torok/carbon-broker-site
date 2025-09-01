import PagePanel from "../components/PagePanel.jsx";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";

export default function Marketplace() {
  const { t } = useI18n();
  const items = t("market.items");

  return (
    <PagePanel maxWidth="max-w-6xl">
      <main className="py-12 space-y-6 text-slate-100">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold title-gradient">{t("market.title")}</h1>
          <p className="opacity-80">{t("market.subtitle")}</p>
        </header>

        {/* Mosaic */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {items.map((it) => (
            <article
              key={it.id}
              className="mb-4 break-inside-avoid rounded-2xl ring-1 ring-white/10 bg-slate-950/80 backdrop-blur overflow-hidden"
            >
              <div className="relative">
                {it.image ? (
                  <img src={it.image} alt="" className="w-full h-auto object-cover" style={{ aspectRatio: "4 / 3" }}/>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-emerald-500/40 to-indigo-500/40" />
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{it.standard}</Badge>
                  <Badge className="bg-white/10">{it.vintage}</Badge>
                </div>

                <h3 className="text-lg font-semibold">{it.title}</h3>
                <p className="text-sm opacity-85">{it.summary}</p>

                <div className="text-xs opacity-75">{it.type} • {it.origin}</div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xl font-bold">€{it.priceEur} <span className="text-sm opacity-70">/ tCO₂e</span></div>
                  <Button className="bg-gradient-to-r from-emerald-400 to-indigo-400 text-white border-0 hover:brightness-110">
                    {t("market.enquire")}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="text-xs opacity-70">{t("market.placeholderNote")}</p>
      </main>
    </PagePanel>
  );
}
