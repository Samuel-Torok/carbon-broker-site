// src/lib/payments.jsx
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
let currentEmbedded = null;

// same-origin on Vercel; localhost only in .env.local
const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const isProdHost = typeof window !== "undefined" && !/^localhost|127\.0\.0\.1$/.test(window.location.hostname);
const API_BASE = isProdHost ? "" : (fromEnv || "");

function getStripe() {
  if (!stripePromise) {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!pk) throw new Error("Missing VITE_STRIPE_PUBLISHABLE_KEY");
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}
export { getStripe };

export function destroyEmbeddedCheckout() {
  try { currentEmbedded?.destroy(); } catch {}
  currentEmbedded = null;
}

export async function createEmbeddedSession(cartItems, email, returnUrl) {
  const resp = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cartItems,
      customer_email: email || undefined,
      return_url: returnUrl ?? `${window.location.origin}/checkout/return`,
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || `Server ${resp.status}`);
  const clientSecret = data.client_secret || data.clientSecret;
  if (!clientSecret) throw new Error("No client_secret returned by server");
  return { clientSecret };
}

export async function mountEmbeddedCheckout(clientSecret, mountSelector = "#stripe-checkout") {
  destroyEmbeddedCheckout();
  const el = document.querySelector(mountSelector);
  if (el) el.innerHTML = "";
  const stripe = await getStripe();
  currentEmbedded = await stripe.initEmbeddedCheckout({ clientSecret });
  currentEmbedded.mount(mountSelector);
  return currentEmbedded;
}

export async function startCheckout(items, mountSelector = "#stripe-checkout", returnUrl) {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      buyer, // <<— NEW: forward the form data
      return_url: returnUrl ?? `${window.location.origin}/checkout/return`,
      customer_email: items?.[0]?.meta?.meEmail || undefined,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Server ${res.status}`);
  const clientSecret = data.client_secret || data.clientSecret;
  if (!clientSecret) throw new Error("No client_secret returned by server");
  const stripe = await getStripe();
  destroyEmbeddedCheckout();
  const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
  checkout.mount(mountSelector);
  currentEmbedded = checkout;
  return checkout;
}
