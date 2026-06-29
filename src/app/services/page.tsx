import { Car, ChefHat, Sparkles, SprayCan } from "lucide-react";

import {
  PublicShell,
  SectionHeader,
} from "~/components/public/public-layout";
import { publicImages, services } from "~/constants/public-site";

const icons = [Sparkles, Car, SprayCan, ChefHat];

export default function ServicesPage() {
  return (
    <PublicShell>
      <main>
        <section className="bg-white px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeader
              eyebrow="Services"
              title="Concierge services prepared for the guest portal"
              description="The MVP keeps service workflows simple: guests submit requests, managers review status, and operations stay traceable."
            />
            <div
              className="min-h-[480px] rounded-lg bg-cover bg-center"
              role="img"
              aria-label="In villa wellness service"
              style={{ backgroundImage: `url(${publicImages.spa})` }}
            />
          </div>
        </section>

        <section className="bg-emerald-950 px-5 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = icons[index] ?? Sparkles;
              return (
                <article
                  className="rounded-lg border border-white/15 bg-white/[0.08] p-6"
                  key={service.title}
                >
                  <Icon className="size-7 text-emerald-200" aria-hidden="true" />
                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-emerald-50/80">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
