import { useEffect, useMemo, useState } from "react";

const API = ""; // same-origin

function euros(cents) {
  if (typeof cents !== "number") return "€–";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function AdminOrders() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [input, setInput] = useState(token);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  const authed = useMemo(() => !!token, [token]);

  const saveToken = () => {
    localStorage.setItem("adminToken", input.trim());
    setToken(input.trim());
  };

  const load = async () => {
    if (!authed) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/api/admin/orders?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* on mount and when token changes */ }, [token]);

  const resend = async (id) => {
    if (!id) return;
    const confirm = window.confirm("Resend receipt to the customer email on this session?");
    if (!confirm) return;
    try {
      const r = await fetch(`${API}/api/admin/orders/${encodeURIComponent(id)}/resend`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
      alert("Resent!");
      load();
    } catch (e) {
      alert(e.message || "Failed to resend");
    }
  };

  return (
    <div className="p-6 text-slate-100">
      <h1 className="text-2xl font-semibold mb-4">Admin · Orders</h1>

      {!authed && (
        <div className="max-w-lg space-y-3 mb-6">
          <label className="block text-sm opacity-80">Enter admin token</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste ADMIN_API_TOKEN"
            className="w-full rounded-lg bg-white/10 ring-1 ring-white/15 px-3 py-2"
          />
          <button onClick={saveToken} className="rounded-lg bg-emerald-500 text-emerald-950 px-3 py-2">
            Save
          </button>
        </div>
      )}

      {authed && (
        <>
          <div className="mb-3 flex gap-2 items-center">
            <button onClick={load} className="rounded-lg bg-white/10 ring-1 ring-white/15 px-3 py-2 hover:bg-white/15">
              Refresh
            </button>
            <span className="text-sm opacity-70">{loading ? "Loading…" : `${orders.length} orders`}</span>
          </div>

          {err && <div className="text-red-300 mb-3">{err}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm bg-white/5 ring-1 ring-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="px-3 py-2 text-left">When</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Items</th>
                  <th className="px-3 py-2 text-left">Emailed</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-white/10">
                    <td className="px-3 py-2">{new Date(o.created * 1000).toLocaleString()}</td>
                    <td className="px-3 py-2">{o.email || "—"}</td>
                    <td className="px-3 py-2">{euros(o.total_cents)}</td>
                    <td className="px-3 py-2">
                      {(o.items || []).map((i, idx) => (
                        <div key={idx}>{i.qty}× {i.name}</div>
                      ))}
                    </td>
                    <td className="px-3 py-2">{o.emailed ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => resend(o.id)}
                        className="rounded-md bg-emerald-600 text-white px-2 py-1 hover:bg-emerald-500"
                      >
                        Resend receipt
                      </button>
                    </td>
                  </tr>
                ))}
                {!orders.length && !loading && (
                  <tr><td className="px-3 py-4" colSpan={6}>No paid orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
