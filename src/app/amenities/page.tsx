import { Bath, Leaf, Utensils, Waves, Wifi } from "lucide-react";

import {
  PublicShell,
  SectionHeader,
} from "~/components/public/public-layout";
import { amenities, publicImages } from "~/constants/public-site";

const highlights = [
  { label: "Private pools", icon: Waves },
  { label: "Outdoor baths", icon: Bath },
  { label: "Smart comfort", icon: Wifi },
  { label: "In-villa dining", icon: Utensils },
  { label: "Tropical gardens", icon: Leaf },
];

export default function AmenitiesPage() {
  return (
    <PublicShell>
      <main>
        <section className="bg-stone-100 px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeader
              eyebrow="Amenities"
              title="Sanctuary features for calm stays"
              description="A refined collection of pool, wellness, dining, and comfort amenities prepared for both guest-facing pages and manager inventory."
            />
            <div
              className="min-h-[460px] rounded-lg bg-cover bg-center"
              role="img"
              aria-label="Bali villa pool and tropical amenities"
              style={{ backgroundImage: `url(${publicImages.poolVilla})` }}
            />
          </div>
        </section>

        <section className="bg-white px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="rounded-lg border border-stone-200 p-5 text-center"
                  key={item.label}
                >
                  <Icon
                    className="mx-auto size-7 text-emerald-800"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-sm font-semibold text-stone-950">
                    {item.label}
                  </h2>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-stone-50 px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
            {amenities.map((amenity) => (
              <article
                className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm"
                key={amenity.title}
              >
                <h2 className="text-xl font-semibold text-stone-950">
                  {amenity.title}
                </h2>
                <p className="mt-4 leading-7 text-stone-600">
                  {amenity.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
