// src/lib/payments.jsx
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export async function startCheckout(cartItems) {
  const safeItems = cartItems.map((it) => ({
    type: (it.type || it.meta?.type || "individual"),
    quality: (it.qualityLabel || it.meta?.quality || "std"),
    size: Number(it.size || it.meta?.qty || 1), // tonnes
    csr: it.csr?.title ? { title: it.csr.title, price: it.csr.price ?? 0 } : null,
    addons: it.meta?.addons || null,
  }));

  const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: safeItems }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Checkout session failed");

  if (data.url) {
    window.location.href = data.url; // simplest
    return;
  }

  const stripe = await getStripe();
  await stripe.redirectToCheckout({ sessionId: data.id });
}
