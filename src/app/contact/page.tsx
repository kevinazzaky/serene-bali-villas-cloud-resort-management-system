import { Mail, MapPin, Phone } from "lucide-react";

import {
  PublicShell,
  SectionHeader,
} from "~/components/public/public-layout";
import { publicImages } from "~/constants/public-site";

export default function ContactPage() {
  return (
    <PublicShell>
      <main>
        <section className="bg-stone-100 px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <SectionHeader
              eyebrow="Contact"
              title="Begin your Serene Bali stay"
              description="For MVP, this form is a front-end contact surface. Database-backed contact messages are planned in the contact phase."
            />
            <div
              className="min-h-[460px] rounded-lg bg-cover bg-center"
              role="img"
              aria-label="Bali tropical landscape"
              style={{ backgroundImage: `url(${publicImages.contact})` }}
            />
          </div>
        </section>

        <section className="bg-white px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border border-stone-200 p-7">
              <h2 className="text-xl font-semibold text-stone-950">
                Sanctuary details
              </h2>
              <div className="mt-6 grid gap-5 text-sm text-stone-600">
                <span className="flex items-center gap-3">
                  <MapPin className="size-5 text-emerald-800" aria-hidden="true" />
                  Ubud and Sanur, Bali
                </span>
                <span className="flex items-center gap-3">
                  <Phone className="size-5 text-emerald-800" aria-hidden="true" />
                  +62 812 3456 7890
                </span>
                <span className="flex items-center gap-3">
                  <Mail className="size-5 text-emerald-800" aria-hidden="true" />
                  reservations@serenebali.com
                </span>
              </div>
            </div>

            <form className="grid gap-4 rounded-lg border border-stone-200 p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Full name
                  <input
                    className="rounded-md border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    name="fullName"
                    type="text"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-stone-700">
                  Email
                  <input
                    className="rounded-md border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    name="email"
                    type="email"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Subject
                <input
                  className="rounded-md border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  name="subject"
                  type="text"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Message
                <textarea
                  className="min-h-36 rounded-md border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  name="message"
                />
              </label>
              <button
                className="rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                type="button"
              >
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
