import React from "react";
import { Link } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "../i18n";

// --- custom SVG pin icons (emerald for shops, red for your position) ---
const pinIcon = (hex) =>
  L.icon({
    iconSize: [26, 38],
    iconAnchor: [13, 38],
    popupAnchor: [0, -30],
    iconUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 38">
           <path d="M13 38c0 0 11-14 11-22A11 11 0 1 0 2 16c0 8 11 22 11 22z" fill="${hex}" stroke="white" stroke-width="2"/>
           <circle cx="13" cy="15" r="4.5" fill="white"/>
         </svg>`
      ),
  });
const emeraldIcon = pinIcon("#34d399"); // shops
const redIcon = pinIcon("#ef4444");     // your location

// distance in km
function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180, lat2 = b.lat * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function Partners() {
  const { t } = useI18n();
  const [partners, setPartners] = React.useState([]);
  const [locOn, setLocOn] = React.useState(false);
  const [pos, setPos] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/partners").then(r => r.json()).then(d => setPartners(d.partners || []));
  }, []);

  React.useEffect(() => {
    if (!locOn) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setLocOn(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [locOn]);

  const center = pos || { lat: 49.6117, lng: 6.1319 }; // Luxembourg City default
  const zoom = pos ? 13 : 11;

  // nearby logic (3 km radius)
  const NEAR_KM = 3;
  const enriched = partners.map(p => {
    const nearby = pos ? haversine(pos, { lat: p.lat, lng: p.lng }) <= NEAR_KM : false;
    return { ...p, nearby };
  });

  return (
    <PagePanel title={t("partners.title")} subtitle={t("partners.subtitle")}>
      {/* location toggle only (CTA moved to bottom) */}
      <div className="mt-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={locOn} onChange={(e) => setLocOn(e.target.checked)} />
          {t("partners.toggle")}
        </label>
      </div>

      {/* map */}
      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
        <MapContainer center={center} zoom={zoom} style={{ height: 420, width: "100%" }}>
          {/* Softer, clean basemap */}
          <TileLayer
            attribution="&copy; OpenStreetMap, &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* your location as red pin */}
          {pos && (
            <Marker position={pos} icon={redIcon}>
              <Popup><b>{t("partners.youAreHere")}</b></Popup>
            </Marker>
          )}

          {/* partner markers; highlight nearby with a violet ring */}
          {enriched.map(p => (
            <React.Fragment key={p.id}>
              {p.nearby && (
                <CircleMarker
                  center={{ lat: p.lat, lng: p.lng }}
                  radius={14}
                  pathOptions={{ color: "#a78bfa", fillOpacity: 0 }}
                />
              )}
              <Marker position={{ lat: p.lat, lng: p.lng }} icon={emeraldIcon}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs opacity-80">{p.address}</div>
                    <Link to={`/partners/${p.slug}`} className="text-indigo-300 underline">
                      {t("partners.viewDetails")}
                    </Link>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {enriched.map(p => (
          <Link
            key={p.id}
            to={`/partners/${p.slug}`}
            className={`group rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition ${p.nearby ? "ring-2 ring-violet-400" : ""}`}
          >
            <div className="aspect-[3/2] w-full overflow-hidden relative">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition" />
              {p.nearby && (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded-full bg-violet-500/90 text-white">
                  {t("partners.nearby")}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="font-semibold">{p.name}</div>
              <p className="mt-1 text-sm text-white/80 line-clamp-2">{p.blurb}</p>
              <div className="mt-2 text-sm text-indigo-300 underline">{t("partners.viewDetails")} →</div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA footer (moved here) */}
      <div className="mt-10 rounded-2xl ring-1 ring-white/10 bg-white/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="font-semibold">{t("partners.cta.title")}</div>
          <p className="text-white/75">{t("partners.cta.desc")}</p>
        </div>
        <Link to="/contact" className="btn-outline-gradient">
          <span className="pill">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
              {t("partners.cta.btn")}
            </span>
          </span>
        </Link>
      </div>
    </PagePanel>
  );
}
