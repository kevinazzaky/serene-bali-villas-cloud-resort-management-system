export const publicImages = {
  hero:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85",
  poolVilla:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
  resort:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
  spa:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85",
  dining:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85",
  bedroom:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85",
  tropical:
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
  contact:
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=85",
};

export const amenities = [
  {
    title: "Private Pool Sanctuaries",
    description:
      "Quiet pool decks framed by tropical planting, morning sun, and dedicated villa service.",
  },
  {
    title: "Smart Villa Comfort",
    description:
      "Lighting, climate, and readiness workflows prepared for a cloud-managed guest experience.",
  },
  {
    title: "In-villa Wellness",
    description:
      "Spa rituals, outdoor bathing, and recovery-focused amenities available on request.",
  },
  {
    title: "Concierge Dining",
    description:
      "Floating breakfast, private chef dinners, and curated Balinese tasting moments.",
  },
];

export const experiences = [
  {
    title: "Sunrise Rice Terrace Walk",
    description:
      "A guided early-morning route through Ubud scenery with breakfast prepared back at the villa.",
    image: publicImages.tropical,
  },
  {
    title: "Private Pool Ceremony",
    description:
      "A quiet flower bath and poolside setup for couples, families, or solo reset time.",
    image: publicImages.poolVilla,
  },
  {
    title: "Chef's Balinese Table",
    description:
      "A private in-villa dinner built around local produce, sambal, seafood, and herbal drinks.",
    image: publicImages.dining,
  },
];

export const services = [
  {
    title: "Spa & Recovery",
    description:
      "Massage, flower bath, aromatherapy, and post-flight recovery treatments in your villa.",
  },
  {
    title: "Transport & Arrivals",
    description:
      "Airport pickup, day drivers, scooter support, and arrival coordination for every stay.",
  },
  {
    title: "Housekeeping Readiness",
    description:
      "Stay preparation, linen status, pool checks, and maintenance tasks coordinated by managers.",
  },
  {
    title: "In-villa Dining",
    description:
      "Breakfast, floating trays, private chef dinners, minibar restock, and dietary requests.",
  },
];

export const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
