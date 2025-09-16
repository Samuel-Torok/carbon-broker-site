export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
  const partners = [
    {
      id: "aurora-coffee",
      slug: "aurora-coffee",
      name: "Aurora Coffee × LuxOffset",
      lat: 49.6117, lng: 6.1319, // Luxembourg City (placeholder)
      address: "12 Rue du Marché, Luxembourg",
      image: "/partners/aurora.jpg",
      blurb: "Special ‘Carbon Coffee’ — each cup offsets emissions via LuxOffset.",
      products: ["Carbon-offset latte", "Beans + 1 kg offsets"]
    },
    {
      id: "green-bakery",
      slug: "green-bakery",
      name: "Green Bakery × LuxOffset",
      lat: 49.495, lng: 6.161, // Esch (placeholder)
      address: "3 Avenue de la Gare, Esch-sur-Alzette",
      image: "/partners/green-bakery.jpg",
      blurb: "Daily bread with bundled micro-offsets. Scan the cup/bag QR.",
      products: ["Offset croissant", "Family bread + 5 kg offsets"]
    }
  ];
  return res.status(200).json({ partners });
}
