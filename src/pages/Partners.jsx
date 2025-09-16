import React from "react";
import { Link } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { MapPin, Store } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "../i18n";

// fix leaflet default marker icons
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl: icon, iconRetinaUrl: icon2x, shadowUrl: shadow });

// small helper: distance in km
function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI/180;
  const dLng = (b.lng - a.lng) * Math.PI/180;
  const lat1 = a.lat * Math.PI/180, lat2 = b.lat * Math.PI/180;
  const s = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
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
    <PagePanel title={t("partners.title","Find a partner near you")} subtitle={t("partners.subtitle")} icon={Store}>
      {/* top intro + CTA */}
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={locOn} onChange={(e)=>setLocOn(e.target.checked)} />
          {t("partners.toggle","Turn on my location")}
        </label>

        <Link to="/contact" className="btn-outline-gradient">
          <span className="pill">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
              {t("partners.cta.btn","Partner with us")}
            </span>
          </span>
        </Link>
      </div>
      <p className="mt-1 text-white/70">
        <span className="font-medium">{t("partners.cta.title")}</span> — {t("partners.cta.desc")}
      </p>

      {/* map */}
      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
        <MapContainer center={center} zoom={zoom} style={{ height: 420, width: "100%" }}>
          {/* Softer, clean basemap */}
          <TileLayer
            attribution='&copy; OpenStreetMap, &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* user's location in different color */}
          {pos && (
            <CircleMarker
              center={pos}
              radius={8}
              pathOptions={{ color: "#34d399", fillColor: "#34d399", fillOpacity: 0.9 }} // emerald
            >
              <Popup><b>{t("partners.youAreHere","You are here")}</b></Popup>
            </CircleMarker>
          )}

          {/* partner markers; highlight those nearby */}
          {enriched.map(p => (
            <React.Fragment key={p.id}>
              {p.nearby && (
                <CircleMarker
                  center={{ lat: p.lat, lng: p.lng }}
                  radius={14}
                  pathOptions={{ color: "#a78bfa", fillOpacity: 0 }} // violet ring
                />
              )}
              <Marker position={{ lat: p.lat, lng: p.lng }}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs opacity-80">{p.address}</div>
                    <Link to={`/partners/${p.slug}`} className="text-indigo-300 underline">
                      {t("partners.viewDetails","View details")}
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
          <Link key={p.id} to={`/partners/${p.slug}`}
            className={`group rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition ${p.nearby ? "ring-2 ring-violet-400" : ""}`}>
            <div className="aspect-[3/2] w-full overflow-hidden relative">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition" />
              {p.nearby && (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded-full bg-violet-500/90 text-white">
                  {t("partners.nearby","Nearby")}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="font-semibold">{p.name}</div>
              <p className="mt-1 text-sm text-white/80 line-clamp-2">{p.blurb}</p>
              <div className="mt-2 text-sm text-indigo-300 underline">{t("partners.viewDetails","View details")} →</div>
            </div>
          </Link>
        ))}
      </div>
    </PagePanel>
  );
}
