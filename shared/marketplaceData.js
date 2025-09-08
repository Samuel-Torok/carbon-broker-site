// Single source of truth for Marketplace items.
// Edit here only: names, prices, availability, images, etc.

// STOCK (buy now)
export const MARKET_STOCK = [
  {
    id: "gs-cook-ken-2019",
    title: "Clean Cookstoves – Kenya",
    standard: "Gold Standard",
    vintage: "2019–2023",
    type: "Cookstoves",
    origin: "Kyrgiztan",
    priceEur: 19,             // €/tCO₂e
    stockTonnes: 42,
    minOrderTonnes: 1,
    image: "/images/market/cookstoves.jpg",
    icon: "flame",            // "flame" | "leaf" | "wind" | "factory" | "droplets"
    active: true,
  },
  {
    id: "verra-redd-bra-2021",
    title: "REDD+ Rainforest Protection – Brazil",
    standard: "Verra (VCS)",
    vintage: "2021–2024",
    type: "REDD+",
    origin: "Brazil",
    priceEur: 15,
    stockTonnes: 17,
    minOrderTonnes: 1,
    image: "/images/market/redd.jpg",
    icon: "leaf",
    active: true,
  },
  {
    id: "gs-wind-ind-2020",
    title: "Wind Power – India",
    standard: "Gold Standard",
    vintage: "2020–2022",
    type: "Renewable Energy",
    origin: "India",
    priceEur: 12,
    stockTonnes: 60,
    minOrderTonnes: 5,
    image: "/images/market/wind.jpg",
    icon: "wind",
    active: true,
  },
];

// SAMPLES (enquire)
export const MARKET_SAMPLES = [
  {
    id: "sample-biochar-eu",
    title: "Biochar – EU smallholder program",
    standard: "Gold Standard / Puro.earth",
    indicative: "€20–€35 / tCO₂e",
    type: "Biochar",
    origin: "EU",
    image: "/images/market/biochar.jpg",
    icon: "factory",
    active: true,
  },
  {
    id: "sample-blue-carbon",
    title: "Blue Carbon – Mangrove restoration",
    standard: "Verra (VCS)",
    indicative: "€18–€28 / tCO₂e",
    type: "Nature-based",
    origin: "Southeast Asia",
    image: "/images/market/mangroves.jpg",
    icon: "droplets",
    active: true,
  },
];
