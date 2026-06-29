import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  PublicShell,
  SectionHeader,
} from "~/components/public/public-layout";
import { experiences, publicImages } from "~/constants/public-site";

export default function ExperiencesPage() {
  return (
    <PublicShell>
      <main>
        <section
          className="flex min-h-[560px] items-end bg-cover bg-center px-5 py-16 text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(28,25,23,0.2), rgba(28,25,23,0.82)), url(${publicImages.tropical})`,
          }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <SectionHeader
              eyebrow="Experiences"
              title="Curated moments across Bali"
              description="Design the guest journey from discovery to in-stay requests: nature, dining, wellness, and private villa rituals."
              tone="dark"
            />
          </div>
        </section>

        <section className="bg-slate-50 px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {experiences.map((experience) => (
              <article
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                key={experience.title}
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  role="img"
                  aria-label={experience.title}
                  style={{ backgroundImage: `url(${experience.image})` }}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-950">
                    {experience.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {experience.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white px-5 py-16">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-lg border border-slate-200 p-8">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-800">
                Ready to plan
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                Match your dates with a villa sanctuary.
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              href="/booking"
            >
              Search availability
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
