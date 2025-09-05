// src/lib/payments.jsx
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

function normalizeCartItems(cartItems) {
  return cartItems.map((it) => ({
    type: it.type || it.meta?.type || "individual",
    quality: it.qualityLabel || it.meta?.quality || "std",
    size: Number(it.size || it.meta?.qty || 1), // tonnes
    csr: it.csr?.title ? { title: it.csr.title, price: it.csr.price ?? 0 } : null,
    addons: it.meta?.addons || null,
  }));
}

// send RAW items so server can read unitPriceEur / total / quantity / title
export async function createEmbeddedSession(cartItems) {
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cartItems,
      metadata: { cart: JSON.stringify(cartItems) }
    }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Checkout session failed");
  const clientSecret = data.clientSecret || data.client_secret;
  if (!clientSecret) throw new Error("Missing client secret from server");
  return { clientSecret };
}


// 2) Mount the Embedded Checkout UI into your page
export async function mountEmbeddedCheckout(clientSecret, mountSelector = "#stripe-checkout") {
  const stripe = await getStripe();
  const embedded = await stripe.initEmbeddedCheckout({ clientSecret });
  embedded.mount(mountSelector);
  return embedded;
}

// 3) Backward-compatible wrapper: startCheckout now uses Embedded Checkout
export async function startCheckout(cartItems, mountSelector = "#stripe-checkout") {
  const { clientSecret } = await createEmbeddedSession(cartItems);
  return mountEmbeddedCheckout(clientSecret, mountSelector);
}
