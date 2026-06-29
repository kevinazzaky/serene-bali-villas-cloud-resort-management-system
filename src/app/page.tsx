import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import {
  BookingSearchBar,
  PublicShell,
  SectionHeader,
  VillaCard,
} from "~/components/public/public-layout";
import { LandingVillaAnimation } from "~/components/public/landing-villa-animation";
import { amenities, publicImages, services } from "~/constants/public-site";
import { api } from "~/trpc/server";

export default async function Home() {
  const villas = await api.villa.getPublicList();

  return (
    <PublicShell>
      <main>
        <section
          className="relative overflow-hidden bg-cover bg-center px-5 py-10 text-white"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(12,18,24,0.92), rgba(15,76,92,0.76), rgba(12,18,24,0.48)), url(${publicImages.hero})`,
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/45 to-transparent" />
          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-10 py-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div className="pt-10 lg:pb-24">
              <p className="text-sm font-semibold uppercase text-cyan-100">
                Cloud resort management for Bali villas
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight sm:text-7xl">
                Serene Bali Villas
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100">
                Private villa stays connected to real-time availability,
                digital concierge, payment records, and manager-ready daily
                operations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
                  href="/booking"
                >
                  Find Your Sanctuary
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  className="rounded-md border border-white/60 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  href="/experiences"
                >
                  Explore Experiences
                </Link>
              </div>
              <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-white/15 rounded-lg border border-white/15 bg-white/10 backdrop-blur">
                {[
                  ["MVP", "Booking flow"],
                  ["24/7", "Concierge"],
                  ["Cloud", "Manager suite"],
                ].map(([value, label]) => (
                  <div className="px-4 py-3" key={label}>
                    <p className="text-lg font-semibold text-white">{value}</p>
                    <p className="mt-1 text-xs text-stone-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-5 lg:pt-10">
              <LandingVillaAnimation />
              <div className="rounded-lg border border-white/15 bg-white/95 p-3 text-slate-950 shadow-2xl shadow-slate-950/30">
                <BookingSearchBar />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {[
              {
                title: "Real-time availability",
                description:
                  "Search villa dates and continue into the booking flow without manual back-and-forth.",
                icon: ShieldCheck,
              },
              {
                title: "Guest experience portal",
                description:
                  "Guests can manage stays, requests, payments, and concierge activity from one place.",
                icon: Sparkles,
              },
              {
                title: "Manager-ready operations",
                description:
                  "Reservations, readiness, villa inventory, finance, and dummy IoT stay connected.",
                icon: CheckCircle2,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                  key={item.title}
                >
                  <Icon className="size-6 text-cyan-800" aria-hidden="true" />
                  <h2 className="mt-5 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-white px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow="Villa Sanctuary"
                title="Featured private villas"
                description="Each villa is seeded from the resort database and prepared for the next booking and inventory phases."
              />
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-cyan-800 px-4 py-2 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-50"
                href="/booking"
              >
                View availability
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {villas.slice(0, 3).map((villa) => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div
              className="min-h-[520px] rounded-lg bg-cover bg-center"
              role="img"
              aria-label="Private tropical pool villa"
              style={{ backgroundImage: `url(${publicImages.poolVilla})` }}
            />
            <div>
              <SectionHeader
                eyebrow="Amenities"
                title="Designed for quiet stays and efficient operations"
                description="The public experience and the manager suite share the same source of truth: villas, amenities, readiness, bookings, and service requests."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <article
                    className="rounded-lg border border-stone-200 p-5"
                    key={amenity.title}
                  >
                    <h2 className="font-semibold text-slate-950">
                      {amenity.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {amenity.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-5 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Services"
              title="Concierge workflows from guest request to staff action"
              description="MVP service categories are designed to connect the guest portal with manager-side service request handling."
              tone="dark"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <article
                  className="rounded-lg border border-white/15 bg-white/[0.08] p-5"
                  key={service.title}
                >
                  <h2 className="font-semibold text-white">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-emerald-50/80">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
