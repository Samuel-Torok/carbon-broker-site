import React from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons under Vite
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl: icon, iconRetinaUrl: icon2x, shadowUrl: shadow });

export default function Partners() {
  const [partners, setPartners] = React.useState([]);
  const [useLocation, setUseLocation] = React.useState(false);
  const [pos, setPos] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/partners").then(r => r.json()).then(d => setPartners(d.partners || []));
  }, []);

  React.useEffect(() => {
    if (!useLocation) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setUseLocation(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [useLocation]);

  const center = pos || { lat: 49.6117, lng: 6.1319 }; // default: Lux City
  const zoom = pos ? 13 : 11;

  return (
    <div className="relative z-10 flex-1 min-h-0 w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Find a partner near you</span>
        </h1>
        <p className="mt-2 text-white/80">See local stores collaborating with LuxOffset. Turn on location to highlight nearby places.</p>

        <div className="mt-4 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useLocation} onChange={(e)=>setUseLocation(e.target.checked)} />
            Share my location (optional)
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <MapContainer center={center} zoom={zoom} style={{ height: 420, width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pos && (
              <Marker position={pos}>
                <Popup><b>You are here</b></Popup>
              </Marker>
            )}
            {partners.map(p => (
              <Marker key={p.id} position={{ lat: p.lat, lng: p.lng }}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs opacity-80">{p.address}</div>
                    <Link to={`/partners/${p.slug}`} className="text-indigo-300 underline">View details</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Cards preview */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {partners.map(p => (
            <Link key={p.id} to={`/partners/${p.slug}`} className="group rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition">
              <div className="aspect-[3/2] w-full overflow-hidden">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <p className="mt-1 text-sm text-white/80 line-clamp-2">{p.blurb}</p>
                <div className="mt-2 text-sm text-indigo-300 underline">View details →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
