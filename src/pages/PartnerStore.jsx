import React from "react";
import { useParams, Link } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function PartnerStore() {
  const { t } = useI18n();
  const { slug } = useParams();
  const [store, setStore] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/partners").then(r => r.json()).then(d => {
      const s = (d.partners || []).find(p => p.slug === slug);
      setStore(s || null);
    });
  }, [slug]);

  if (!store) {
    return (
      <PagePanel title={t("partner.notFound", "Store not found")}>
        <Link to="/partners" className="text-indigo-300 underline">
          {t("partner.back", "Back to partners")}
        </Link>
      </PagePanel>
    );
  }

  return (
    <PagePanel title={store.name} subtitle={store.address} maxWidth="max-w-6xl">
      <div className="overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5">
        <img src={store.image} alt={store.name} className="w-full h-[360px] object-cover" />
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold">{t("partner.about", "About")}</h2>
                <p className="mt-2 text-white/85">
                  {store.blurb ||
                    "This partner collaborates with LuxOffset to embed micro-offsets into everyday purchases. Scan the QR on cups/bags to view retirement details and certificates."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">
                  {t("partner.how.title", "How it works")}
                </h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
                  <li>{t("partner.how.step1", "Choose a bundled item (e.g., Carbon Coffee).")}</li>
                  <li>{t("partner.how.step2", "We retire the matching micro-offset for you.")}</li>
                  <li>{t("partner.how.step3", "Get a digital certificate via QR or email.")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.sustainability", "Sustainability")}</h2>
                <p className="mt-2 text-white/85">
                  Verified credits are retired in reputable registries and matched to the item’s footprint estimate.
                  Customers can access the public retirement link from the receipt or QR.
                </p>
              </section>
            </div>

            {/* right */}
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold">{t("partner.offers", "What you can buy")}</h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
                  {(store.products || []).map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.visit", "Visit")}</h2>
                <div className="mt-2 text-white/85 space-y-1">
                  <div><span className="opacity-70">{t("partner.address", "Address")}:</span> {store.address}</div>
                  {store.hours && <div><span className="opacity-70">{t("partner.hours", "Opening hours")}:</span> {store.hours}</div>}
                  {store.website && (
                    <div>
                      <span className="opacity-70">{t("partner.website", "Website")}:</span>{" "}
                      <a className="underline text-indigo-300" href={store.website} target="_blank" rel="noreferrer">{store.website}</a>
                    </div>
                  )}
                  {store.phone && <div><span className="opacity-70">{t("partner.phone", "Phone")}:</span> {store.phone}</div>}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.perks.title", "Perks")}</h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
                  <li>{t("partner.perks.item1", "Visible climate action at point of sale")}</li>
                  <li>{t("partner.perks.item2", "Verified retirement and certificate links")}</li>
                  <li>{t("partner.perks.item3", "Co-branding and joint marketing")}</li>
                  <li>{t("partner.perks.item4", "Monthly impact summaries for your team")}</li>
                </ul>
              </section>

              <Link to="/partners" className="btn-outline-neutral">
                <span className="pill"><span className="text-slate-200">{t("partner.back", "Back to partners")}</span></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PagePanel>
  );
}
