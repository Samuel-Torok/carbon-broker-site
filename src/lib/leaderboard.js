export const QUALITY_COEFF = { standard: 1.0, premium: 1.25, elite: 1.5 };


export async function getLeaderboard(group="individual") {
  const r = await fetch(`/api/leaderboard?group=${encodeURIComponent(group)}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Failed to load leaderboard");
  return r.json();
}


// client-side adds are now NO-OPs (kept to avoid breaking imports)
export function addOptedInCompaniesFromCart() {}
export function addOptedInIndividualsFromCart() {}
