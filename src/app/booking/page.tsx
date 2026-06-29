import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  BookingSearchBar,
  PublicShell,
  SectionHeader,
  VillaCard,
} from "~/components/public/public-layout";
import { publicImages } from "~/constants/public-site";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const villas = await api.villa.getPublicList();

  return (
    <PublicShell>
      <main>
        <section
          className="bg-cover bg-center px-5 py-20 text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(28,25,23,0.75), rgba(6,78,59,0.78)), url(${publicImages.resort})`,
          }}
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Find Your Sanctuary"
              title="Search available villas"
              description="Phase 2 provides the public search surface. The next booking phase will connect this form to server-side availability checks and double-booking prevention."
              tone="dark"
            />
            <div className="mt-10 max-w-6xl">
              <BookingSearchBar />
            </div>
          </div>
        </section>

        <section className="bg-stone-100 px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow="Available inventory"
                title="Active villas from the database"
                description="These cards are populated from Prisma seed data and will become filtered results in the availability phase."
              />
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                href="/login"
              >
                Continue as guest
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {villas.map((villa) => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
