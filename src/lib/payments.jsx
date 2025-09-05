// src/lib/payments.jsx
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
let currentEmbedded = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export function destroyEmbeddedCheckout() {
  try { currentEmbedded?.destroy(); } catch {}
  currentEmbedded = null;
}

export async function createEmbeddedSession(cartItems, email) {
  const base =
    (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, "")) ||
    "http://localhost:4242";

  const resp = await fetch(`${base}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cartItems, customer_email: email || undefined }),
  });

  let data = null;
  try { data = await resp.json(); } catch {}
  if (!resp.ok) throw new Error((data && data.error) || "Checkout session failed");

  const clientSecret = data.clientSecret || data.client_secret;
  if (!clientSecret) throw new Error("Server did not return a client_secret");
  return { clientSecret };
}

export async function mountEmbeddedCheckout(clientSecret, mountSelector = "#stripe-checkout") {
  // ensure only ONE embedded instance exists
  destroyEmbeddedCheckout();

  // (optional) clear container
  const el = document.querySelector(mountSelector);
  if (el) el.innerHTML = "";

  const stripe = await getStripe();
  currentEmbedded = await stripe.initEmbeddedCheckout({ clientSecret });
  currentEmbedded.mount(mountSelector);
  return currentEmbedded;
}

export async function startCheckout(cartItems, mountSelector = "#stripe-checkout", email) {
  const { clientSecret } = await createEmbeddedSession(cartItems, email);
  return mountEmbeddedCheckout(clientSecret, mountSelector);
}
