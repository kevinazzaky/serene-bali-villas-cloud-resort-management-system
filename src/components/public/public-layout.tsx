import {
  CalendarDays,
  ChevronRight,
  Hotel,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import Link from "next/link";

import { currencyFormatter, publicImages } from "~/constants/public-site";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/amenities", label: "Amenities" },
  { href: "/experiences", label: "Experiences" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

type VillaCardVilla = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string | null;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: unknown;
  images: { imageUrl: string; altText: string | null }[];
  amenities: { name: string }[];
};

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-cyan-200">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="font-semibold text-slate-950">
            Serene Bali Villas
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              className="transition hover:text-cyan-800"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800 sm:inline-flex"
            href="/login"
          >
            Guest Login
          </Link>
          <Link
            className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            href="/booking"
          >
            Book
          </Link>
          <button
            aria-label="Open navigation"
            className="rounded-md border border-slate-300 p-2 text-slate-700 md:hidden"
            type="button"
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 px-5 py-12 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
              <Leaf className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">
              Serene Bali Villas
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            A cloud-managed resort experience for private villas, thoughtful
            service, and calm tropical stays across Bali.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-400">
            Explore
          </h2>
          <div className="mt-4 grid gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                className="text-slate-300 transition hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-400">
            Contact
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              Ubud and Sanur, Bali
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-4" aria-hidden="true" />
              +62 812 3456 7890
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4" aria-hidden="true" />
              reservations@serenebali.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div className="max-w-3xl">
      <p
        className={
          isDark
            ? "text-sm font-semibold uppercase text-cyan-100"
            : "text-sm font-semibold uppercase text-cyan-800"
        }
      >
        {eyebrow}
      </p>
      <h1
        className={
          isDark
            ? "mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl"
            : "mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl"
        }
      >
        {title}
      </h1>
      <p
        className={
          isDark
            ? "mt-5 text-base leading-8 text-slate-100"
            : "mt-5 text-base leading-8 text-slate-600"
        }
      >
        {description}
      </p>
    </div>
  );
}

export function BookingSearchBar() {
  return (
    <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/10 md:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto]">
      <label className="grid gap-2 text-sm font-medium text-slate-600">
        Check-in
        <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3">
          <CalendarDays className="size-4 text-cyan-800" aria-hidden="true" />
          <input
            className="w-full bg-transparent text-slate-950 outline-none"
            name="checkIn"
            type="date"
          />
        </span>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-600">
        Check-out
        <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3">
          <CalendarDays className="size-4 text-cyan-800" aria-hidden="true" />
          <input
            className="w-full bg-transparent text-slate-950 outline-none"
            name="checkOut"
            type="date"
          />
        </span>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-600">
        Adults
        <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3">
          <Users className="size-4 text-cyan-800" aria-hidden="true" />
          <input
            className="w-full bg-transparent text-slate-950 outline-none"
            defaultValue={2}
            min={1}
            name="adults"
            type="number"
          />
        </span>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-600">
        Children
        <span className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3">
          <Users className="size-4 text-cyan-800" aria-hidden="true" />
          <input
            className="w-full bg-transparent text-slate-950 outline-none"
            defaultValue={0}
            min={0}
            name="children"
            type="number"
          />
        </span>
      </label>
      <Link
        className="flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 md:self-end"
        href="/booking"
      >
        Search
        <ChevronRight className="size-4" aria-hidden="true" />
      </Link>
    </form>
  );
}

export function VillaCard({ villa }: { villa: VillaCardVilla }) {
  const image = villa.images[0]?.imageUrl ?? publicImages.poolVilla;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div
        className="aspect-[4/3] bg-cover bg-center"
        role="img"
        aria-label={villa.images[0]?.altText ?? villa.name}
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {villa.name}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="size-4" aria-hidden="true" />
              {villa.location ?? "Bali"}
            </p>
          </div>
          <p className="text-right text-sm font-semibold text-cyan-800">
            {currencyFormatter.format(Number(villa.basePrice))}
            <span className="block text-xs font-normal text-slate-500">
              per night
            </span>
          </p>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {villa.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {villa.capacity} guests
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {villa.bedrooms} bedrooms
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {villa.bathrooms} baths
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {villa.amenities.slice(0, 3).map((amenity) => (
            <span
              className="rounded-md border border-cyan-100 bg-cyan-50 px-2 py-1 text-xs text-cyan-900"
              key={amenity.name}
            >
              {amenity.name}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export const featureIcons = {
  hotel: Hotel,
  waves: Waves,
  sparkles: Sparkles,
  leaf: Leaf,
};
